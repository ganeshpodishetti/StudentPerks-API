using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SP.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ConvertedDateTime : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameIndex(
                name: "IX_sp_Stores_Name",
                schema: "sp",
                table: "Deals",
                newName: "IX_sp_Deals_StoreId");

            migrationBuilder.RenameIndex(
                name: "IX_sp_Categories_Name",
                schema: "sp",
                table: "Deals",
                newName: "IX_sp_Deals_CategoryId");

            migrationBuilder.AlterColumn<DateTime>(
                name: "StartDate",
                schema: "sp",
                table: "Deals",
                type: "timestamp with time zone",
                nullable: true,
                oldClrType: typeof(DateOnly),
                oldType: "date",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "EndDate",
                schema: "sp",
                table: "Deals",
                type: "timestamp with time zone",
                nullable: true,
                oldClrType: typeof(DateOnly),
                oldType: "date",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameIndex(
                name: "IX_sp_Deals_StoreId",
                schema: "sp",
                table: "Deals",
                newName: "IX_sp_Stores_Name");

            migrationBuilder.RenameIndex(
                name: "IX_sp_Deals_CategoryId",
                schema: "sp",
                table: "Deals",
                newName: "IX_sp_Categories_Name");

            migrationBuilder.AlterColumn<DateOnly>(
                name: "StartDate",
                schema: "sp",
                table: "Deals",
                type: "date",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateOnly>(
                name: "EndDate",
                schema: "sp",
                table: "Deals",
                type: "date",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone",
                oldNullable: true);
        }
    }
}
