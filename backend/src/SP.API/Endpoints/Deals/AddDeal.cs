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
                try
                {
                    var form = await request.ReadFormAsync(cancellationToken);

                    // Build the CreateDealRequest from form data
                    var createRequest = new CreateDealRequest(
                        form["title"].ToString(),
                        form["description"].ToString(),
                        form["discount"].ToString(),
                        form.Files.GetFile("image"),
                        string.IsNullOrEmpty(form["promo"]) ? null : form["promo"].ToString(),
                        bool.Parse(form["isActive"].ToString()),
                        form["url"].ToString(),
                        form["redeemType"].ToString(),
                        string.IsNullOrEmpty(form["howToRedeem"]) ? null : form["howToRedeem"].ToString(),
                        string.IsNullOrEmpty(form["startDate"]) ? null : DateTime.Parse(form["startDate"].ToString()),
                        string.IsNullOrEmpty(form["endDate"]) ? null : DateTime.Parse(form["endDate"].ToString()),
                        form["categoryName"].ToString(),
                        form["storeName"].ToString()
                    );

                    var validationResult = await validator.ValidateAsync(createRequest, cancellationToken);
                    if (!validationResult.IsValid)
                    {
                        logger.LogWarning("Validation failed for deal creation: {Errors}", validationResult.Errors);
                        return Results.ValidationProblem(validationResult.ToDictionary());
                    }

                    var deal = await dealService.CreateDealAsync(createRequest, cancellationToken);
                    if (deal)
                        return Results.Created($"/api/deals/{createRequest.Title}",
                            new { Message = "Deal created successfully." });
                    logger.LogError("Failed to create deal with title {Title}", createRequest.Title);
                    return Results.Problem("Failed to create deal.");
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Error processing deal creation request");
                    return Results.BadRequest(new { message = "Invalid form data", error = ex.Message });
                }
            });
    }
}