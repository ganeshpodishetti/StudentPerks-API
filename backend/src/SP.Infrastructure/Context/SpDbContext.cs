using System.Reflection;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SP.Domain.Entities;

namespace SP.Infrastructure.Context;

public class SpDbContext(DbContextOptions<SpDbContext> options)
    : IdentityDbContext<User>(options)
{
    public DbSet<Deal> Deals { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Store> Stores { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<IdentityRole>(e => e.ToTable("Roles"));
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        // Remove AspNet prefix from table names
        foreach (var entityType in builder.Model.GetEntityTypes())
        {
            var tableName = entityType.GetTableName();
            if (tableName!.StartsWith("AspNet")) entityType.SetTableName(tableName[6..]);
        }
    }
}