using Microsoft.EntityFrameworkCore;
using SP.Infrastructure.Context;

namespace SP.API.Extensions;

public static class MigrationExtensions
{
    public static async Task<WebApplication> ApplyMigrationsAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<SpDbContext>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

        try
        {
            logger.LogInformation("Checking database connection...");

            var canConnect = await context.Database.CanConnectAsync();
            if (!canConnect)
            {
                logger.LogWarning("Cannot connect to database. Attempting to create...");
                await context.Database.EnsureCreatedAsync();
                logger.LogInformation("Database created successfully");
                return app;
            }

            var pendingMigrations = await context.Database.GetPendingMigrationsAsync();
            var appliedMigrations = await context.Database.GetAppliedMigrationsAsync();

            logger.LogInformation("Applied migrations: {AppliedCount}", appliedMigrations.Count());

            var migrations = pendingMigrations.ToList();
            if (migrations.Count != 0)
            {
                logger.LogInformation("Found {Count} pending migrations: {Migrations}",
                    migrations.Count,
                    string.Join(", ", migrations.Select(m => m.Split('_').LastOrDefault())));

                logger.LogInformation("Applying migrations...");
                await context.Database.MigrateAsync();

                logger.LogInformation("✅ All migrations applied successfully");
            }
            else
            {
                logger.LogInformation("✅ Database is up to date - no pending migrations");
            }

            await context.Database.ExecuteSqlRawAsync("SELECT 1");
            logger.LogInformation("✅Database connection verified");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "❌  Database migration failed: {Message}", ex.Message);

            // ✅ Fixed logic - continue in development, fail in production
            if (!app.Environment.IsDevelopment())
                throw new InvalidOperationException(" Database migration failed. Application cannot start.",
                    ex);
            logger.LogWarning("⚠️ Continuing in development mode despite migration error");
            return app;
        }

        return app;
    }
}