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

                // Always return an array, even if empty
                if (universityResponses.Count == 0)
                    logger.LogInformation("No universities found");

                return Results.Ok(universityResponses);
            });
    }
}