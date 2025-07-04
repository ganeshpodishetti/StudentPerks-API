using SP.API.Contracts;
using SP.Application.Contracts;
using SP.Application.Dtos.SubmitDeal;

namespace SP.API.Endpoints.SubmitDeal;

public class MarkAsSubmittedDeal : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/mark-as-read")
                             .WithTags("DealsSubmission")
                             .RequireAuthorization("AdminOnly");

        route.MapPut("/{id:guid}",
            async (Guid id, MarkAsReadDealRequest request, ISubmitDeal service) =>
            {
                if (id == Guid.Empty) return Results.BadRequest(new { message = "Deal ID cannot be empty" });
                var result = await service.UpdateDealAsync(id, request);
                return result
                    ? Results.Ok(new { message = "Deal edited successfully" })
                    : Results.BadRequest(new { message = "Failed to edit deal" });
            });
    }
}