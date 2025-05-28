using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
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
            var connString = provider.GetRequiredService<IOptions<ConnStringOptions>>().Value.SpDbConnection;
            
            if(string.IsNullOrEmpty(connString))
                throw new Exception("Connection string is not set");

            options.UseNpgsql(connString, npgsqlOptions =>
            {
                npgsqlOptions.EnableRetryOnFailure(3, TimeSpan.FromSeconds(30), null);
                npgsqlOptions.CommandTimeout(30);
            });
        }, (int)ServiceLifetime.Scoped);
        
        return services;
    }
}