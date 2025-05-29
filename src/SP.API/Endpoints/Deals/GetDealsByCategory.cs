using SP.API.Abstractions;
using SP.Application.Interfaces;

namespace SP.API.Endpoints.Deals;

public class GetDealsByCategory : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/deals");

        route.MapGet("/category/{name}",
                 async (IDeal dealService, string name, CancellationToken cancellationToken) =>
                 {
                     var dealsByCategory = await dealService.GetDealsByCategoryAsync(name.ToLower(), cancellationToken);
                     return dealsByCategory is not null
                         ? Results.Ok(dealsByCategory)
                         : Results.NotFound(new { message = "No deals found with this category" });
                 })
             .WithTags("Deals");
    }
}