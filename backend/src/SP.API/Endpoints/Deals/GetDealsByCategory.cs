using Microsoft.AspNetCore.Mvc;
using SP.API.Contracts;
using SP.Application.Contracts;

namespace SP.API.Endpoints.Deals;

public class GetDealsByCategory : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/deals").WithTags("Deals");

        route.MapGet("/category",
            async (IDeal dealService,
                [FromQuery] string name,
                ILogger<GetDealsByCategory> logger,
                CancellationToken cancellationToken) =>
            {
                if (string.IsNullOrEmpty(name))
                {
                    logger.LogWarning("Attempted to retrieve deals with an empty category name.");
                    return Results.BadRequest(new { message = "Category name cannot be empty" });
                }

                var dealsByCategory = await dealService.GetDealsByCategoryAsync(name, cancellationToken);

                // Always return an array, even if empty
                var getDealsByCategoryResponses = dealsByCategory?.ToList();
                if (getDealsByCategoryResponses?.Count != 0) return Results.Ok(getDealsByCategoryResponses);
                logger.LogInformation("No deals found for category: {CategoryName}", name);
                return Results.Ok(new List<object>());
            });
    }
}