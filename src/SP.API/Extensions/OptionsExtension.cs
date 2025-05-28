using SP.Domain.Options;

namespace SP.API.Extensions;

public static class OptionsExtension
{
    public static void AddOptions(this WebApplicationBuilder builder)
    {
        // Registering the Options
        builder.Services.Configure<ConnStringOptions>(
            builder.Configuration.GetSection(ConnStringOptions.ConnectionStrings));
    }
}