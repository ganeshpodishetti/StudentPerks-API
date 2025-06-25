using System.Security.Cryptography;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SP.Domain.Entities;
using SP.Infrastructure.Context;

namespace SP.Application.Helper;

public interface IRefreshTokenHelper
{
    string GenerateRefreshToken();
    Task<(User User, RefreshToken Token)> ValidateRefreshToken(CancellationToken cancellationToken);
}

public class RefreshTokenHelper(
    ILogger<RefreshTokenHelper> logger,
    HttpContextAccessor httpContextAccessor,
    SpDbContext dbContext)
    : IRefreshTokenHelper
{
    public string GenerateRefreshToken()
    {
        logger.LogInformation("Generating refresh token");
        var randomNumber = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }

    public async Task<(User User, RefreshToken Token)> ValidateRefreshToken(CancellationToken cancellationToken)
    {
        var refreshToken = httpContextAccessor.HttpContext?.Request.Cookies["refreshToken"];
        if (string.IsNullOrEmpty(refreshToken))
            throw new UnauthorizedAccessException("Refresh token not found.");

        // Find the token in the database
        var tokenEntity = await dbContext.RefreshTokens
                                         .FirstOrDefaultAsync(rt => rt.Token == refreshToken, cancellationToken);

        logger.LogInformation("Validating refresh token for user {UserId}", tokenEntity?.UserId);
        if (tokenEntity == null ||
            tokenEntity.IsRevoked ||
            tokenEntity.ExpirationDate <= DateTime.UtcNow)
        {
            logger.LogWarning("Refresh token validation failed for user {UserId}", tokenEntity?.UserId);
            throw new UnauthorizedAccessException("Invalid or expired refresh token.");
        }

        // Get the user associated with this token
        var user = await dbContext.Users
                                  .FirstOrDefaultAsync(u => u.Id == tokenEntity.UserId, cancellationToken);

        // Ensure user exists and is not locked
        if (user == null || (user is { LockoutEnabled: true, LockoutEnd: not null } &&
                             user.LockoutEnd.Value > DateTime.UtcNow))
        {
            logger.LogWarning("User not found or account is locked for user {UserId}", tokenEntity.UserId);
            throw new UnauthorizedAccessException("User not found or account is temporarily locked.");
        }

        logger.LogInformation("Refresh token validated successfully for user {UserName}", user.UserName);
        return (user, tokenEntity);
    }
}