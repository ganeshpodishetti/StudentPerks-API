using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SP.Domain.Entities;
using SP.Infrastructure.Constants;

namespace SP.Infrastructure.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable(DatabaseConstants.UsersTableName, DatabaseConstants.DefaultSchema);

        builder.Property(x => x.FirstName)
               .IsRequired()
               .HasMaxLength(50);

        builder.Property(x => x.LastName)
               .IsRequired()
               .HasMaxLength(50);
    }
}