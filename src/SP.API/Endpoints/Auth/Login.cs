using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using SP.API.Contracts;
using SP.Application.Contracts;
using SP.Application.Dtos.Auth;

namespace SP.API.Endpoints.Auth;

public class Login : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("/api/auth/login")
                             .WithTags("Auth");
        route.MapPost("",
            async (IAuth authService,
                [FromBody] LoginRequest request,
                IValidator<LoginRequest> validator,
                ILogger<Login> logger,
                CancellationToken cancellationToken) =>
            {
                var validationResult = await validator.ValidateAsync(request, cancellationToken);

                if (!validationResult.IsValid)
                {
                    logger.LogWarning("Validation failed for login: {Errors}", validationResult.Errors);
                    return Results.ValidationProblem(validationResult.ToDictionary());
                }

                var result = await authService.LoginAsync(request, cancellationToken);
                if (result.IsSuccess) return Results.Ok(result.Value);
                logger.LogWarning("Login failed for user: {Email}", request.Email);
                return Results.BadRequest(new { errors = result.Errors });
            });
    }
}