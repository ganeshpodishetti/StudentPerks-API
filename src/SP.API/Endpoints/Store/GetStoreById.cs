using SP.API.Abstractions;
using SP.Application.Interfaces;

namespace SP.API.Endpoints.Store;

public class GetStoreById : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/stores");

        route.MapGet("/{id:guid}",
                 async (IStore storeService, Guid id, CancellationToken cancellationToken) =>
                 {
                     var store = await storeService.GetStoreByIdAsync(id, cancellationToken);
                     return store is not null
                         ? Results.Ok(store)
                         : Results.NotFound(new { message = "Store with ID not found" });
                 })
             .WithTags("Stores");
    }
}