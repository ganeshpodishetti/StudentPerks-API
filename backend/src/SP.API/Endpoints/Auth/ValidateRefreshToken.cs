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
            async (IAuth authService, CancellationToken cancellationToken) =>
            {
                var isValid = await authService.ValidateRefreshTokenAsync(cancellationToken);
                return isValid ? Results.Ok() : Results.Unauthorized();
            });
    }
}