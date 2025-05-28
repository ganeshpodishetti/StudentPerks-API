using SP.API.Abstractions;
using SP.Application.Interfaces;

namespace SP.API.Endpoints.Deals;

public class GetDeals : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api");

        route.MapGet("/deals",
                 async (IDeal dealService, CancellationToken cancellationToken) =>
                 {
                     var deals = await dealService.GetAllDealsAsync(cancellationToken);
                     return deals is not null
                         ? Results.Ok(deals)
                         : Results.NotFound(new { message = "No deals found" });
                 })
             .WithTags("Deals");
    }
}