using SP.API.Abstractions;
using SP.Application.Interfaces;

namespace SP.API.Endpoints.Deals;

public class DeleteDeal : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/deals");

        route.MapDelete("/{id:guid}",
                 async (IDeal dealService, Guid id, CancellationToken cancellationToken) =>
                 {
                     var deal = await dealService.DeleteDealAsync(id, cancellationToken);
                     return deal
                         ? Results.Ok(new { message = "Deal deleted successfully" })
                         : Results.NotFound(new { message = "Deal with ID not found" });
                 })
             .WithTags("Deals");
    }
}