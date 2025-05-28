using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SP.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class update_base_entity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "StoreId",
                table: "Stores",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Deals",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "Location",
                table: "Deals",
                newName: "RedeemType");

            migrationBuilder.RenameColumn(
                name: "DealId",
                table: "Deals",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "CategoryId",
                table: "Categories",
                newName: "Id");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Stores",
                type: "character varying(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Url",
                table: "Deals",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "DiscountType",
                table: "Deals",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Categories",
                type: "character varying(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100,
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Stores",
                newName: "StoreId");

            migrationBuilder.RenameColumn(
                name: "RedeemType",
                table: "Deals",
                newName: "Location");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "Deals",
                newName: "Title");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Deals",
                newName: "DealId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Categories",
                newName: "CategoryId");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Stores",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(10)",
                oldMaxLength: 10);

            migrationBuilder.AlterColumn<string>(
                name: "Url",
                table: "Deals",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<int>(
                name: "DiscountType",
                table: "Deals",
                type: "integer",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Categories",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(10)",
                oldMaxLength: 10);
        }
    }
}
