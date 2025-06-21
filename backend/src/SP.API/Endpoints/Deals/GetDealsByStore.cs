using Microsoft.AspNetCore.Mvc;
using SP.API.Contracts;
using SP.Application.Contracts;

namespace SP.API.Endpoints.Deals;

public class GetDealsByStore : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/deals").WithTags("Deals");

        route.MapGet("/store",
            async (IDeal dealService, [FromQuery] string name,
                ILogger<GetDealsByStore> logger,
                CancellationToken cancellationToken) =>
            {
                if (string.IsNullOrEmpty(name))
                {
                    logger.LogWarning("Attempted to retrieve deals with an empty store name.");
                    return Results.BadRequest(new { message = "Store name cannot be empty" });
                }

                var dealsByStore = await dealService.GetDealsByStoreAsync(name, cancellationToken);
                return dealsByStore is not null
                    ? Results.Ok(dealsByStore)
                    : Results.NotFound(new { message = "No deals found with this store" });
            });
    }
}