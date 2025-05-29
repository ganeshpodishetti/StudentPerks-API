using SP.API.Abstractions;
using SP.Application.Interfaces;

namespace SP.API.Endpoints.Deals;

public class GetDealsByStore : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/deals");

        route.MapGet("/store/{name}",
                 async (IDeal dealService, string name, CancellationToken cancellationToken) =>
                 {
                     var dealsByStore = await dealService.GetDealsByStoreAsync(name.ToLower(), cancellationToken);
                     return dealsByStore is not null
                         ? Results.Ok(dealsByStore)
                         : Results.NotFound(new { message = "No deals found with this store" });
                 })
             .WithTags("Deals");
    }
}