using System.Globalization;
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
                   ?? throw new InvalidOperationException("Email not found.");

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

        var accessTokenExpiration = DateTime.UtcNow.AddMinutes(jwtOptions.Value.AccessTokenExpirationInMinutes);
        var refreshTokenExpiration = DateTime.UtcNow.AddDays(jwtOptions.Value.RefreshTokenExpirationInDays);

        return new LoginResponse(accessToken,
            accessTokenExpiration,
            refreshToken,
            refreshTokenExpiration);
    }

    public async Task<RefreshTokenResponse> RefreshTokenAsync(RefreshTokenRequest request,
        CancellationToken cancellationToken)
    {
        var existingUser = await dbContext.Users
                                          .Include(u => u.RefreshTokens)
                                          .SingleOrDefaultAsync(
                                              u => u.RefreshTokens.Any(rt => rt.Token == request.RefreshToken),
                                              cancellationToken);

        if (existingUser?.RefreshTokens is null)
            throw new InvalidOperationException("User not found or no refresh tokens associated with the user.");

        var oldRefreshToken = existingUser.RefreshTokens
                                          .Single(rt => rt.Token == request.RefreshToken);

        if (!refreshTokenHelper.ValidateRefreshToken(existingUser, oldRefreshToken))
            throw new InvalidOperationException("Invalid or expired refresh token.");

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

        return new RefreshTokenResponse(newAccessToken,
            newAccessTokenExpiration,
            newRefreshToken,
            refreshTokenEntity.ExpirationDate.ToString(CultureInfo.InvariantCulture));
    }
}