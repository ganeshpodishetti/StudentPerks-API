using SP.API.Contracts;
using SP.Application.Contracts;

namespace SP.API.Endpoints.University;

public class GetUniversities : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/universities")
                             .WithTags("Universities");

        route.MapGet("",
            async (IUniversity universityService,
                ILogger<GetUniversities> logger,
                CancellationToken cancellationToken) =>
            {
                var universities = await universityService.GetAllUniversitiesAsync(cancellationToken);
                var universityResponses = universities.ToList();
                if (universityResponses.Count != 0) return Results.Ok(universityResponses);
                logger.LogInformation("No universities found.");
                return Results.NotFound(new { message = "No universities found" });
            });
    }
}