using System.Text.Json;
using HealthChecks.UI.Client;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Options;
using SP.Domain.Options;

namespace SP.API.Extensions;

public static class HealthCheckExtension
{
    public static IServiceCollection AddDbHealthCheck(this IServiceCollection services)
    {
        var serviceProvider = services.BuildServiceProvider();
        var connStringOptions = serviceProvider.GetRequiredService<IOptions<ConnStringOptions>>().Value;
        var connString = connStringOptions.StudentPerksDb;

        if (string.IsNullOrEmpty(connString))
            throw new InvalidOperationException(" Connection string 'SpDbConnection' is not configured");

        services.AddHealthChecks()
                .AddNpgSql(
                    name: "StudentPerksDB",
                    connectionString: connString,
                    healthQuery: "SELECT 1",
                    tags: ["db", "postgres", "ready"],
                    timeout: TimeSpan.FromSeconds(10), // Increased timeout
                    failureStatus: HealthStatus.Unhealthy
                );

        services.AddHealthChecksUI(settings =>
                {
                    settings.AddHealthCheckEndpoint("StudentPerks API", "/healthz");
                    settings.SetEvaluationTimeInSeconds(3600); // More frequent checks
                    settings.SetMinimumSecondsBetweenFailureNotifications(60);
                    settings.MaximumHistoryEntriesPerEndpoint(10);
                })
                .AddInMemoryStorage();

        return services;
    }

    public static WebApplication UseDatabaseHealthCheck(this WebApplication app)
    {
        // Main health check endpoint
        app.MapHealthChecks("/healthz", new HealthCheckOptions
        {
            ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse,
            ResultStatusCodes =
            {
                [HealthStatus.Healthy] = StatusCodes.Status200OK,
                [HealthStatus.Degraded] = StatusCodes.Status200OK,
                [HealthStatus.Unhealthy] = StatusCodes.Status503ServiceUnavailable
            }
        });

        // Readiness probe (for Kubernetes/Docker)
        app.MapHealthChecks("/health/ready", new HealthCheckOptions
        {
            Predicate = check => check.Tags.Contains("ready"),
            ResponseWriter = async (context, report) =>
            {
                context.Response.ContentType = "application/json";
                var response = new
                {
                    status = report.Status.ToString(),
                    timestamp = DateTime.UtcNow,
                    duration = report.TotalDuration,
                    checks = report.Entries.Select(entry => new
                    {
                        name = entry.Key,
                        status = entry.Value.Status.ToString(),
                        duration = entry.Value.Duration.TotalMilliseconds,
                        description = entry.Value.Description
                    })
                };
                await context.Response.WriteAsync(JsonSerializer.Serialize(response));
            }
        });

        // Liveness probe (basic app health)
        app.MapHealthChecks("/health/live", new HealthCheckOptions
        {
            Predicate = _ => false // No checks, just confirms app is running
        });

        // Health UI (development only)
        if (app.Environment.IsDevelopment())
            app.MapHealthChecksUI(options =>
            {
                options.UIPath = "/health-ui";
                options.ApiPath = "/health-api";
            });

        return app;
    }
}