using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SP.Domain.Entities;

namespace SP.Infrastructure.Configurations;

public class DealConfiguration : IEntityTypeConfiguration<Deal>
{
    public void Configure(EntityTypeBuilder<Deal> builder)
    {
        builder.ToTable("Deals");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name)
               .IsRequired()
               .HasMaxLength(100);

        builder.Property(x => x.Description)
               .IsRequired()
               .HasMaxLength(500);

        builder.Property(x => x.DiscountType)
               .IsRequired()
               .HasConversion<string>();

        builder.Property(x => x.Url)
               .IsRequired()
               .HasMaxLength(100);

        builder.Property(x => x.RedeemType)
               .IsRequired()
               .HasConversion<string>();

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