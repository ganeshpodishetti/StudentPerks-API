using Microsoft.AspNetCore.Mvc;
using SP.API.Contracts;
using SP.Application.Contracts;

namespace SP.API.Endpoints.University;

public class GetUniversityById : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/universities")
                             .WithTags("Universities");

        route.MapGet("/{id}",
            async (IUniversity universityService,
                [FromRoute] Guid id,
                ILogger<GetUniversityById> logger,
                CancellationToken cancellationToken) =>
            {
                var university = await universityService.GetUniversityByIdAsync(id, cancellationToken);
                if (university is not null) return Results.Ok(university);
                logger.LogInformation("University with ID {Id} not found.", id);
                return Results.NotFound(new { message = "University not found" });
            });
    }
}