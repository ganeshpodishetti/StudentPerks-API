using SP.API.Abstractions;
using SP.Application.Interfaces;

namespace SP.API.Endpoints.Store;

public class GetStores : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api");

        route.MapGet("/stores",
                 async (IStore storeService, CancellationToken cancellationToken) =>
                 {
                     var stores = await storeService.GetAllStoresAsync(cancellationToken);
                     return stores is not null
                         ? Results.Ok(stores)
                         : Results.NotFound(new { message = "No stores found" });
                 })
             .WithTags("Stores");
    }
}