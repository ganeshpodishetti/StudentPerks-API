using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SP.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddedImageField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageKitFileId",
                schema: "sp",
                table: "Stores");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                schema: "sp",
                table: "Stores");

            migrationBuilder.AddColumn<string>(
                name: "ImageKitFileId",
                schema: "sp",
                table: "Deals",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                schema: "sp",
                table: "Deals",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageKitFileId",
                schema: "sp",
                table: "Deals");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                schema: "sp",
                table: "Deals");

            migrationBuilder.AddColumn<string>(
                name: "ImageKitFileId",
                schema: "sp",
                table: "Stores",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                schema: "sp",
                table: "Stores",
                type: "text",
                nullable: true);
        }
    }
}
