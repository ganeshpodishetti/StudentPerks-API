using System.Diagnostics;
using System.Globalization;
using FluentValidation;
using HealthChecks.UI.Client;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Scalar.AspNetCore;
using Serilog;
using SP.API.Extensions;
using SP.API.Validators.Category;
using SP.Infrastructure.Extensions;

var activitySource = new ActivitySource("StudentPerks.API");

Log.Logger = new LoggerConfiguration()
             .WriteTo.Console(formatProvider: CultureInfo.InvariantCulture)
             .CreateLogger();

try
{
    Log.Information("Application Starting up");
    var builder = WebApplication.CreateBuilder(args);

    builder.AddOptions();
    builder.Services.AddAuthentication(builder.Configuration);
    builder.Services.AddHostedService<DatabaseInitializer>();
    builder.AddOpenTelemetry();
    builder.AddHealthCheck();
    builder.Services.AddSingleton(activitySource);

    // FluentValidation
    builder.Services.AddValidatorsFromAssemblyContaining<AddCategoryValidator>();

    // Add services to the container.
    // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
    builder.Services.AddOpenApi();
    builder.Services.AddDatabase();
    builder.Services.AddServices();
    builder.Services.AddProblemDetails();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddEndpoints(typeof(Program).Assembly);

    var app = builder.Build();

    app.UseExceptionHandler();
    app.UseStatusCodePages();
    app.MapHealthChecks("/healthz", new HealthCheckOptions
    {
        ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
    });
    app.MapHealthChecksUI(options => options.UIPath = "/health-checks-ui");
    app.UseSerilogRequestLogging(options =>
    {
        options.MessageTemplate =
            "HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed:0.0000} ms";
    });

    if (app.Environment.IsDevelopment())
    {
        app.MapOpenApi();
        app.MapScalarApiReference(options => { options.WithTitle("StudentPerks API"); });
    }


    app.UseAuthentication();
    app.UseAuthorization();
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