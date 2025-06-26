using SP.API.Contracts;
using SP.Application.Contracts;

namespace SP.API.Endpoints.Auth;

public class ValidateRefreshToken : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("auth/validate-refresh-token")
                             .WithTags("Auth");

        route.MapGet("",
            async (IAuth authService,
                HttpContextAccessor httpContextAccessor,
                CancellationToken cancellationToken) =>
            {
                var refreshToken = httpContextAccessor.HttpContext?.Request.Cookies["refreshToken"];
                if (string.IsNullOrEmpty(refreshToken))
                    return Results.Problem("Refresh token is missing or invalid", statusCode: 400);
                var isValid = await authService.ValidateRefreshTokenAsync(refreshToken, cancellationToken);
                return isValid ? Results.Ok() : Results.Unauthorized();
            });
    }
}