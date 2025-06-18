using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SP.Domain.Entities;

namespace SP.Infrastructure.Configurations;

public class StoreConfiguration : IEntityTypeConfiguration<Store>
{
    public void Configure(EntityTypeBuilder<Store> builder)
    {
        builder.ToTable("Stores");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name)
               .IsRequired()
               .HasMaxLength(25);

        builder.Property(x => x.Description)
               .HasMaxLength(250);

        builder.HasMany(x => x.Deals)
               .WithOne(x => x.Store)
               .HasForeignKey(x => x.StoreId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => x.Name).IsUnique();
    }
}