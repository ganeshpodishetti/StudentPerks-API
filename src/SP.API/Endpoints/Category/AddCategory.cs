using SP.API.Abstractions;
using SP.Application.Dtos.Category;
using SP.Application.Interfaces;

namespace SP.API.Endpoints.Category;

public class CreateCategory : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/categories");

        route.MapPost("",
                 async (ICategory categoryService, CreateCategoryRequest request,
                     CancellationToken cancellationToken) =>
                 {
                     var category = await categoryService.CreateCategoryAsync(request, cancellationToken);
                     return Results.Created($"/api/categories/{category.Id}", category);
                 })
             .WithTags("Categories");
    }
}