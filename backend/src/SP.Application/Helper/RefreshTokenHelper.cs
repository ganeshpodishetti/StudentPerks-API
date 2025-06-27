using System.Security.Cryptography;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SP.Application.ErrorHandler;
using SP.Domain.Entities;
using SP.Infrastructure.Context;

namespace SP.Application.Helper;

public interface IRefreshTokenHelper
{
    string GenerateRefreshToken();

    Task<Result<(User User, RefreshToken Token)>>
        ValidateRefreshToken(string refreshToken, CancellationToken cancellationToken);
}

public class RefreshTokenHelper(
    ILogger<RefreshTokenHelper> logger,
    IHttpContextAccessor httpContextAccessor,
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

    public async Task<Result<(User User, RefreshToken Token)>> ValidateRefreshToken(string refreshToken,
        CancellationToken cancellationToken)
    {
        try
        {
            // Use a single query with joins for better performance
            var result = await dbContext.RefreshTokens
                                        .Include(rt => rt.User)
                                        .Where(rt => rt.Token == refreshToken)
                                        .Select(rt => new { Token = rt, rt.User })
                                        .FirstOrDefaultAsync(cancellationToken);

            if (result is null)
            {
                logger.LogWarning("Refresh token validation failed - token not found");
                return Result<(User User, RefreshToken Token)>.Failure(CustomErrors.InvalidRefreshToken);
            }

            var tokenEntity = result.Token;
            var user = result.User;

            // Validate token
            if (tokenEntity.IsRevoked || tokenEntity.ExpirationDate <= DateTime.UtcNow)
            {
                logger.LogWarning("Refresh token validation failed for user {UserId} - token revoked or expired",
                    tokenEntity.UserId);
                return Result<(User User, RefreshToken Token)>.Failure(CustomErrors.InvalidRefreshToken);
            }

            if (IsUserLockedOut(user))
            {
                logger.LogWarning("Refresh token validation failed for user {UserId} - account locked",
                    user.Id);
                return Result<(User User, RefreshToken Token)>.Failure(CustomErrors.AccountLocked);
            }

            logger.LogInformation("Refresh token validated successfully for user {UserId}", user.Id);
            return Result<(User User, RefreshToken Token)>.Success((user, tokenEntity));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred during refresh token validation");
            return Result<(User User, RefreshToken Token)>.Failure("An error occurred during token validation");
        }
    }

    private static bool IsUserLockedOut(User user)
    {
        return user is { LockoutEnabled: true, LockoutEnd: not null } &&
               user.LockoutEnd.Value > DateTime.UtcNow;
    }
}