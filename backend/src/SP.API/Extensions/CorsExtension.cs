namespace SP.API.Extensions;

public static class CorsExtension
{
    public static void AddCors(this WebApplicationBuilder builder)
    {
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowAll", corsPolicy =>
                corsPolicy
                    .WithOrigins("http://localhost:5173",
                        "https://localhost:5173",
                        "http://localhost:5254",
                        "https://localhost:5254")
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials());
        });
    }
}