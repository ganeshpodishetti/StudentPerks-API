using System.Reflection;
using Microsoft.EntityFrameworkCore;
using SP.Domain.Entities;

namespace SP.Infrastructure.Context;

public class SpDbContext(DbContextOptions<SpDbContext> options)
    : DbContext(options)
{
    public DbSet<Deal> Deals { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Store> Stores { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}