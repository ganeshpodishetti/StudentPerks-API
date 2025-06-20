using SP.API.Contracts;
using SP.Application.Contracts;

namespace SP.API.Endpoints.Store;

public class DeleteStore : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/stores")
                             .WithTags("Stores")
                             .RequireAuthorization();

        route.MapDelete("/{id:guid}",
            async (IStore storeService, Guid id,
                ILogger<DeleteStore> logger,
                CancellationToken cancellationToken) =>
            {
                if (id == Guid.Empty)
                {
                    logger.LogWarning("Attempted to delete a store with an empty ID.");
                    return Results.BadRequest(new { message = "Store ID cannot be empty" });
                }

                var store = await storeService.DeleteStoreAsync(id, cancellationToken);
                return store
                    ? Results.Ok(new { message = "Store deleted successfully" })
                    : Results.NotFound(new { message = "Store with ID not found" });
            });
    }
}