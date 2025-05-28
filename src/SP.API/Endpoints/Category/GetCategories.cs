using SP.API.Abstractions;
using SP.Application.Interfaces;

namespace SP.API.Endpoints.Category;

public class GetCategories : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api");

        route.MapGet("/categories",
                 async (ICategory categoryService, CancellationToken cancellationToken) =>
                 {
                     var categories = await categoryService.GetAllCategoriesAsync(cancellationToken);
                     return categories is not null
                         ? Results.Ok(categories)
                         : Results.NotFound(new { message = "No categories found" });
                 })
             .WithTags("Categories");
    }
}