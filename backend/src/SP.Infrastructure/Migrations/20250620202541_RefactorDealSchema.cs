using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SP.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RefactorDealSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DiscountType",
                schema: "sp",
                table: "Deals");

            migrationBuilder.DropColumn(
                name: "DiscountValue",
                schema: "sp",
                table: "Deals");

            migrationBuilder.AddColumn<string>(
                name: "Discount",
                schema: "sp",
                table: "Deals",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                schema: "sp",
                table: "Deals",
                type: "character varying(250)",
                maxLength: 250,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Discount",
                schema: "sp",
                table: "Deals");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                schema: "sp",
                table: "Deals");

            migrationBuilder.AddColumn<string>(
                name: "DiscountType",
                schema: "sp",
                table: "Deals",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DiscountValue",
                schema: "sp",
                table: "Deals",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);
        }
    }
}
