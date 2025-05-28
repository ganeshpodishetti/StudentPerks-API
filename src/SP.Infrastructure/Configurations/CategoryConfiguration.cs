using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SP.Domain.Entities;

namespace SP.Infrastructure.Configurations;

public class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.ToTable("Categories");
        builder.HasKey(x => x.CategoryId);
        
        builder.Property(x => x.Name)
            .HasMaxLength(100);
        
        builder.Property(x => x.Description)
            .HasMaxLength(500);
        
        builder.HasMany(x => x.Deals)
            .WithOne(x => x.Category)
            .HasForeignKey(x => x.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.HasIndex(x => x.Name).IsUnique();
    }
}