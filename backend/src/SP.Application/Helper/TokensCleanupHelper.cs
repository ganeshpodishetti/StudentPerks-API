using Microsoft.EntityFrameworkCore;
using SP.Infrastructure.Context;

namespace SP.Application.Helper;

public static class TokensCleanupHelper
{
    public static async Task CleanupExpiredAndRevokedTokensAsync(SpDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var cutoffDate = DateTime.UtcNow.AddDays(-1);
        var expiredTokens = await dbContext.RefreshTokens
                                           .Where(token => token.IsRevoked && token.ExpirationDate < cutoffDate)
                                           .ToListAsync(cancellationToken);

        dbContext.RefreshTokens.RemoveRange(expiredTokens);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}