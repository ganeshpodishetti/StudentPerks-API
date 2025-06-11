using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using Serilog;

namespace SP.API.Extensions;

public static class OpenTelemetryExtension
{
    public static void AddOpenTelemetry(this WebApplicationBuilder builder)
    {
        builder.Host.UseSerilog((context, configuration) =>
            configuration.ReadFrom.Configuration(context.Configuration));

        builder.Services.AddOpenTelemetry()
               .WithTracing(tracerProviderBuilder =>
               {
                   tracerProviderBuilder
                       .AddSource("StudentPerks.API")
                       .SetResourceBuilder(ResourceBuilder.CreateDefault().AddService("StudentPerks.API"))
                       .AddAspNetCoreInstrumentation()
                       .AddHttpClientInstrumentation()
                       .AddOtlpExporter();
               })
               .WithMetrics(metricsProviderBuilder =>
               {
                   metricsProviderBuilder
                       .AddAspNetCoreInstrumentation()
                       .AddHttpClientInstrumentation()
                       .AddRuntimeInstrumentation()
                       .SetResourceBuilder(ResourceBuilder.CreateDefault().AddService("StudentPerks.API"));
               });
    }
}