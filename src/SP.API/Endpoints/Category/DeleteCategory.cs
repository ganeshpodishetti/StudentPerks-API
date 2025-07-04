using Microsoft.AspNetCore.Mvc;
using SP.API.Contracts;
using SP.Application.Contracts;

namespace SP.API.Endpoints.Category;

public class DeleteCategory : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/categories")
                             .WithTags("Categories")
                             .RequireAuthorization("AdminOnly");

        route.MapDelete("/{id:guid}",
            async ([FromRoute] Guid id,
                ICategory categoryService,
                ILogger<DeleteCategory> logger,
                CancellationToken cancellationToken) =>
            {
                if (id == Guid.Empty)
                {
                    logger.LogWarning("Attempted to delete a category with an empty ID.");
                    return Results.BadRequest(new { message = "Category ID cannot be empty" });
                }

                var category = await categoryService.DeleteCategoryAsync(id, cancellationToken);
                return category
                    ? Results.Ok(new { message = "Category deleted successfully" })
                    : Results.NotFound(new { message = "Category with ID not found" });
            });
    }
}