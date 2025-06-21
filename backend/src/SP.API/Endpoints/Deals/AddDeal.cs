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
            async (IDeal dealService, [FromBody] CreateDealRequest request,
                IValidator<CreateDealRequest> validator,
                ILogger<AddDeal> logger,
                CancellationToken cancellationToken) =>
            {
                var validationResult = await validator.ValidateAsync(request, cancellationToken);
                if (!validationResult.IsValid)
                {
                    logger.LogWarning("Validation failed for deal creation: {Errors}", validationResult.Errors);
                    return Results.ValidationProblem(validationResult.ToDictionary());
                }

                var deal = await dealService.CreateDealAsync(request, cancellationToken);
                if (!deal)
                {
                    logger.LogError("Failed to create deal with title {Title}", request.Title);
                    return Results.Problem("Failed to create deal.");
                }

                return Results.Created($"/api/deals/{request.Title}",
                    new { Message = "Deal created successfully." });
            });
    }
}