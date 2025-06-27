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
                ILogger<Logout> logger,
                HttpContext httpContext,
                CancellationToken cancellationToken) =>
            {
                var refreshToken = httpContext?.Request.Cookies["refreshToken"];
                if (string.IsNullOrEmpty(refreshToken))
                    return Results.BadRequest("Refresh token is missing or invalid");
                var result = await authService.RevokeRefreshTokenAsync(refreshToken, cancellationToken);
                if (!result.IsSuccess) return Results.BadRequest(new { errors = result.Errors });
                logger.LogInformation("User logged out successfully");
                return Results.Ok(new { message = "User logged out successfully" });
            });
    }
}