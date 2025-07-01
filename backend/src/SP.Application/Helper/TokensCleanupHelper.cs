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

    public static async Task SetToTokensFalseAsync(
        SpDbContext dbContext,
        CancellationToken cancellationToken)
    {
        var tokens = await dbContext.RefreshTokens
                                    .Where(token => token.IsRevoked == false)
                                    .ToListAsync(cancellationToken);
        tokens.ForEach(token => token.IsRevoked = true);
        dbContext.RefreshTokens.UpdateRange(tokens);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}