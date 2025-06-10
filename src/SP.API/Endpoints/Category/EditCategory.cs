using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using SP.API.Abstractions;
using SP.Application.Dtos.Category;
using SP.Application.Interfaces;

namespace SP.API.Endpoints.Category;

public class UpdateCategory : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/categories").WithTags("Categories");

        route.MapPut("/{id:guid}",
            async (Guid id, [FromBody] UpdateCategoryRequest updateCategory,
                ICategory categoryService,
                IValidator<UpdateCategoryRequest> validator,
                ILogger<UpdateCategory> logger,
                CancellationToken cancellationToken) =>
            {
                var validationResult = await validator.ValidateAsync(updateCategory, cancellationToken);
                if (!validationResult.IsValid)
                {
                    logger.LogWarning("Validation failed for category update: {Errors}",
                        validationResult.Errors);
                    return Results.ValidationProblem(validationResult.ToDictionary());
                }

                var category = await categoryService.UpdateCategoryAsync(id, updateCategory, cancellationToken);
                return category
                    ? Results.Ok(new { message = "Category updated successfully" })
                    : Results.NotFound(new { message = "Category with ID not found" });
            });
    }
}