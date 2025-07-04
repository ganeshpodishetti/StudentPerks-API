using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace SP.Infrastructure.Constants;

public static class IdentityTable
{
    public static void IdentityTableNames(this ModelBuilder builder)
    {
        // Define table names for Identity entities
        builder.Entity<IdentityRole>()
               .ToTable(DatabaseConstants.RolesTableName, DatabaseConstants.DefaultSchema);
        builder.Entity<IdentityRoleClaim<string>>()
               .ToTable(DatabaseConstants.RoleClaimsTableName, DatabaseConstants.DefaultSchema);
        builder.Entity<IdentityUserClaim<string>>()
               .ToTable(DatabaseConstants.UserClaimsTableName, DatabaseConstants.DefaultSchema);
        builder.Entity<IdentityUserLogin<string>>()
               .ToTable(DatabaseConstants.UserLoginsTableName, DatabaseConstants.DefaultSchema);
        builder.Entity<IdentityUserRole<string>>()
               .ToTable(DatabaseConstants.UserRolesTableName, DatabaseConstants.DefaultSchema);
        builder.Entity<IdentityUserToken<string>>()
               .ToTable(DatabaseConstants.UserTokensTableName, DatabaseConstants.DefaultSchema);
    }
}