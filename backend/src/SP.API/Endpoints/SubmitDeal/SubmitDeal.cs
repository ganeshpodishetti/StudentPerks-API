using FluentValidation;
using SP.API.Contracts;
using SP.Application.Contracts;
using SP.Application.Dtos.SubmitDeal;

namespace SP.API.Endpoints.SubmitDeal;

public class SubmitDeal : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/submit-deal")
                             .WithTags("DealsSubmission");

        route.MapPost("",
            async (SubmitDealRequest request,
                ISubmitDeal service,
                IValidator<SubmitDealRequest> validator) =>
            {
                var validationResult = await validator.ValidateAsync(request);
                if (!validationResult.IsValid) return Results.ValidationProblem(validationResult.ToDictionary());
                var result = await service.SubmitDealAsync(request);
                return result
                    ? Results.Ok(new { message = "Deal submitted successfully" })
                    : Results.BadRequest(new { message = "Failed to submit deal" });
            });
    }
}