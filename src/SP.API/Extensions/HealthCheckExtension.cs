using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Options;
using SP.Domain.Options;

namespace SP.API.Extensions;

public static class HealthCheckExtension
{
    public static void AddHealthCheck(this WebApplicationBuilder builder)
    {
        var serviceProvider = builder.Services.BuildServiceProvider();
        var connString = serviceProvider.GetRequiredService<IOptions<ConnStringOptions>>().Value.SpDbConnection;
        builder.Services.AddHealthChecks()
               .AddNpgSql(
                   name: "StudentPerksDB",
                   connectionString: connString,
                   healthQuery: "SELECT 1",
                   tags: ["db", "postgres"],
                   timeout: TimeSpan.FromSeconds(5),
                   failureStatus: HealthStatus.Unhealthy
               );

        builder.Services.AddHealthChecksUI(settings =>
               {
                   settings.AddHealthCheckEndpoint("API", "/healthz");
                   settings.SetEvaluationTimeInSeconds(3600);
                   settings.SetMinimumSecondsBetweenFailureNotifications(60);
               })
               .AddInMemoryStorage();
    }
}