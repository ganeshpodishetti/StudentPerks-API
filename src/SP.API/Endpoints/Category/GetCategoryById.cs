using SP.API.Abstractions;
using SP.Application.Interfaces;

namespace SP.API.Endpoints.Category;

public class GetCategoryById : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/categories");

        route.MapGet("/{id:guid}",
                 async (Guid id, ICategory categoryService, CancellationToken cancellationToken) =>
                 {
                     var category = await categoryService.GetCategoryByIdAsync(id, cancellationToken);
                     return category is not null
                         ? Results.Ok(category)
                         : Results.NotFound(new { message = "Category with ID not found" });
                 })
             .WithTags("Categories");
    }
}