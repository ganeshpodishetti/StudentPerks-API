using Microsoft.AspNetCore.Mvc;
using SP.API.Contracts;
using SP.Application.Contracts;

namespace SP.API.Endpoints.Deals;

public class GetDealById : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/deals").WithTags("Deals");
        route.MapGet("/{id:guid}",
            async (IDeal dealService, [FromRoute] Guid id,
                ILogger<GetDealById> logger,
                CancellationToken cancellationToken) =>
            {
                if (id == Guid.Empty)
                {
                    logger.LogWarning("Attempted to retrieve a deal with an empty ID.");
                    return Results.BadRequest(new { message = "Deal ID cannot be empty" });
                }

                var deal = await dealService.GetDealByIdAsync(id, cancellationToken);
                return deal is not null
                    ? Results.Ok(deal)
                    : Results.NotFound(new { message = "Deal with ID not found" });
            });
    }
}