using SP.Application.Interfaces;
using SP.Application.Services;

namespace SP.API.Extensions;

public static class ServiceExtension
{
    public static void AddServices(this IServiceCollection services)
    {
        services.AddScoped<IDeal, DealService>();
        services.AddScoped<ICategory, CategoryService>();
        services.AddScoped<IStore, StoreService>();
    }
}