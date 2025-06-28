using Microsoft.AspNetCore.Mvc;
using SP.API.Contracts;
using SP.Application.Contracts;

namespace SP.API.Endpoints.University;

public class DeleteUniversity : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/universities")
                             .WithTags("Universities")
                             .RequireAuthorization();

        group.MapDelete("/{id:guid}",
            async (IUniversity service,
                [FromRoute] Guid id,
                ILogger<DeleteUniversity> logger,
                CancellationToken cancellationToken) =>
            {
                if (id == Guid.Empty)
                {
                    logger.LogWarning("Attempted to delete a university with an empty ID.");
                    return Results.BadRequest(new { message = "University ID cannot be empty" });
                }

                var result = await service.DeleteUniversityAsync(id, cancellationToken);
                return result
                    ? Results.NoContent()
                    : Results.NotFound(new { message = "University not found" });
            });
    }
}