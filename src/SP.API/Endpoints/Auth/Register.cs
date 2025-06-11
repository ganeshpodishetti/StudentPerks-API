using FluentValidation;
using SP.API.Contracts;
using SP.Application.Contracts;
using SP.Application.Dtos.Auth;

namespace SP.API.Endpoints.Auth;

public class Register : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        var route = endpoints.MapGroup("auth/register")
                             .WithTags("Auth");

        route.MapPost("",
            async (IAuth authService, RegisterRequest request,
                IValidator<RegisterRequest> validator,
                ILogger<Register> logger,
                CancellationToken cancellationToken) =>
            {
                var validationResult = await validator.ValidateAsync(request, cancellationToken);

                if (!validationResult.IsValid)
                {
                    logger.LogWarning("Validation failed for registration: {Errors}", validationResult.Errors);
                    return Results.ValidationProblem(validationResult.ToDictionary());
                }

                var result = await authService.RegisterAsync(request, cancellationToken);
                logger.LogInformation("User registered successfully: {Email}", request.Email);
                return Results.Ok(result);
            });
    }
}