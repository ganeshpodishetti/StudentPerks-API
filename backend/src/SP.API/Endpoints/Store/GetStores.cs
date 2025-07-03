using SP.API.Contracts;
using SP.Application.Contracts;

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
                var storeResponses = stores.ToList();

                // Always return an array, even if empty
                if (storeResponses.Count == 0) logger.LogInformation("No stores found");

                return Results.Ok(storeResponses);
            });
    }
}