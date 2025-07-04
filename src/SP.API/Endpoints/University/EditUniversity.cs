using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using SP.API.Contracts;
using SP.Application.Contracts;
using SP.Application.Dtos.University;

namespace SP.API.Endpoints.University;

public class EditUniversity : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/universities")
                             .WithTags("Universities")
                             .RequireAuthorization();

        group.MapPut("/{id}",
            async (IUniversity service,
                [FromRoute] Guid id,
                HttpRequest request,
                IValidator<UpdateUniversityRequest> validator,
                ILogger<EditUniversity> logger,
                CancellationToken cancellationToken) =>
            {
                var form = await request.ReadFormAsync(cancellationToken);
                var universityRequest = new UpdateUniversityRequest(
                    form["name"]!,
                    form["code"]!,
                    form["country"],
                    form["state"],
                    form["city"],
                    bool.TryParse(form["isActive"], out var isActive) && isActive,
                    form.Files.GetFile("image")
                );
                var validationResult = await validator.ValidateAsync(universityRequest, cancellationToken);
                if (!validationResult.IsValid)
                {
                    logger.LogWarning("Validation failed for university update: {Errors}", validationResult.Errors);
                    return Results.ValidationProblem(validationResult.ToDictionary());
                }

                var university = await service.UpdateUniversityAsync(id, universityRequest, cancellationToken);
                if (university) return Results.Ok(university);
                logger.LogWarning("University with ID {Id} not found or update failed.", id);
                return Results.NotFound(new { message = "University not found or update failed" });
            });
    }
}