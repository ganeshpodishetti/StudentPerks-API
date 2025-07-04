using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SP.Domain.Options;
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
                await SeedRolesAsync(scope.ServiceProvider, logger);
                return app;
            }

            logger.LogInformation("✅ Database connection established");
            var appliedMigrations = await context.Database.GetAppliedMigrationsAsync();
            var pendingMigrations = await context.Database.GetPendingMigrationsAsync();

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

            await SeedRolesAsync(scope.ServiceProvider, logger);
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

    private static async Task SeedRolesAsync(IServiceProvider serviceProvider, ILogger logger)
    {
        logger.LogInformation("Seeding roles...");
        var rolesOptions = serviceProvider.GetRequiredService<IOptions<RolesOptions>>();
        if (rolesOptions.Value?.Roles is null)
        {
            logger.LogWarning("⚠️ RolesOptions is not configured or roles are null");
            return;
        }

        using var scope = serviceProvider.CreateScope();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var roles = rolesOptions.Value.Roles;
        if (roles.Length == 0)
        {
            logger.LogWarning("⚠️ No roles defined in configuration");
            return;
        }

        if (roles.Length == 0)
            throw new InvalidOperationException("No roles defined in configuration.");
        await EnsureRolesCreated(roleManager, rolesOptions, logger);
        logger.LogInformation("Roles seeded successfully.");
    }

    private static async Task EnsureRolesCreated(RoleManager<IdentityRole> roleManager,
        IOptions<RolesOptions> rolesOptions, ILogger logger)
    {
        var roles = rolesOptions.Value.Roles;

        foreach (var role in roles)
            if (!await roleManager.RoleExistsAsync(role))
            {
                var result = await roleManager.CreateAsync(new IdentityRole(role));
                if (!result.Succeeded)
                    logger.LogError("Failed to create role '{Role}': {Errors}", role,
                        string.Join(", ", result.Errors.Select(e => e.Description)));
            }
    }
}