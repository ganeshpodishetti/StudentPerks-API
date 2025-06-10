using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

namespace SP.API.Extensions;

public static class OpenTelemetryExtension
{
    public static void AddOpenTelemetry(this WebApplicationBuilder builder)
    {
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