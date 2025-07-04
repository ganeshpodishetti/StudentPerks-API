using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SP.Domain.Entities;
using SP.Infrastructure.Constants;

namespace SP.Infrastructure.Configurations;

public class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.ToTable(DatabaseConstants.CategoriesTableName, DatabaseConstants.DefaultSchema);
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name)
               .IsRequired()
               .HasMaxLength(50);

        builder.Property(x => x.Description)
               .HasMaxLength(500);

        builder.HasMany(x => x.Deals)
               .WithOne(x => x.Category)
               .HasForeignKey(x => x.CategoryId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => x.Name)
               .HasDatabaseName(DatabaseConstants.CategoriesIndexName)
               .IsUnique();
    }
}