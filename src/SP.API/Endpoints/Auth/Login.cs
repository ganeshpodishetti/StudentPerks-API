using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using SP.API.Contracts;
using SP.Application.Contracts;
using SP.Application.Dtos.Auth;
using SP.Application.Helper;

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
                HttpContext httpContext,
                CancellationToken cancellationToken) =>
            {
                var validationResult = await validator.ValidateAsync(request, cancellationToken);

                if (!validationResult.IsValid)
                {
                    logger.LogWarning("Validation failed for login: {Errors}", validationResult.Errors);
                    return Results.ValidationProblem(validationResult.ToDictionary());
                }

                var result = await authService.LoginAsync(request, cancellationToken);
                if (!result.IsSuccess)
                {
                    logger.LogWarning("Login failed: {Error}", result.Error);
                    return Results.BadRequest(new { error = result.Error });
                }

                if (result.AdditionalData is not null)
                {
                    var tokenInfo = result.AdditionalData;
                    var tokenType = tokenInfo.GetType();

                    var refreshTokenProperty = tokenType.GetProperty("RefreshToken");
                    var expirationDateProperty = tokenType.GetProperty("ExpirationDate");

                    var refreshToken = (string)refreshTokenProperty?.GetValue(tokenInfo)!;
                    var expirationDate = (DateTime)expirationDateProperty?.GetValue(tokenInfo)!;

                    var cookieOptions = RefreshTokenCookieHelper.CreateRefreshTokenCookieOptions(expirationDate);
                    httpContext.Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
                }

                logger.LogInformation("User logged in successfully");
                return Results.Ok(result.Value);
            });
    }
}