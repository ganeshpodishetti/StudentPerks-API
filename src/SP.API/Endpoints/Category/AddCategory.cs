using FluentValidation;
using SP.API.Contracts;
using SP.Application.Contracts;
using SP.Application.Dtos.Category;

namespace SP.API.Endpoints.Category;

public class AddCategory : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/categories")
                             .WithTags("Categories")
                             .RequireAuthorization("AdminOnly");

        route.MapPost("",
            async (ICategory categoryService,
                HttpRequest request,
                IValidator<CreateCategoryRequest> validator,
                ILogger<AddCategory> logger,
                CancellationToken cancellationToken) =>
            {
                var form = await request.ReadFormAsync(cancellationToken);
                var createCategoryRequest = new CreateCategoryRequest(
                    form["name"].ToString(),
                    string.IsNullOrEmpty(form["description"]) ? null : form["description"].ToString(),
                    form.Files.GetFile("image")
                );

                var validationResult = await validator.ValidateAsync(createCategoryRequest, cancellationToken);

                if (!validationResult.IsValid)
                {
                    logger.LogWarning("Validation failed for category creation: {Errors}",
                        validationResult.Errors);
                    return Results.ValidationProblem(validationResult.ToDictionary());
                }

                var category = await categoryService.CreateCategoryAsync(createCategoryRequest, cancellationToken);
                return Results.Created($"/api/categories/{category.Id}", category);
            });
    }
}