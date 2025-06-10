using SP.API.Abstractions;
using SP.Application.Interfaces;

namespace SP.API.Endpoints.Store;

public class GetStores : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/stores").WithTags("Stores");

        route.MapGet("",
            async (IStore storeService,
                ILogger<GetStores> logger,
                CancellationToken cancellationToken) =>
            {
                var stores = await storeService.GetAllStoresAsync(cancellationToken);
                return Results.Ok(stores);
            });
    }
}