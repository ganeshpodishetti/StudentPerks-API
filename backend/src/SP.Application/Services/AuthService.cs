using System.Globalization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SP.Application.Contracts;
using SP.Application.Dtos.Auth;
using SP.Application.Helper;
using SP.Application.Mapping;
using SP.Domain.Entities;
using SP.Domain.Options;
using SP.Infrastructure.Context;

namespace SP.Application.Services;

public class AuthService(
    UserManager<User> userManager,
    SignInManager<User> signInManager,
    IJwtHelper jwtHelper,
    IRefreshTokenHelper refreshTokenHelper,
    IOptions<JwtOptions> jwtOptions,
    IHttpContextAccessor httpContextAccessor,
    SpDbContext dbContext,
    ILogger<AuthService> logger)
    : IAuth
{
    public async Task<RegisterResponse> RegisterAsync(RegisterRequest request,
        CancellationToken cancellationToken)
    {
        var existingUser = await userManager.FindByEmailAsync(request.Email);

        if (existingUser is not null)
            throw new InvalidOperationException("Email already exists.");

        var user = request.ToEntity();

        var userCreated = await userManager.CreateAsync(user, request.Password);
        if (!userCreated.Succeeded)
            throw new InvalidOperationException(
                $"User creation failed: {string.Join(", ", userCreated.Errors.Select(e => e.Description))}");
        return user.ToDto();
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken)
    {
        var user = await dbContext.Users
                                  .FirstOrDefaultAsync(u => u.Email == request.Email, cancellationToken)
                   ?? throw new InvalidOperationException("Invalid email or password.");

        // Add this check in LoginAsync after retrieving the user
        if (user is { LockoutEnabled: true, LockoutEnd: not null } && user.LockoutEnd.Value > DateTime.UtcNow)
            throw new InvalidOperationException("Account is temporarily locked. Please try again later.");

        var isPasswordValid = await signInManager.CheckPasswordSignInAsync(user, request.Password, false);

        if (!isPasswordValid.Succeeded) throw new InvalidOperationException("Invalid email or password.");

        var accessToken = await jwtHelper.GenerateJwtToken(user);
        var refreshToken = refreshTokenHelper.GenerateRefreshToken();

        var refreshTokenEntity = new RefreshToken
        {
            Token = refreshToken,
            ExpirationDate = DateTime.UtcNow.AddDays(jwtOptions.Value.RefreshTokenExpirationInDays),
            IsRevoked = false,
            UserId = user.Id
        };

        await dbContext.RefreshTokens.AddAsync(refreshTokenEntity, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
        logger.LogInformation("User {UserName} logged in successfully and refresh token generated.", user.UserName);

        // var accessTokenExpiration = DateTime.UtcNow.AddMinutes(jwtOptions.Value.AccessTokenExpirationInMinutes);
        var refreshTokenExpiration = DateTime.UtcNow.AddDays(jwtOptions.Value.RefreshTokenExpirationInDays);

        // Set the refresh token as an HTTP-only cookie
        httpContextAccessor.HttpContext.Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            Expires = refreshTokenExpiration,
            SameSite = SameSiteMode.Strict,
            Path = "/"
        });

        return new LoginResponse(user.Id,
            user.FirstName,
            user.LastName,
            user.Email!,
            accessToken);
    }

    public async Task<RefreshTokenResponse> RefreshTokenAsync(CancellationToken cancellationToken)
    {
        var (existingUser, oldRefreshToken) = await refreshTokenHelper.ValidateRefreshToken(cancellationToken);

        oldRefreshToken.IsRevoked = true;
        oldRefreshToken.LastModifiedAt = DateTime.UtcNow;
        dbContext.RefreshTokens.Update(oldRefreshToken);

        var newAccessToken = await jwtHelper.GenerateJwtToken(existingUser);
        var newRefreshToken = refreshTokenHelper.GenerateRefreshToken();

        var refreshTokenEntity = new RefreshToken
        {
            Token = newRefreshToken,
            ExpirationDate = DateTime.UtcNow.AddDays(jwtOptions.Value.RefreshTokenExpirationInDays),
            IsRevoked = false,
            UserId = existingUser.Id
        };

        await dbContext.RefreshTokens.AddAsync(refreshTokenEntity, cancellationToken);

        logger.LogInformation("Cleaning up old revoked refresh tokens for user {UserName}", existingUser.UserName);
        await TokensCleanupHelper.CleanupExpiredAndRevokedTokensAsync(dbContext, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
        logger.LogInformation("New refresh token generated and saved for user {UserName}", existingUser.UserName);

        var newAccessTokenExpiration = DateTime.UtcNow.AddMinutes(jwtOptions.Value.AccessTokenExpirationInMinutes)
                                               .ToString(CultureInfo.InvariantCulture);

        // Set the new refresh token in the cookie
        httpContextAccessor.HttpContext?.Response.Cookies.Append("refreshToken", newRefreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            Expires = refreshTokenEntity.ExpirationDate,
            SameSite = SameSiteMode.Strict,
            Path = "/"
        });

        return new RefreshTokenResponse(newAccessToken,
            newAccessTokenExpiration);
    }

    public async Task<bool> LogoutAsync(CancellationToken cancellationToken)
    {
        var refreshToken = httpContextAccessor.HttpContext?.Request.Cookies["refreshToken"];

        // If there's a refresh token, revoke it in the database
        if (!string.IsNullOrEmpty(refreshToken))
        {
            var token = await dbContext.RefreshTokens
                                       .FirstOrDefaultAsync(rt => rt.Token == refreshToken, cancellationToken);

            if (token != null)
            {
                // Mark the token as revoked
                token.IsRevoked = true;
                token.LastModifiedAt = DateTime.UtcNow;
                dbContext.RefreshTokens.Update(token);
                await dbContext.SaveChangesAsync(cancellationToken);

                logger.LogInformation("Refresh token revoked for user ID: {UserId}", token.UserId);
            }
        }

        // Clear the refresh token cookie
        httpContextAccessor.HttpContext?.Response.Cookies.Delete("refreshToken", new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Path = "/"
        });

        // Clean up old tokens
        await TokensCleanupHelper.CleanupExpiredAndRevokedTokensAsync(dbContext, cancellationToken);
        return true;
    }

    public async Task<CurrentUserResponse?> GetCurrentUserAsync(CancellationToken cancellationToken)
    {
        var (user, _) = await refreshTokenHelper.ValidateRefreshToken(cancellationToken);
        return new CurrentUserResponse(user.Id, user.Email);
    }

    public async Task<bool> ValidateRefreshTokenAsync(CancellationToken cancellationToken)
    {
        await refreshTokenHelper.ValidateRefreshToken(cancellationToken);
        return true;
    }
}