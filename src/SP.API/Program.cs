using System.Diagnostics;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using Scalar.AspNetCore;
using Serilog;
using SP.API.Extensions;
using SP.Infrastructure.Extensions;

var activitySource = new ActivitySource("StudentPerks.API");

Log.Logger = new LoggerConfiguration()
             .WriteTo.Console()
             .CreateLogger();

try
{
    Log.Information("Application Starting up");
    var builder = WebApplication.CreateBuilder(args);

    builder.AddOptions();
    builder.Host.UseSerilog((context, configuration) =>
        configuration.ReadFrom.Configuration(context.Configuration));

    builder.Services.AddOpenTelemetry()
           .ConfigureResource(resource => resource.AddService("StudentPerks.API"))
           .WithTracing(tracing =>
               tracing
                   .AddSource("StudentPerks.API")
                   .AddAspNetCoreInstrumentation()
                   .AddHttpClientInstrumentation()
                   .AddOtlpExporter())
           .WithMetrics(metricsProviderBuilder =>
               metricsProviderBuilder
                   .AddAspNetCoreInstrumentation()
                   .AddHttpClientInstrumentation()
                   .AddRuntimeInstrumentation());

    builder.Services.AddSingleton(activitySource);

    // Add services to the container.
    // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
    builder.Services.AddOpenApi();
    builder.Services.AddDatabase();
    builder.Services.AddServices();
    builder.Services.AddProblemDetails();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddEndpoints(typeof(Program).Assembly);

    var app = builder.Build();

    // Configure the HTTP request pipeline.
    app.UseExceptionHandler();
    app.UseStatusCodePages();

    app.UseSerilogRequestLogging(options =>
    {
        options.MessageTemplate =
            "HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed:0.0000} ms";
    });


    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
        app.MapOpenApi();
        app.MapScalarApiReference(options => { options.WithTitle("StudentPerks API"); });
    }

    //app.UseHttpsRedirection();
    app.UseRouting();
    app.UseEndpoints();
    app.Run();
}
catch (Exception e)
{
    Log.Fatal(e, "Application terminated unexpectedly");
}
finally
{
    activitySource.Dispose();
    Log.CloseAndFlush();
}