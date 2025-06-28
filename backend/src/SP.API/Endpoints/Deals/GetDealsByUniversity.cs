using Microsoft.AspNetCore.Mvc;
using SP.API.Contracts;
using SP.Application.Contracts;

namespace SP.API.Endpoints.Deals;

public class GetDealsByUniversity : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/deals")
                             .WithTags("Deals");

        route.MapGet("/university",
            async (IDeal dealService,
                [FromQuery] string name,
                ILogger<GetDealsByUniversity> logger,
                CancellationToken cancellationToken) =>
            {
                if (string.IsNullOrEmpty(name))
                {
                    logger.LogWarning("Attempted to retrieve deals with an empty university name.");
                    return Results.BadRequest(new { message = "University name cannot be empty" });
                }

                var dealsByUniversity = await dealService.GetDealsByUniversityAsync(name, cancellationToken);
                return dealsByUniversity is not null
                    ? Results.Ok(dealsByUniversity)
                    : Results.NotFound(new { message = "No deals found with this university" });
            });
    }
}