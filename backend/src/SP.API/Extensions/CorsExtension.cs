namespace SP.API.Extensions;

public static class CorsExtension
{
    public static void AddCors(this WebApplicationBuilder builder)
    {
        var frontendUrl = builder.Configuration.GetValue<string>("Frontend:Url") ?? string.Empty;

        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend", corsPolicy =>
                corsPolicy
                    .WithOrigins(frontendUrl)
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials() // Required for cookies
                    .SetIsOriginAllowed(_ => true)); // For development only
        });
    }
}