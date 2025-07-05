using SP.API.Contracts;
using SP.Application.Contracts;

namespace SP.API.Endpoints.Auth;

public class ValidateRefreshToken : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/auth/validate-refresh-token")
                             .WithTags("Auth");

        route.MapGet("",
            async (IAuth authService,
                HttpContext httpContext,
                CancellationToken cancellationToken) =>
            {
                var refreshToken = httpContext.Request.Cookies["refreshToken"];
                if (string.IsNullOrEmpty(refreshToken))
                    return Results.BadRequest("Refresh token is missing or invalid");
                var isValid = await authService.ValidateRefreshTokenAsync(refreshToken, cancellationToken);
                return isValid.IsSuccess
                    ? Results.Ok(new { message = "Refresh token validated successfully." })
                    : Results.Unauthorized();
            });
    }
}