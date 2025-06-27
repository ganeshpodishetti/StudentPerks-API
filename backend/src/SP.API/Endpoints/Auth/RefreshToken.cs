using FluentValidation;
using SP.API.Contracts;
using SP.Application.Contracts;
using SP.Application.Dtos.Auth;

namespace SP.API.Endpoints.Auth;

public class RefreshToken : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/auth/refresh-token")
                             .WithTags("Auth");

        route.MapPost("",
            async (IAuth authService,
                IValidator<RefreshTokenRequest> validator,
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

                var result = await authService.RefreshTokenAsync(refreshToken, cancellationToken);
                return Results.Ok(result);
            });
    }
}