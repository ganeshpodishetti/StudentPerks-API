using SP.API.Contracts;
using SP.Application.Contracts;

namespace SP.API.Endpoints.Deals;

public class GetDeals : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/deals").WithTags("Deals");

        route.MapGet("",
            async (IDeal dealService,
                ILogger<GetDeals> logger,
                CancellationToken cancellationToken) =>
            {
                var deals = await dealService.GetAllDealsAsync(cancellationToken);
                var getDealResponses = deals.ToList();

                // Always return an array, even if empty
                if (getDealResponses.Count == 0) logger.LogInformation("No deals found.");

                return Results.Ok(getDealResponses);
            });
    }
}