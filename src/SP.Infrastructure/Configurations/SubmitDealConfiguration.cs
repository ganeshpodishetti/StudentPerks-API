using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SP.Domain.Entities;
using SP.Infrastructure.Constants;

namespace SP.Infrastructure.Configurations;

public class SubmitDealConfiguration : IEntityTypeConfiguration<SubmitDeal>
{
    public void Configure(EntityTypeBuilder<SubmitDeal> builder)
    {
        builder.ToTable(DatabaseConstants.SubmitDealsTableName, DatabaseConstants.DefaultSchema);

        builder.HasKey(sd => sd.Id);

        builder.Property(sd => sd.Name)
               .IsRequired()
               .HasMaxLength(250);

        builder.Property(sd => sd.Url)
               .IsRequired()
               .HasMaxLength(1024);

        builder.Property(sd => sd.MarkedAsRead)
               .HasDefaultValue(false);
    }
}