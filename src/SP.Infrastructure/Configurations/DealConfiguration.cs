using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SP.Domain.Entities;

namespace SP.Infrastructure.Configurations;

public class DealConfiguration : IEntityTypeConfiguration<Deal>
{
    public void Configure(EntityTypeBuilder<Deal> builder)
    {
        builder.ToTable("Deals");
        builder.HasKey(x => x.DealId);
        
        builder.Property(x => x.Title)
            .IsRequired()
            .HasMaxLength(100);
        
        builder.Property(x => x.Description)
            .IsRequired()
            .HasMaxLength(500);
        
        // Relationships
        builder.HasOne(x => x.Category)
            .WithMany(x => x.Deals)
            .HasForeignKey(x => x.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.HasOne(x => x.Store)
            .WithMany(x => x.Deals)
            .HasForeignKey(x => x.StoreId)
            .OnDelete(DeleteBehavior.Restrict);
        
        // Add indexes
        builder.HasIndex(x => x.CategoryId);
        builder.HasIndex(x => x.StoreId);
        builder.HasIndex(x => new { x.StartDate, x.EndDate });
        builder.HasIndex(x => x.IsActive);
    }
}