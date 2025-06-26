using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SP.Domain.Entities;
using SP.Infrastructure.Constants;

namespace SP.Infrastructure.Configurations;

public class DealConfiguration : IEntityTypeConfiguration<Deal>
{
    public void Configure(EntityTypeBuilder<Deal> builder)
    {
        builder.ToTable(DatabaseConstants.DealsTableName, DatabaseConstants.DefaultSchema);
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name)
               .IsRequired()
               .HasMaxLength(250);

        builder.Property(x => x.Description)
               .IsRequired()
               .HasMaxLength(512);

        builder.Property(x => x.Discount)
               .IsRequired()
               .HasMaxLength(250);

        builder.Property(x => x.ImageContentType)
               .HasMaxLength(250);

        builder.Property(x => x.Url)
               .IsRequired()
               .HasMaxLength(250);

        builder.Property(x => x.Promo)
               .HasMaxLength(150);

        builder.Property(x => x.RedeemType)
               .HasMaxLength(50)
               .IsRequired();

        builder.Property(x => x.HowToRedeem)
               .HasMaxLength(1024);

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
        builder.HasIndex(x => x.CategoryId)
               .HasDatabaseName(DatabaseConstants.DealsCategoryIndexName);
        builder.HasIndex(x => x.StoreId)
               .HasDatabaseName(DatabaseConstants.DealsStoreIndexName);
    }
}