using FluentValidation;
using Microsoft.AspNetCore.Mvc;
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
            async (IDeal dealService, HttpRequest request,
                IValidator<CreateDealRequest> validator,
                ILogger<AddDeal> logger,
                CancellationToken cancellationToken) =>
            {
                try
                {
                    var form = await request.ReadFormAsync(cancellationToken);

                    // Build the CreateDealRequest from form data
                    var createRequest = new CreateDealRequest(
                        Title: form["title"].ToString(),
                        Description: form["description"].ToString(),
                        Discount: form["discount"].ToString(),
                        Image: form.Files.GetFile("image"),
                        Promo: string.IsNullOrEmpty(form["promo"]) ? null : form["promo"].ToString(),
                        IsActive: bool.Parse(form["isActive"].ToString()),
                        Url: form["url"].ToString(),
                        RedeemType: form["redeemType"].ToString(),
                        HowToRedeem: string.IsNullOrEmpty(form["howToRedeem"]) ? null : form["howToRedeem"].ToString(),
                        StartDate: string.IsNullOrEmpty(form["startDate"]) ? null : DateTime.Parse(form["startDate"].ToString()),
                        EndDate: string.IsNullOrEmpty(form["endDate"]) ? null : DateTime.Parse(form["endDate"].ToString()),
                        CategoryName: form["categoryName"].ToString(),
                        StoreName: form["storeName"].ToString()
                    );

                    var validationResult = await validator.ValidateAsync(createRequest, cancellationToken);
                    if (!validationResult.IsValid)
                    {
                        logger.LogWarning("Validation failed for deal creation: {Errors}", validationResult.Errors);
                        return Results.ValidationProblem(validationResult.ToDictionary());
                    }

                    var deal = await dealService.CreateDealAsync(createRequest, cancellationToken);
                    if (!deal)
                    {
                        logger.LogError("Failed to create deal with title {Title}", createRequest.Title);
                        return Results.Problem("Failed to create deal.");
                    }

                    return Results.Created($"/api/deals/{createRequest.Title}",
                        new { Message = "Deal created successfully." });
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Error processing deal creation request");
                    return Results.BadRequest(new { message = "Invalid form data", error = ex.Message });
                }
            });
    }
}