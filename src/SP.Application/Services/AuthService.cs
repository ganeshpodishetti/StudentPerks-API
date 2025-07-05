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
using SP.Domain.Enums;
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
    public async Task<Result<RegisterResponse>> RegisterAsync(RegisterRequest request,
        CancellationToken cancellationToken)
    {
        // Check if an admin role already exists
        var adminExists = await userManager.GetUsersInRoleAsync(nameof(Roles.Admin));
        if (adminExists.Any())
        {
            logger.LogWarning("Registration attempt blocked - admin already exists");
            return Result<RegisterResponse>.Failure(CustomErrors.RegistrationNotAllowed);
        }

        var existingUser = await userManager.FindByEmailAsync(request.Email);

        if (existingUser is not null)
            return Result<RegisterResponse>.Failure(CustomErrors.EmailAlreadyExists);

        var user = request.ToEntity();
        var userCreated = await userManager.CreateAsync(user, request.Password);
        if (userCreated.Succeeded)
        {
            // Assign the Admin role to the newly created user
            var roleCreated = await userManager.AddToRoleAsync(user, nameof(Roles.Admin));
            if (roleCreated.Succeeded) return Result<RegisterResponse>.Success(user.ToDto());
            var errorsRole = roleCreated.Errors.Select(e => e.Description).ToList();
            logger.LogError("Failed to assign Admin role to user {UserName}: {Errors}", user.UserName, errorsRole);
            return Result<RegisterResponse>.Failure(errorsRole);
        }

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

        await TokensCleanupHelper.SetToTokensFalseAsync(dbContext, cancellationToken);

        var accessToken = await jwtHelper.GenerateJwtToken(user);
        var refreshToken = refreshTokenHelper.GenerateRefreshToken();
        var refreshTokenExpiration = DateTime.UtcNow.AddDays(jwtOptions.Value.RefreshTokenExpirationInDays);
        var accessTokenExpiration = DateTime.UtcNow.AddMinutes(jwtOptions.Value.AccessTokenExpirationInMinutes);

        var refreshTokenEntity =
            AuthExtension.CreateRefreshTokenEntity(refreshToken, user.Id, refreshTokenExpiration);

        await dbContext.RefreshTokens.AddAsync(refreshTokenEntity, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);

        var response = user.ToLoginDto(accessToken.Value!, accessTokenExpiration);
        return Result<LoginResponse>.Success(response, new
        {
            RefreshToken = refreshToken,
            ExpirationDate = refreshTokenExpiration
        });
    }

    public async Task<Result<RefreshTokenResponse>> RefreshTokenAsync(string refreshToken,
        CancellationToken cancellationToken)
    {
        var validationResult =
            await refreshTokenHelper.ValidateRefreshToken(refreshToken, cancellationToken);

        // Check if validation was successful
        if (!validationResult.IsSuccess) return Result<RefreshTokenResponse>.Failure(validationResult.Error!);

        var (existingUser, oldRefreshToken) = validationResult.Value;

        // Mark the old token as revoked and update it
        oldRefreshToken.IsRevoked = true;
        oldRefreshToken.LastModifiedAt = DateTime.UtcNow;
        dbContext.RefreshTokens.Update(oldRefreshToken);
        await dbContext.SaveChangesAsync(cancellationToken);

        var newAccessToken = await jwtHelper.GenerateJwtToken(existingUser);
        if (!newAccessToken.IsSuccess)
        {
            logger.LogError("Failed to generate access token during refresh: {Error}", newAccessToken.Error);
            return Result<RefreshTokenResponse>.Failure(newAccessToken.Error!);
        }

        var newRefreshToken = refreshTokenHelper.GenerateRefreshToken();
        var newRefreshTokenExpiration = DateTime.UtcNow.AddDays(jwtOptions.Value.RefreshTokenExpirationInDays);

        var newRefreshTokenEntity = AuthExtension.CreateRefreshTokenEntity(newRefreshToken, existingUser.Id, newRefreshTokenExpiration);
        await dbContext.RefreshTokens.AddAsync(newRefreshTokenEntity, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);

        // Clean up expired and revoked tokens in a separate operation
        try
        {
            await TokensCleanupHelper.CleanupExpiredAndRevokedTokensAsync(dbContext, cancellationToken);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Failed to cleanup expired tokens, but refresh was successful");
        }

        var newAccessTokenExpiration = DateTime.UtcNow.AddMinutes(jwtOptions.Value.AccessTokenExpirationInMinutes);

        var response = AuthExtension.ToRefreshTokenDto(newAccessToken.Value!, newAccessTokenExpiration);
        return Result<RefreshTokenResponse>.Success(response, new {
            RefreshToken = newRefreshToken,
            ExpirationDate = newRefreshTokenExpiration
        });
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
        if (string.IsNullOrEmpty(refreshToken))
        {
            return Result<bool>.Failure(CustomErrors.InvalidToken);
        }

        var token = await dbContext.RefreshTokens
                                   .FirstOrDefaultAsync(rt => rt.Token == refreshToken, cancellationToken);
        if (token is null) return Result<bool>.Failure(CustomErrors.InvalidToken);

        // Mark the token as revoked
        token.IsRevoked = true;
        token.LastModifiedAt = DateTime.UtcNow;
        dbContext.RefreshTokens.Update(token);
        await dbContext.SaveChangesAsync(cancellationToken);

        // Clean up old tokens
        try
        {
            await TokensCleanupHelper.CleanupExpiredAndRevokedTokensAsync(dbContext, cancellationToken);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Failed to clean up expired tokens, but token revocation was successful");
        }
        logger.LogInformation("Refresh token {Token} revoked successfully", refreshToken);
        return Result<bool>.Success(true);
    }
}