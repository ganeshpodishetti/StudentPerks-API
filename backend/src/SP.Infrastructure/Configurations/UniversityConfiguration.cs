using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SP.Domain.Entities;
using SP.Infrastructure.Constants;

namespace SP.Infrastructure.Configurations;

public class UniversityConfiguration : IEntityTypeConfiguration<University>
{
    public void Configure(EntityTypeBuilder<University> builder)
    {
        builder.ToTable(DatabaseConstants.UniversityTableName, DatabaseConstants.DefaultSchema);
        builder.HasKey(u => u.Id);

        builder.Property(u => u.Name)
               .IsRequired()
               .HasMaxLength(250);

        builder.Property(u => u.Code)
               .IsRequired()
               .HasMaxLength(10);

        builder.Property(u => u.Country)
               .IsRequired()
               .HasMaxLength(100);

        builder.Property(u => u.State)
               .HasMaxLength(100);

        builder.Property(u => u.City)
               .HasMaxLength(100);

        // Indexes
        builder.HasIndex(u => u.Code)
               .HasDatabaseName(DatabaseConstants.UniversityCodeIndex)
               .IsUnique();
        builder.HasIndex(u => u.Name)
               .HasDatabaseName(DatabaseConstants.UniversityNameIndex);

        // Relationships
        builder.HasMany(u => u.Deals)
               .WithOne(d => d.University)
               .HasForeignKey(d => d.UniversityId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}