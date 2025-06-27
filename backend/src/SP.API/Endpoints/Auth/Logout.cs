using SP.API.Contracts;
using SP.Application.Contracts;

namespace SP.API.Endpoints.Auth;

public class Logout : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/auth/logout")
                             .WithTags("Auth");

        route.MapPost("",
            async (IAuth authService,
                HttpContext httpContext,
                CancellationToken cancellationToken) =>
            {
                var refreshToken = httpContext?.Request.Cookies["refreshToken"];
                if (string.IsNullOrEmpty(refreshToken))
                    return Results.Problem("Refresh token is missing or invalid", statusCode: 400);
                await authService.LogoutAsync(refreshToken, cancellationToken);
                return Results.Ok(new { message = "User logged out successfully" });
            });
    }
}