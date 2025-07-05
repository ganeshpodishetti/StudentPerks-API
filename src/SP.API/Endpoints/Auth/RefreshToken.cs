using SP.API.Contracts;
using SP.Application.Contracts;
using SP.Application.Helper;

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

                var result = await authService.RefreshTokenAsync(refreshToken, cancellationToken);
                if (!result.IsSuccess)
                {
                    logger.LogWarning("Token refresh failed: {Error}", result.Error);
                    return Results.BadRequest(new { error = result.Error });
                }

                if (result.AdditionalData is not null)
                {
                    var tokenInfo = result.AdditionalData;
                    var tokenType = tokenInfo.GetType();

                    var refreshTokenProperty = tokenType.GetProperty("RefreshToken");
                    var expirationDateProperty = tokenType.GetProperty("ExpirationDate");

                    var newRefreshToken = (string)refreshTokenProperty?.GetValue(tokenInfo)!;
                    var newExpirationDate = (DateTime)expirationDateProperty?.GetValue(tokenInfo)!;

                    var cookieOptions = RefreshTokenCookieHelper.CreateRefreshTokenCookieOptions(newExpirationDate);
                    httpContext!.Response.Cookies.Append("refreshToken", newRefreshToken, cookieOptions);
                }

                logger.LogInformation("Token refreshed successfully");
                return Results.Ok(result.Value);
            });
    }
}