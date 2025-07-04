using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using SP.API.Contracts;
using SP.Application.Contracts;
using SP.Application.Dtos.Store;

namespace SP.API.Endpoints.Store;

public class CreateStore : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/stores")
                             .WithTags("Stores")
                             .RequireAuthorization("AdminOnly");

        route.MapPost("",
            async (IStore storeService,
                [FromBody] CreateStoreRequest storeRequest,
                IValidator<CreateStoreRequest> validator,
                ILogger<CreateStore> logger,
                CancellationToken cancellationToken) =>
            {
                var validationResult = await validator.ValidateAsync(storeRequest, cancellationToken);
                if (!validationResult.IsValid)
                {
                    logger.LogWarning("Validation failed for store creation: {Errors}", validationResult.Errors);
                    return Results.ValidationProblem(validationResult.ToDictionary());
                }

                var store = await storeService.CreateStoreAsync(storeRequest, cancellationToken);
                return Results.Created($"/api/stores/{store.Id}", store);
            });
    }
}