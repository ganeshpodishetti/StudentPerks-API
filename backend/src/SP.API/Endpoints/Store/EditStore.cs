using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using SP.API.Contracts;
using SP.Application.Contracts;
using SP.Application.Dtos.Store;

namespace SP.API.Endpoints.Store;

public class EditStore : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/stores")
                             .WithTags("Stores")
                             .RequireAuthorization();

        route.MapPut("/{id:guid}",
            async (IStore storeService, [FromRoute] Guid id,
                [FromBody] UpdateStoreRequest request,
                IValidator<UpdateStoreRequest> validator,
                ILogger<EditStore> logger,
                CancellationToken cancellationToken) =>
            {
                var validationResult = await validator.ValidateAsync(request, cancellationToken);
                if (!validationResult.IsValid)
                {
                    logger.LogWarning("Validation failed for store update: {Errors}", validationResult.Errors);
                    return Results.ValidationProblem(validationResult.ToDictionary());
                }

                if (id == Guid.Empty)
                {
                    logger.LogWarning("Attempted to update a store with an empty ID.");
                    return Results.BadRequest(new { message = "Store ID cannot be empty" });
                }

                var store = await storeService.UpdateStoreAsync(id, request, cancellationToken);
                return store
                    ? Results.Ok(new { message = "Store updated successfully" })
                    : Results.NotFound(new { message = "Store with ID not found" });
            });
    }
}