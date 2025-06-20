using FluentValidation;
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
                             .RequireAuthorization();

        route.MapPost("",
            async (IStore storeService, CreateStoreRequest request,
                IValidator<CreateStoreRequest> validator,
                ILogger<CreateStore> logger,
                CancellationToken cancellationToken) =>
            {
                var validationResult = await validator.ValidateAsync(request, cancellationToken);
                if (!validationResult.IsValid)
                {
                    logger.LogWarning("Validation failed for store creation: {Errors}", validationResult.Errors);
                    return Results.ValidationProblem(validationResult.ToDictionary());
                }

                var store = await storeService.CreateStoreAsync(request, cancellationToken);
                return Results.Created($"/api/stores/{store.Id}", store);
            });
    }
}