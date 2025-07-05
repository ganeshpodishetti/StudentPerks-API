using SP.API.Contracts;
using SP.Application.Contracts;

namespace SP.API.Endpoints.SubmitDeal;

public class GetSubmittedDeals : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/get-submitted-deals")
                             .WithTags("DealsSubmission")
                             .RequireAuthorization("AdminOnly");

        route.MapGet("",
            async (ISubmitDeal service) =>
            {
                var result = await service.GetAllDealsAsync();
                return Results.Ok(result);
            });
    }
}