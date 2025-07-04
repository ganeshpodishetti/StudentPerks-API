using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SP.Domain.Options;
using SP.Infrastructure.Context;

namespace SP.Infrastructure.Extensions;

public static class DatabaseExtension
{
    public static IServiceCollection AddDatabase(this IServiceCollection services)
    {
        services.AddDbContextPool<SpDbContext>((provider, options) =>
        {
            var connString = provider.GetRequiredService<IOptions<ConnStringOptions>>().Value.StudentPerksDb;
            // var configuration = provider.GetRequiredService<IConfiguration>();
            // var connString = configuration.GetConnectionString("SpDbConnection");

            if (string.IsNullOrEmpty(connString))
                throw new InvalidOperationException(
                    "Database connection string 'SpDbConnection' is not configured properly");

            options.UseNpgsql(connString, npgsqlOptions =>
            {
                npgsqlOptions.EnableRetryOnFailure(3, TimeSpan.FromSeconds(30), null);
                npgsqlOptions.CommandTimeout(60);
                npgsqlOptions.MigrationsHistoryTable("__EFMigrationsHistory");
            });

            options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTrackingWithIdentityResolution);
            options.EnableSensitiveDataLogging().LogTo(Console.WriteLine, LogLevel.Error);
        }, 128);

        return services;
    }
}