using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using SP.API.Contracts;
using SP.Application.Contracts;
using SP.Application.Dtos.Deal;

namespace SP.API.Endpoints.Deals;

public class EditDeal : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/deals")
                             .WithTags("Deals")
                             .RequireAuthorization();

        route.MapPut("/{id:guid}",
            async (IDeal dealService, [FromRoute] Guid id,
                HttpRequest request,
                IValidator<UpdateDealRequest> validator,
                ILogger<EditDeal> logger,
                CancellationToken cancellationToken) =>
            {
                try
                {
                    var form = await request.ReadFormAsync(cancellationToken);

                    // Build the UpdateDealRequest from form data
                    var updateRequest = new UpdateDealRequest(
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

                    var validationResult = await validator.ValidateAsync(updateRequest, cancellationToken);
                    if (!validationResult.IsValid)
                    {
                        logger.LogWarning("Validation failed for deal update: {Errors}", validationResult.Errors);
                        return Results.ValidationProblem(validationResult.ToDictionary());
                    }

                    if (id == Guid.Empty)
                    {
                        logger.LogWarning("Attempted to update a deal with an empty ID.");
                        return Results.BadRequest(new { message = "Deal ID cannot be empty" });
                    }

                    var deal = await dealService.UpdateDealAsync(id, updateRequest, cancellationToken);
                    return deal
                        ? Results.Ok(new { message = "Deal updated successfully" })
                        : Results.NotFound(new { message = "Deal with ID not found" });
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Error processing deal update request");
                    return Results.BadRequest(new { message = "Invalid form data", error = ex.Message });
                }
            });
    }
}