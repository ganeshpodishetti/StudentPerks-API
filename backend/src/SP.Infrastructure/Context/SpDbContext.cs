using System.Reflection;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SP.Domain.Entities;
using SP.Infrastructure.Constants;

namespace SP.Infrastructure.Context;

public class SpDbContext(DbContextOptions<SpDbContext> options)
    : IdentityDbContext<User>(options)
{
    public DbSet<Deal> Deals { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Store> Stores { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Configure Identity tables to use custom schema
        builder.IdentityTableNames();
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        builder.RemoveAspNetName();
    }
}