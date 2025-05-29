using SP.API.Abstractions;
using SP.Application.Interfaces;

namespace SP.API.Endpoints.Category;

public class DeleteCategory : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/categories");

        route.MapDelete("/{id:guid}",
                 async (Guid id, ICategory categoryService, CancellationToken cancellationToken) =>
                 {
                     var category = await categoryService.DeleteCategoryAsync(id, cancellationToken);
                     return category
                         ? Results.Ok(new { message = "Category deleted successfully" })
                         : Results.NotFound(new { message = "Category with ID not found" });
                 })
             .WithTags("Categories");
    }
}