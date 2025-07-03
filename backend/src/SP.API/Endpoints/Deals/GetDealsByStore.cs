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
            async (IDeal dealService,
                [FromQuery] string name,
                ILogger<GetDealsByStore> logger,
                CancellationToken cancellationToken) =>
            {
                if (string.IsNullOrEmpty(name))
                {
                    logger.LogWarning("Attempted to retrieve deals with an empty store name.");
                    return Results.BadRequest(new { message = "Store name cannot be empty" });
                }

                var dealsByStore = await dealService.GetDealsByStoreAsync(name, cancellationToken);

                // Always return an array, even if empty
                var getDealsByStoreResponses = dealsByStore?.ToList();
                if (getDealsByStoreResponses?.Count > 0) return Results.Ok(getDealsByStoreResponses);
                logger.LogInformation("No deals found for store: {StoreName}", name);
                return Results.Ok(new List<object>());
            });
    }
}