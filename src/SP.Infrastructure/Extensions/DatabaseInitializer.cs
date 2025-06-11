using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using SP.Infrastructure.Context;

namespace SP.Infrastructure.Extensions;

public class DatabaseInitializer(IServiceProvider serviceProvider, ILogger<DatabaseInitializer> logger) : IHostedService
{
    public async Task StartAsync(CancellationToken cancellationToken)
    {
        using var scope = serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<SpDbContext>();

        try
        {
            logger.LogInformation("Checking database connectivity...");

            if (await dbContext.Database.CanConnectAsync(cancellationToken))
                logger.LogInformation("Database is available.");
            else
                logger.LogWarning("Database is unreachable!");
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
}