using SP.API.Contracts;
using SP.Application.Contracts;

namespace SP.API.Endpoints.Store;

public class GetStoreById : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/stores").WithTags("Stores");

        route.MapGet("/{id:guid}",
            async (IStore storeService, Guid id,
                ILogger<GetStoreById> logger,
                CancellationToken cancellationToken) =>
            {
                if (id == Guid.Empty)
                {
                    logger.LogWarning("Attempted to retrieve a store with an empty ID.");
                    return Results.BadRequest(new { message = "Store ID cannot be empty" });
                }

                var store = await storeService.GetStoreByIdAsync(id, cancellationToken);
                return store is not null
                    ? Results.Ok(store)
                    : Results.NotFound(new { message = "Store with ID not found" });
            });
    }
}