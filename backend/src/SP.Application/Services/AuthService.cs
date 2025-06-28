using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SP.Application.Contracts;
using SP.Application.Dtos.Auth;
using SP.Application.ErrorHandler;
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
    public async Task<Result<RegisterResponse>> RegisterAsync(RegisterRequest request,
        CancellationToken cancellationToken)
    {
        var existingUser = await userManager.FindByEmailAsync(request.Email);

        if (existingUser is not null)
            return Result<RegisterResponse>.Failure(CustomErrors.EmailAlreadyExists);

        var user = request.ToEntity();
        var userCreated = await userManager.CreateAsync(user, request.Password);
        if (userCreated.Succeeded) return Result<RegisterResponse>.Success(user.ToDto());
        var errors = userCreated.Errors.Select(e => e.Description).ToList();
        return Result<RegisterResponse>.Failure(errors);
    }

    public async Task<Result<LoginResponse>> LoginAsync(LoginRequest request, CancellationToken cancellationToken)
    {
        var user = await dbContext.Users
                                  .FirstOrDefaultAsync(u => u.Email == request.Email, cancellationToken);
        switch (user)
        {
            case null:
                return Result<LoginResponse>.Failure(CustomErrors.InvalidCredentials);
            case { LockoutEnabled: true, LockoutEnd: not null } when user.LockoutEnd.Value > DateTime.UtcNow:
                return Result<LoginResponse>.Failure(CustomErrors.AccountLocked);
        }

        var isPasswordValid = await signInManager.CheckPasswordSignInAsync(user, request.Password, false);

        if (!isPasswordValid.Succeeded) return Result<LoginResponse>.Failure(CustomErrors.InvalidCredentials);

        var accessToken = await jwtHelper.GenerateJwtToken(user);
        var refreshToken = refreshTokenHelper.GenerateRefreshToken();
        var refreshTokenExpiration = DateTime.UtcNow.AddDays(jwtOptions.Value.RefreshTokenExpirationInDays);
        var accessTokenExpiration = DateTime.UtcNow.AddMinutes(jwtOptions.Value.AccessTokenExpirationInMinutes);

        var refreshTokenEntity = AuthExtension.CreateRefreshTokenEntity(refreshToken, user.Id);

        await dbContext.RefreshTokens.AddAsync(refreshTokenEntity, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
        logger.LogInformation("User {UserName} logged in successfully and refresh token generated.", user.UserName);

        var cookieOptions = RefreshTokenCookieHelper.CreateRefreshTokenCookieOptions(refreshTokenExpiration);

        // For development, you might want to conditionally set Secure to false
        //if (httpContextAccessor.HttpContext?.Request.IsHttps == false) cookieOptions.Secure = false;

        // Set the refresh token as an HTTP-only cookie
        httpContextAccessor.HttpContext.Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);

        var response = user.ToLoginDto(accessToken.Value!, accessTokenExpiration);
        return Result<LoginResponse>.Success(response);
    }

    public async Task<Result<RefreshTokenResponse>> RefreshTokenAsync(string refreshToken,
        CancellationToken cancellationToken)
    {
        var validationResult =
            await refreshTokenHelper.ValidateRefreshToken(refreshToken, cancellationToken);

        // Check if validation was successful
        if (!validationResult.IsSuccess) return Result<RefreshTokenResponse>.Failure(validationResult.Error!);

        var (existingUser, oldRefreshToken) = validationResult.Value;

        oldRefreshToken.IsRevoked = true;
        oldRefreshToken.LastModifiedAt = DateTime.UtcNow;
        dbContext.RefreshTokens.Update(oldRefreshToken);

        var newAccessToken = await jwtHelper.GenerateJwtToken(existingUser);
        var newRefreshToken = refreshTokenHelper.GenerateRefreshToken();

        var newRefreshTokenEntity = AuthExtension.CreateRefreshTokenEntity(newRefreshToken, existingUser.Id);
        await dbContext.RefreshTokens.AddAsync(newRefreshTokenEntity, cancellationToken);

        logger.LogInformation("Cleaning up old revoked refresh tokens for user {UserName}", existingUser.UserName);
        await TokensCleanupHelper.CleanupExpiredAndRevokedTokensAsync(dbContext, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
        logger.LogInformation("New refresh token generated and saved for user {UserName}", existingUser.UserName);

        var newAccessTokenExpiration = DateTime.UtcNow.AddMinutes(jwtOptions.Value.AccessTokenExpirationInMinutes);

        var cookieOptions =
            RefreshTokenCookieHelper.CreateRefreshTokenCookieOptions(newRefreshTokenEntity.ExpirationDate);

        // Set the new refresh token in the cookie
        httpContextAccessor.HttpContext.Response.Cookies.Append("refreshToken", newRefreshToken, cookieOptions);

        var response = AuthExtension.ToRefreshTokenDto(newAccessToken.Value!, newAccessTokenExpiration);
        return Result<RefreshTokenResponse>.Success(response);
    }

    public async Task<Result<CurrentUserResponse?>> GetCurrentUserAsync(string refreshToken,
        CancellationToken cancellationToken)
    {
        var validationResult = await refreshTokenHelper.ValidateRefreshToken(refreshToken, cancellationToken);

        if (!validationResult.IsSuccess) return Result<CurrentUserResponse?>.Failure(validationResult.Error!);

        var (user, _) = validationResult.Value;
        return Result<CurrentUserResponse?>.Success(user.ToCurrentUserDto());
    }

    public async Task<Result<bool>> ValidateRefreshTokenAsync(string refreshToken, CancellationToken cancellationToken)
    {
        var validationResult = await refreshTokenHelper.ValidateRefreshToken(refreshToken, cancellationToken);

        return !validationResult.IsSuccess
            ? Result<bool>.Failure(validationResult.Error!)
            : Result<bool>.Success(true);
    }

    public async Task<Result<bool>> RevokeRefreshTokenAsync(string refreshToken, CancellationToken cancellationToken)
    {
        // If there's a refresh token, revoke it in the database
        if (!string.IsNullOrEmpty(refreshToken))
        {
            var token = await dbContext.RefreshTokens
                                       .FirstOrDefaultAsync(rt => rt.Token == refreshToken, cancellationToken);
            if (token is null) return Result<bool>.Failure(CustomErrors.InvalidToken);

            // Mark the token as revoked
            token.IsRevoked = true;
            token.LastModifiedAt = DateTime.UtcNow;
            dbContext.RefreshTokens.Update(token);
            await dbContext.SaveChangesAsync(cancellationToken);

            logger.LogInformation("Refresh token revoked for user ID: {UserId}", token.UserId);
        }

        httpContextAccessor.HttpContext.Response.Cookies.Delete("refreshToken");
        // Clean up old tokens
        await TokensCleanupHelper.CleanupExpiredAndRevokedTokensAsync(dbContext, cancellationToken);
        return Result<bool>.Success(true);
    }
}