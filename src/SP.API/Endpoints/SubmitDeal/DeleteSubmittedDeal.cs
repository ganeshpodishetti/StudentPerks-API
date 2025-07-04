using SP.API.Contracts;
using SP.Application.Contracts;

namespace SP.API.Endpoints.SubmitDeal;

public class DeleteSubmittedDeal : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/delete-submitted-deal")
                             .WithTags("DealsSubmission")
                             .RequireAuthorization("AdminOnly");

        route.MapDelete("/{id:guid}",
            async (Guid id, ISubmitDeal service, ILogger<DeleteSubmittedDeal> logger,
                CancellationToken cancellationToken) =>
            {
                if (id == Guid.Empty)
                {
                    logger.LogWarning("Attempted to delete a submitted deal with an empty ID.");
                    return Results.BadRequest(new { message = "Deal ID cannot be empty" });
                }

                var result = await service.DeleteDealAsync(id, cancellationToken);
                return result
                    ? Results.Ok(new { message = "Submitted deal deleted successfully" })
                    : Results.NotFound(new { message = "Submitted deal with ID not found" });
            });
    }
}