using System.Reflection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using SP.API.Contracts;

namespace SP.API.Extensions;

public static class EndpointExtensions
{
    public static IServiceCollection AddEndpoints(this IServiceCollection services, Assembly assembly)
    {
        var serviceDescriptors = assembly
                                 .DefinedTypes
                                 .Where(type => type is { IsAbstract: false, IsInterface: false } &&
                                                type.IsAssignableTo(typeof(IEndpoint)))
                                 .Select(type => ServiceDescriptor.Transient(typeof(IEndpoint), type))
                                 .ToArray();

        services.TryAddEnumerable(serviceDescriptors);

        return services;
    }

    public static IApplicationBuilder UseEndpoints(this WebApplication app, RouteGroupBuilder? routeGroupBuilder = null)
    {
        var endpoints = app.Services.GetRequiredService<IEnumerable<IEndpoint>>();
        IEndpointRouteBuilder builder = routeGroupBuilder is null ? app : routeGroupBuilder;
        foreach (var endpoint in endpoints) endpoint.MapEndpoints(builder);
        return app;
    }
}