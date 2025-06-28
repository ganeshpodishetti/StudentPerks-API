using FluentValidation;
using SP.API.Contracts;
using SP.Application.Contracts;
using SP.Application.Dtos.University;

namespace SP.API.Endpoints.University;

public class AddUniversity : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/universities")
                             .WithTags("Universities");
        //.RequireAuthorization();

        group.MapPost("/",
            async (IUniversity service,
                HttpRequest request,
                ILogger<AddUniversity> logger,
                IValidator<CreateUniversityRequest> validator,
                CancellationToken cancellationToken) =>
            {
                var form = await request.ReadFormAsync(cancellationToken);
                var universityRequest = new CreateUniversityRequest(
                    form["name"]!,
                    form["code"]!,
                    form["country"],
                    form["state"],
                    form["city"],
                    form.Files.GetFile("image")
                );

                var validationResult = await validator.ValidateAsync(universityRequest, cancellationToken);
                if (!validationResult.IsValid)
                {
                    logger.LogWarning("Validation failed for university creation: {Errors}", validationResult.Errors);
                    return Results.ValidationProblem(validationResult.ToDictionary());
                }

                var university = await service.CreateUniversityAsync(universityRequest, cancellationToken);
                return Results.Created($"/api/universities/{university.Id}", university);
            });
    }
}