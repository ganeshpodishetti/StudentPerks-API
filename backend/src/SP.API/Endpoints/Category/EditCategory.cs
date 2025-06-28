using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using SP.API.Contracts;
using SP.Application.Contracts;
using SP.Application.Dtos.Category;

namespace SP.API.Endpoints.Category;

public class EditCategory : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/categories")
                             .WithTags("Categories")
                             .RequireAuthorization();

        route.MapPut("/{id:guid}",
            async ([FromRoute] Guid id,
                HttpRequest request,
                ICategory categoryService,
                IValidator<UpdateCategoryRequest> validator,
                ILogger<EditCategory> logger,
                CancellationToken cancellationToken) =>
            {
                if (id == Guid.Empty)
                {
                    logger.LogWarning("Attempted to update a category with an empty ID.");
                    return Results.BadRequest(new { message = "Category ID cannot be empty" });
                }

                var form = await request.ReadFormAsync(cancellationToken);
                var updateCategory = new UpdateCategoryRequest(
                    form["name"].ToString(),
                    string.IsNullOrEmpty(form["description"].ToString())
                        ? null
                        : form["description"].ToString(),
                    form.Files.GetFile("image")
                );
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