using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SP.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameIndex(
                name: "IX_sp_Deals_CategoryId",
                schema: "sp",
                table: "Deals",
                newName: "IX_sp_Categories_Name");

            migrationBuilder.RenameIndex(
                name: "IX_Deals_StoreId",
                schema: "sp",
                table: "Deals",
                newName: "IX_sp_Stores_Name");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameIndex(
                name: "IX_sp_Stores_Name",
                schema: "sp",
                table: "Deals",
                newName: "IX_Deals_StoreId");

            migrationBuilder.RenameIndex(
                name: "IX_sp_Categories_Name",
                schema: "sp",
                table: "Deals",
                newName: "IX_sp_Deals_CategoryId");
        }
    }
}
