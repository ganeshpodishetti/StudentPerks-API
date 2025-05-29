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
                     return Results.Ok(deals);
                 })
             .WithTags("Deals");
    }
}