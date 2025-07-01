using SP.API.Contracts;
using SP.Application.Contracts;

namespace SP.API.Endpoints.Auth;

public class RefreshToken : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/auth/refresh-token")
                             .WithTags("Auth");

        route.MapPost("",
            async (IAuth authService,
                ILogger<RefreshToken> logger,
                HttpContext httpContext,
                CancellationToken cancellationToken) =>
            {
                var refreshToken = httpContext?.Request.Cookies["refreshToken"];

                if (string.IsNullOrEmpty(refreshToken))
                {
                    logger.LogWarning("Refresh token is missing or invalid");
                    return Results.Unauthorized();
                }

                // Check if the response has already started
                if (httpContext?.Response.HasStarted == true)
                {
                    logger.LogError("Response has already started, cannot process refresh token request");
                    return Results.Problem("Request cannot be processed", statusCode: 500);
                }

                var result = await authService.RefreshTokenAsync(refreshToken, cancellationToken);
                if (!result.IsSuccess)
                {
                    logger.LogWarning("Token refresh failed: {Error}", result.Error);
                    return Results.BadRequest(new { error = result.Error });
                }

                logger.LogInformation("Token refreshed successfully");
                return Results.Ok(result.Value);
            });
    }
}