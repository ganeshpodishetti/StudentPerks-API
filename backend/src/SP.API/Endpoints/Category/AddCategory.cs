using FluentValidation;
using SP.API.Contracts;
using SP.Application.Contracts;
using SP.Application.Dtos.Category;

namespace SP.API.Endpoints.Category;

public class AddCategory : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/categories")
                             .WithTags("Categories")
                             .WithSummary("Add a new category")
                             .WithDescription(
                                 "Creates a new category in the system. The request body must contain the category details.")
                             .ProducesProblem(StatusCodes.Status201Created)
                             .ProducesValidationProblem()
                             .WithName("AddCategory")
                             .RequireAuthorization();

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