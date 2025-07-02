namespace SP.Infrastructure.Constants;

public static class DatabaseConstants
{
    public const string DefaultSchema = "sp";
    public const string DealsCategoryIndexName = "IX_sp_Deals_CategoryId";
    public const string DealsStoreIndexName = "IX_sp_Deals_StoreId";
    public const string CategoriesIndexName = "IX_sp_Categories_Name";
    public const string StoresIndexName = "IX_sp_Stores_Name";
    public const string UniversityCodeIndex = "IX_sp_University_Code";
    public const string UniversityNameIndex = "IX_sp_University_Name";

    public const string DealsTableName = "Deals";
    public const string CategoriesTableName = "Categories";
    public const string StoresTableName = "Stores";
    public const string UsersTableName = "Users";
    public const string RolesTableName = "Roles";
    public const string RefreshTokensTableName = "RefreshTokens";
    public const string UserRolesTableName = "UserRoles";
    public const string UserClaimsTableName = "UserClaims";
    public const string RoleClaimsTableName = "RoleClaims";
    public const string UserLoginsTableName = "UserLogins";
    public const string UserTokensTableName = "UserTokens";
    public const string UniversityTableName = "Universities";
    public const string SubmitDealsTableName = "SubmitDeals";

    // public const string UserClaimsIndexName = $"IX_{DefaultSchema}_UserClaims_UserId";
    // public const string RoleClaimsIndexName = $"IX_{DefaultSchema}_RoleClaims_RoleId";
    // public const string UserRolesIndexName = $"IX_{DefaultSchema}_UserRoles_UserId_RoleId";
    // public const string UserLoginsIndexName = $"IX_{DefaultSchema}_UserLogins_UserId_LoginProvider_ProviderKey";
    // public const string UserTokensIndexName = $"IX_{DefaultSchema}_UserTokens_UserId_Name";
    // public const string RefreshTokensIndexName = $"IX_{DefaultSchema}_RefreshTokens_UserId";

    public const string AspNetTablePrefix = "AspNet";
}