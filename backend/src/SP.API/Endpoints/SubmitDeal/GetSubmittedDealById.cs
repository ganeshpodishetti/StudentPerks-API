using SP.API.Contracts;
using SP.Application.Contracts;

namespace SP.API.Endpoints.SubmitDeal;

public class GetSubmittedDealById : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/get-submitted-deal-by-id")
                             .WithTags("DealsSubmission")
                             .RequireAuthorization("AdminOnly");

        route.MapGet("/{id:guid}",
            async (Guid id, ISubmitDeal service) =>
            {
                var result = await service.GetDealByIdAsync(id);
                return result != null
                    ? Results.Ok(result)
                    : Results.NoContent();
            });
    }
}