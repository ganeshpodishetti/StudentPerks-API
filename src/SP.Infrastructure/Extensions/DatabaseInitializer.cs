using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SP.Domain.Options;
using SP.Infrastructure.Context;

namespace SP.Infrastructure.Extensions;

public class DatabaseInitializer(
    IServiceProvider serviceProvider,
    ILogger<DatabaseInitializer> logger,
    IOptions<RolesOptions> rolesOptions) : IHostedService
{
    public async Task StartAsync(CancellationToken cancellationToken)
    {
        using var scope = serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<SpDbContext>();

        try
        {
            logger.LogInformation("Checking database connectivity...");

            if (await dbContext.Database.CanConnectAsync(cancellationToken))
            {
                logger.LogInformation("Database is available.");
                if (await dbContext.Database.EnsureCreatedAsync(cancellationToken))
                {
                    logger.LogInformation("Database created successfully.");
                    await SeedRolesAsync();
                }
                else
                {
                    logger.LogInformation("Database already exists.");
                    await SeedRolesAsync();
                    logger.LogInformation("Roles checked and seeded if necessary.");
                }
            }
            else
            {
                logger.LogWarning("Database is unreachable!");
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error checking database connectivity.");
        }
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }

    private async Task SeedRolesAsync()
    {
        logger.LogInformation("Seeding roles...");
        using var scope = serviceProvider.CreateScope();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var roles = rolesOptions.Value.Roles
                    ?? throw new InvalidOperationException("Roles configuration is not set properly.");

        if (roles.Length == 0)
            throw new InvalidOperationException("No roles defined in configuration.");
        await EnsureRolesCreated(roleManager);
        logger.LogInformation("Roles seeded successfully.");
    }

    private async Task EnsureRolesCreated(RoleManager<IdentityRole> roleManager)
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