using SP.API.Abstractions;
using SP.Application.Interfaces;

namespace SP.API.Endpoints.Category;

public class GetCategories : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/categories").WithTags("Categories");

        route.MapGet("",
            async (ICategory categoryService,
                ILogger<GetCategories> logger,
                CancellationToken cancellationToken) =>
            {
                var categories = await categoryService.GetAllCategoriesAsync(cancellationToken);
                return Results.Ok(categories);
            });
    }
}