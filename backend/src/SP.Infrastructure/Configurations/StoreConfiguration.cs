using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SP.Domain.Entities;
using SP.Infrastructure.Constants;

namespace SP.Infrastructure.Configurations;

public class StoreConfiguration : IEntityTypeConfiguration<Store>
{
    public void Configure(EntityTypeBuilder<Store> builder)
    {
        builder.ToTable(DatabaseConstants.StoresTableName, DatabaseConstants.DefaultSchema);
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name)
               .IsRequired()
               .HasMaxLength(25);

        builder.Property(x => x.Description)
               .HasMaxLength(250);

        builder.Property(x => x.Website)
               .HasMaxLength(500);

        builder.HasMany(x => x.Deals)
               .WithOne(x => x.Store)
               .HasForeignKey(x => x.StoreId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => x.Name)
               .HasDatabaseName(DatabaseConstants.StoresIndexName)
               .IsUnique();
    }
}