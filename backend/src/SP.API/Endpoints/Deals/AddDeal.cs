using FluentValidation;
using SP.API.Contracts;
using SP.Application.Contracts;
using SP.Application.Dtos.Deal;

namespace SP.API.Endpoints.Deals;

public class AddDeal : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/deals")
                             .WithTags("Deals")
                             .RequireAuthorization();

        route.MapPost("",
            async (IDeal dealService,
                HttpRequest request,
                IValidator<CreateDealRequest> validator,
                ILogger<AddDeal> logger,
                CancellationToken cancellationToken) =>
            {
                var form = await request.ReadFormAsync(cancellationToken);
                var createRequest = new CreateDealRequest(
                    form["title"].ToString(),
                    form["description"].ToString(),
                    form["discount"].ToString(),
                    form.Files.GetFile("image"),
                    string.IsNullOrEmpty(form["promo"]) ? null : form["promo"].ToString(),
                    bool.TryParse(form["isActive"], out var isActive) && isActive,
                    form["url"].ToString(),
                    form["redeemType"].ToString(),
                    string.IsNullOrEmpty(form["howToRedeem"]) ? null : form["howToRedeem"].ToString(),
                    string.IsNullOrEmpty(form["startDate"]) ? null : DateTime.Parse(form["startDate"].ToString()),
                    string.IsNullOrEmpty(form["endDate"]) ? null : DateTime.Parse(form["endDate"].ToString()),
                    form["categoryName"].ToString(),
                    form["storeName"].ToString(),
                    form["universityName"].ToString()
                );
                var validationResult = await validator.ValidateAsync(createRequest, cancellationToken);
                if (!validationResult.IsValid)
                {
                    logger.LogWarning("Validation failed for deal creation: {Errors}", validationResult.Errors);
                    return Results.ValidationProblem(validationResult.ToDictionary());
                }

                var deal = await dealService.CreateDealAsync(createRequest, cancellationToken);
                return Results.Created($"/api/deals/{deal.Id}", deal);
            });
    }
}