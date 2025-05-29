using SP.API.Abstractions;
using SP.Application.Dtos.Store;
using SP.Application.Interfaces;

namespace SP.API.Endpoints.Store;

public class CreateStore : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/stores");

        route.MapPost("",
                 async (IStore storeService, CreateStoreRequest request, CancellationToken cancellationToken) =>
                 {
                     var store = await storeService.CreateStoreAsync(request, cancellationToken);
                     return Results.Created($"/api/stores/{store.Id}", store);
                 })
             .WithTags("Stores");
    }
}