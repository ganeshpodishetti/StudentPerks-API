using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SP.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddedUniversityEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageContentType",
                schema: "sp",
                table: "Deals");

            migrationBuilder.DropColumn(
                name: "ImageData",
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

            migrationBuilder.AddColumn<bool>(
                name: "IsUniversitySpecific",
                schema: "sp",
                table: "Deals",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<Guid>(
                name: "UniversityId",
                schema: "sp",
                table: "Deals",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageKitFileId",
                schema: "sp",
                table: "Categories",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                schema: "sp",
                table: "Categories",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Universities",
                schema: "sp",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    Country = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    State = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    City = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    ImageUrl = table.Column<string>(type: "text", nullable: true),
                    ImageKitFileId = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    Name = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Universities", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Deals_UniversityId",
                schema: "sp",
                table: "Deals",
                column: "UniversityId");

            migrationBuilder.CreateIndex(
                name: "IX_sp_University_Code",
                schema: "sp",
                table: "Universities",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_sp_University_Name",
                schema: "sp",
                table: "Universities",
                column: "Name");

            migrationBuilder.AddForeignKey(
                name: "FK_Deals_Universities_UniversityId",
                schema: "sp",
                table: "Deals",
                column: "UniversityId",
                principalSchema: "sp",
                principalTable: "Universities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Deals_Universities_UniversityId",
                schema: "sp",
                table: "Deals");

            migrationBuilder.DropTable(
                name: "Universities",
                schema: "sp");

            migrationBuilder.DropIndex(
                name: "IX_Deals_UniversityId",
                schema: "sp",
                table: "Deals");

            migrationBuilder.DropColumn(
                name: "ImageKitFileId",
                schema: "sp",
                table: "Stores");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                schema: "sp",
                table: "Stores");

            migrationBuilder.DropColumn(
                name: "IsUniversitySpecific",
                schema: "sp",
                table: "Deals");

            migrationBuilder.DropColumn(
                name: "UniversityId",
                schema: "sp",
                table: "Deals");

            migrationBuilder.DropColumn(
                name: "ImageKitFileId",
                schema: "sp",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                schema: "sp",
                table: "Categories");

            migrationBuilder.AddColumn<string>(
                name: "ImageContentType",
                schema: "sp",
                table: "Deals",
                type: "character varying(250)",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "ImageData",
                schema: "sp",
                table: "Deals",
                type: "bytea",
                nullable: true);
        }
    }
}
