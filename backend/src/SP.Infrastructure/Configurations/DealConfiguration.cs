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
               .HasMaxLength(50);

        builder.Property(x => x.DiscountValue)
               .HasMaxLength(10);

        builder.Property(x => x.Url)
               .IsRequired()
               .HasMaxLength(100);

        builder.Property(x => x.Promo)
               .HasMaxLength(100);

        builder.Property(x => x.RedeemType)
               .HasMaxLength(50)
               .IsRequired();

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
        builder.HasIndex(x => x.Category.Name)
               .HasDatabaseName("IX_Deals_CategoryName");
        builder.HasIndex(x => x.StoreId).
               HasDatabaseName("IX_Deals_StoreId");;
        builder.HasIndex(x => x.IsActive);
    }
}