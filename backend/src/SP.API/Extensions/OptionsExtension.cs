using SP.Domain.Options;

namespace SP.API.Extensions;

public static class OptionsExtension
{
    public static void AddOptions(this WebApplicationBuilder builder)
    {
        builder.Services.Configure<ConnStringOptions>(
            builder.Configuration.GetSection(ConnStringOptions.SpDbConnection));

        builder.Services.Configure<JwtOptions>(
            builder.Configuration.GetSection(JwtOptions.Jwt));

        builder.Services.Configure<RolesOptions>(
            builder.Configuration.GetSection(RolesOptions.Identity));

        builder.Services.Configure<ImageKitOptions>(
            builder.Configuration.GetSection(ImageKitOptions.ImageKit));
    }
}