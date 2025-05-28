using SP.API.Abstractions;
using SP.Application.Interfaces;

namespace SP.API.Endpoints.Store;

public class DeleteStore : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/stores");

        route.MapDelete("/{id:guid}",
                 async (IStore storeService, Guid id, CancellationToken cancellationToken) =>
                 {
                     var store = await storeService.DeleteStore(id, cancellationToken);
                     return store
                         ? Results.Ok(new { message = "Store deleted successfully" })
                         : Results.NotFound(new { message = "Store with ID not found" });
                 })
             .WithTags("Stores");
    }
}