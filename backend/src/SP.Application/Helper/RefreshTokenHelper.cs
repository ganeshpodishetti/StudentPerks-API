using System.Security.Cryptography;
using Microsoft.Extensions.Logging;
using SP.Domain.Entities;

namespace SP.Application.Helper;

public interface IRefreshTokenHelper
{
    string GenerateRefreshToken();
    bool ValidateRefreshToken(User user, RefreshToken refreshToken);
}

public class RefreshTokenHelper(ILogger<RefreshTokenHelper> logger)
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

    public bool ValidateRefreshToken(User user, RefreshToken refreshToken)
    {
        logger.LogInformation("Validating refresh token for user {UserName}", user.UserName);
        if (refreshToken.IsRevoked)
        {
            logger.LogWarning(" Revoked refresh token for user {UserName}", user.UserName);
            return false;
        }

        if (refreshToken.ExpirationDate <= DateTime.UtcNow)
        {
            logger.LogWarning("Expired refresh token for user {UserName}", user.UserName);
            return false;
        }

        logger.LogInformation("Refresh token validated successfully for user {UserName}", user.UserName);
        return true;
    }
}