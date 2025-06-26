using Microsoft.AspNetCore.Mvc;
using SP.API.Contracts;
using SP.Application.Contracts;

namespace SP.API.Endpoints.Deals;

public class DeleteDeal : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/deals")
                             .WithTags("Deals")
                             .RequireAuthorization();

        route.MapDelete("/{id:guid}",
            async (IDeal dealService,
                [FromRoute] Guid id,
                ILogger<DeleteDeal> logger,
                CancellationToken cancellationToken) =>
            {
                if (id == Guid.Empty)
                {
                    logger.LogWarning("Attempted to delete a deal with an empty ID.");
                    return Results.BadRequest(new { message = "Deal ID cannot be empty" });
                }

                var deal = await dealService.DeleteDealAsync(id, cancellationToken);
                return deal
                    ? Results.Ok(new { message = "Deal deleted successfully" })
                    : Results.NotFound(new { message = "Deal with ID not found" });
            });
    }
}