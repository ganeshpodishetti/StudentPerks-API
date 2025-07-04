using Microsoft.AspNetCore.HttpOverrides;

namespace SP.API.Extensions;

public static class ProductionExtension
{
    public static WebApplication UseProduction(this WebApplication app)
    {
        if (app.Environment.IsProduction())
        {
            app.UseExceptionHandler("/error");
            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            });
            app.UseHsts();
            app.UseHttpsRedirection();
        }
        else
        {
            app.UseDeveloperExceptionPage();
        }

        return app;
    }
}