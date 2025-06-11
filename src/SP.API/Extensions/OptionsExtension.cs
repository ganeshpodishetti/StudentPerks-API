using SP.Domain.Options;

namespace SP.API.Extensions;

public static class OptionsExtension
{
    public static void AddOptions(this WebApplicationBuilder builder)
    {
        builder.Services.Configure<ConnStringOptions>(
            builder.Configuration.GetSection(ConnStringOptions.ConnectionStrings));

        builder.Services.Configure<JwtOptions>(
            builder.Configuration.GetSection(JwtOptions.Jwt));
    }
}