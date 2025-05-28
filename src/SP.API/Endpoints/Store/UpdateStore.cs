using Microsoft.AspNetCore.Mvc;
using SP.API.Abstractions;
using SP.Application.Dtos.Store;
using SP.Application.Interfaces;

namespace SP.API.Endpoints.Store;

public class UpdateStore : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/stores");

        route.MapPut("/{id:guid}",
                 async (IStore storeService, Guid id, [FromBody] UpdateStoreRequest request,
                     CancellationToken cancellationToken) =>
                 {
                     var store = await storeService.UpdateStore(id, request, cancellationToken);
                     return store
                         ? Results.Ok(new { message = "Store updated successfully" })
                         : Results.NotFound(new { message = "Store with ID not found" });
                 })
             .WithTags("Stores");
    }
}