using SP.API.Abstractions;
using SP.Application.Interfaces;

namespace SP.API.Endpoints.Category;

public class GetCategoryById : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/categories").WithTags("Categories");

        route.MapGet("/{id:guid}",
            async (Guid id, ICategory categoryService, ILogger<GetCategoryById> logger,
                CancellationToken cancellationToken) =>
            {
                if (id == Guid.Empty)
                {
                    logger.LogWarning("Attempted to retrieve a category with an empty ID.");
                    return Results.BadRequest(new { message = "Category ID cannot be empty" });
                }

                var category = await categoryService.GetCategoryByIdAsync(id, cancellationToken);
                return category is not null
                    ? Results.Ok(category)
                    : Results.NotFound(new { message = "Category with ID not found" });
            });
    }
}