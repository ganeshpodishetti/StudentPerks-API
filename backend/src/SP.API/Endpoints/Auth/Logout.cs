using SP.API.Contracts;
using SP.Application.Contracts;

namespace SP.API.Endpoints.Auth;

public class Logout : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("auth/logout")
                             .WithTags("Auth");

        route.MapPost("",
            async (IAuth authService, CancellationToken cancellationToken) =>
            {
                await authService.LogoutAsync(cancellationToken);
                return Results.Ok(new { message = "User logged out successfully" });
            });
    }
}