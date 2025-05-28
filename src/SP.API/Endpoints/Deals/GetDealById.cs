using SP.API.Abstractions;
using SP.Application.Interfaces;

namespace SP.API.Endpoints.Deals;

public class GetDealById : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/deals");
        route.MapGet("/{id:guid}",
                 async (IDeal dealService, Guid id, CancellationToken cancellationToken) =>
                 {
                     var deals = await dealService.GetDealByIdAsync(id, cancellationToken);
                     return deals is not null
                         ? Results.Ok(deals)
                         : Results.NotFound(new { message = "Deal with ID not found" });
                 })
             .WithTags("Deals");
    }
}