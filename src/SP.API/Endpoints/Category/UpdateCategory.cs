using Microsoft.AspNetCore.Mvc;
using SP.API.Abstractions;
using SP.Application.Dtos.Category;
using SP.Application.Interfaces;

namespace SP.API.Endpoints.Category;

public class UpdateCategory : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/categories");

        route.MapPut("/{id:guid}",
                 async (Guid id, [FromBody] UpdateCategoryRequest updateCategory, ICategory categoryService,
                     CancellationToken cancellationToken) =>
                 {
                     var category = await categoryService.UpdateCategory(id, updateCategory, cancellationToken);
                     return category
                         ? Results.Ok(new { message = "Category updated successfully" })
                         : Results.NotFound(new { message = "Category with ID not found" });
                 })
             .WithTags("Categories");
    }
}