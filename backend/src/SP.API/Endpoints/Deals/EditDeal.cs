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
            async (IDeal dealService,
                [FromRoute] Guid id,
                HttpRequest request,
                IValidator<UpdateDealRequest> validator,
                ILogger<EditDeal> logger,
                CancellationToken cancellationToken) =>
            {
                var form = await request.ReadFormAsync(cancellationToken);

                // Build the UpdateDealRequest from form data
                var updateRequest = new UpdateDealRequest(
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
                    bool.TryParse(form["isUniversitySpecific"], out var isUniversitySpecific) && isUniversitySpecific,
                    form["categoryName"].ToString(),
                    form["storeName"].ToString(),
                    form["universityName"].ToString()
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
            });
    }
}