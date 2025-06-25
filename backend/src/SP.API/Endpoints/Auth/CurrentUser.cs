using SP.API.Contracts;
using SP.Application.Contracts;

namespace SP.API.Endpoints.Auth;

public class CurrentUser : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("auth/current-user")
                             .WithTags("Auth");

        route.MapGet("",
            async (IAuth authService, CancellationToken cancellationToken) =>
            {
                var currentUser = await authService.GetCurrentUserAsync(cancellationToken);
                return currentUser is null ? Results.Unauthorized() : Results.Ok(currentUser);
            });
    }
}