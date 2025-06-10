using Microsoft.AspNetCore.Mvc;
using SP.API.Abstractions;
using SP.Application.Interfaces;

namespace SP.API.Endpoints.Deals;

public class GetDealsByCategory : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/deals").WithTags("Deals");

        route.MapGet("/category",
            async (IDeal dealService, [FromQuery] string name,
                ILogger<GetDealsByCategory> logger,
                CancellationToken cancellationToken) =>
            {
                if (string.IsNullOrEmpty(name))
                {
                    logger.LogWarning("Attempted to retrieve deals with an empty category name.");
                    return Results.BadRequest(new { message = "Category name cannot be empty" });
                }

                var dealsByCategory = await dealService.GetDealsByCategoryAsync(name.ToLower(), cancellationToken);
                return dealsByCategory is not null
                    ? Results.Ok(dealsByCategory)
                    : Results.NotFound(new { message = "No deals found with this category" });
            });
    }
}