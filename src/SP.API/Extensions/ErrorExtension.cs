using Microsoft.AspNetCore.Diagnostics;

namespace SP.API.Extensions;

public static class ErrorExtension
{
    public static WebApplication UseErrorMapping(this WebApplication app)
    {
        app.Map("/error", (HttpContext context, ILogger<Program> logger) =>
        {
            var exceptionFeature = context.Features.Get<IExceptionHandlerPathFeature>();
            var exception = exceptionFeature?.Error;

            logger.LogError(exception, "Unhandled exception at {Path}", context.Request.Path);

            return Results.Problem(
                title: "Internal Server Error",
                detail: app.Environment.IsDevelopment() ? exception?.ToString() : "An unexpected error occurred",
                statusCode: 500,
                instance: context.Request.Path
            );
        });
        return app;
    }
}