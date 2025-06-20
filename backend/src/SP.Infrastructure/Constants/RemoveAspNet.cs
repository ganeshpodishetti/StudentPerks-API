using Microsoft.EntityFrameworkCore;

namespace SP.Infrastructure.Constants;

public static class RemoveAspNet
{
    public static void RemoveAspNetName(this ModelBuilder builder)
    {
        // Remove AspNet prefix from table names
        foreach (var entityType in builder.Model.GetEntityTypes())
        {
            var tableName = entityType.GetTableName();
            if (tableName!.StartsWith(DatabaseConstants.AspNetTablePrefix))
                entityType.SetTableName(tableName[6..]);
        }
    }
}