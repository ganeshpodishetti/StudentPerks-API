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
                     return Results.Ok(categories);
                 })
             .WithTags("Categories");
    }
}