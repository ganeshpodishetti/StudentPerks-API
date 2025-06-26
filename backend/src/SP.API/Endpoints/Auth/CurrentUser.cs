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
            async (IAuth authService,
                HttpContextAccessor httpContextAccessor,
                CancellationToken cancellationToken) =>
            {
                var refreshToken = httpContextAccessor.HttpContext?.Request.Cookies["refreshToken"];
                if (string.IsNullOrEmpty(refreshToken)) return Results.Unauthorized();
                var currentUser = await authService.GetCurrentUserAsync(refreshToken, cancellationToken);
                return currentUser is null ? Results.Unauthorized() : Results.Ok(currentUser);
            });
    }
}