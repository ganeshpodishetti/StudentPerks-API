using SP.API.Contracts;
using SP.Application.Contracts;

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
                var categoryResponses = categories.ToList();

                if (categoryResponses.Count == 0) logger.LogInformation("No categories found");

                return Results.Ok(categoryResponses);
            });
    }
}