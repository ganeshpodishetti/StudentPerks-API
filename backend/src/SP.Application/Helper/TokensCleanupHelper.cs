using Microsoft.EntityFrameworkCore;
using SP.Infrastructure.Context;

namespace SP.Application.Helper;

public static class TokensCleanupHelper
{
    public static async Task CleanupExpiredAndRevokedTokensAsync(
        SpDbContext dbContext,
        CancellationToken cancellationToken)
    {
        await dbContext.RefreshTokens
                       .Where(token => token.IsRevoked == true || token.ExpirationDate <= DateTime.UtcNow)
                       .ExecuteDeleteAsync(cancellationToken);
    }


    // Fallback method for older EF Core versions
    //     private static async Task CleanupExpiredAndRevokedTokensAsyncLegacy(
    //         SpDbContext dbContext,
    //         CancellationToken cancellationToken)
    //     {
    //         // Get IDs only to avoid loading full entities
    //         var expiredOrRevokedTokenIds = await dbContext.RefreshTokens
    //                                                       .Where(token =>
    //                                                           token.IsRevoked == true ||
    //                                                           token.ExpirationDate <= DateTime.UtcNow)
    //                                                       .Select(t => t.Id)
    //                                                       .ToListAsync(cancellationToken);
    //
    //         if (expiredOrRevokedTokenIds.Count > 0)
    //             // Use batch delete with FormattableString for PostgreSQL
    //             await dbContext.Database.ExecuteSqlAsync(
    //                 $"DELETE FROM sp.\"RefreshTokens\" WHERE \"Id\" = ANY({expiredOrRevokedTokenIds})",
    //                 cancellationToken);
    //     }
}