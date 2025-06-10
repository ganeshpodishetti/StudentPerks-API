using FluentValidation;
using SP.API.Abstractions;
using SP.Application.Dtos.Category;
using SP.Application.Interfaces;

namespace SP.API.Endpoints.Category;

public class AddCategory : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/categories").WithTags("Categories");

        route.MapPost("",
            async (ICategory categoryService, CreateCategoryRequest request,
                IValidator<CreateCategoryRequest> validator,
                ILogger<AddCategory> logger,
                CancellationToken cancellationToken) =>
            {
                var validationResult = await validator.ValidateAsync(request, cancellationToken);

                if (!validationResult.IsValid)
                {
                    logger.LogWarning("Validation failed for category creation: {Errors}",
                        validationResult.Errors);
                    return Results.ValidationProblem(validationResult.ToDictionary());
                }

                var category = await categoryService.CreateCategoryAsync(request, cancellationToken);
                return Results.Created($"/api/categories/{category.Id}", category);
            });
    }
}