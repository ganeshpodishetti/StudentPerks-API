using FluentValidation;
using SP.API.Contracts;
using SP.Application.Contracts;
using SP.Application.Dtos.Auth;

namespace SP.API.Endpoints.Auth;

public class RefreshToken : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("auth/refresh-token")
                             .WithTags("Auth");

        route.MapPost("",
            async (IAuth authService, RefreshTokenRequest request,
                IValidator<RefreshTokenRequest> validator,
                ILogger<RefreshToken> logger,
                CancellationToken cancellationToken) =>
            {
                var validationResult = await validator.ValidateAsync(request, cancellationToken);

                if (!validationResult.IsValid)
                {
                    logger.LogWarning("Validation failed for refresh token: {Errors}", validationResult.Errors);
                    return Results.ValidationProblem(validationResult.ToDictionary());
                }

                var result = await authService.RefreshTokenAsync(cancellationToken);
                return Results.Ok(result);
            });
    }
}