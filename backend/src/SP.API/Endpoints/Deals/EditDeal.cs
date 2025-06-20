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
            async (IDeal dealService, Guid id,
                [FromBody] UpdateDealRequest request,
                IValidator<UpdateDealRequest> validator,
                ILogger<EditDeal> logger,
                CancellationToken cancellationToken) =>
            {
                var validationResult = await validator.ValidateAsync(request, cancellationToken);
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

                var deal = await dealService.UpdateDealAsync(id, request, cancellationToken);
                return deal
                    ? Results.Ok(new { message = "Deal updated successfully" })
                    : Results.NotFound(new { message = "Deal with ID not found" });
            });
    }
}