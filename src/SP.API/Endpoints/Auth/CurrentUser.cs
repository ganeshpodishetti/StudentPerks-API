using SP.API.Contracts;
using SP.Application.Contracts;

namespace SP.API.Endpoints.Auth;

public class CurrentUser : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/auth/current-user")
                             .WithTags("Auth");

        route.MapGet("",
            async (IAuth authService,
                HttpContext httpContext,
                CancellationToken cancellationToken) =>
            {
                var refreshToken = httpContext?.Request.Cookies["refreshToken"];
                if (string.IsNullOrEmpty(refreshToken)) return Results.Unauthorized();
                var currentUser = await authService.GetCurrentUserAsync(refreshToken, cancellationToken);
                return !currentUser.IsSuccess
                    ? Results.BadRequest(new { errors = currentUser.Errors })
                    : Results.Ok(currentUser.Value);
            });
    }
}