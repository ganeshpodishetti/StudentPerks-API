using System.Diagnostics;
using System.Globalization;
using FluentValidation;
using Scalar.AspNetCore;
using Serilog;
using SP.API.Extensions;
using SP.API.Helpers;
using SP.API.Validators.Category;
using SP.Infrastructure.Extensions;

var activitySource = new ActivitySource("StudentPerks.API");

Log.Logger = new LoggerConfiguration()
             .WriteTo.Console(formatProvider: CultureInfo.InvariantCulture)
             .CreateLogger();

try
{
    Log.Information("Application Starting up...");
    var builder = WebApplication.CreateBuilder(args);

    builder.AddCors();
    builder.AddOptions();

    builder.Services.ConfigureHttpJsonOptions(options =>
    {
        options.SerializerOptions.Converters.Add(new DateTimeConverter.UtcDateTimeConverter());
        options.SerializerOptions.Converters.Add(new DateTimeConverter.UtcNullableDateTimeConverter());
    });

    if (!builder.Environment.IsDevelopment())
    {
        builder.WebHost.ConfigureKestrel(options =>
        {
            var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
            options.ListenAnyIP(int.Parse(port));
        });
    }

    builder.Services.AddHttpContextAccessor();
    builder.Services.AddAuthentication(builder.Configuration);
    builder.Services.AddAuthorization();
    builder.AddOpenTelemetry();
    builder.Services.AddDbHealthCheck();
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
    Log.Information("Application Started....");
    try
    {
        await app.ApplyMigrationsAsync();
        Log.Information("✅ Database migrations completed successfully");
    }
    catch (Exception ex)
    {
        Log.Fatal(ex, "❌ Failed to apply database migrations");
        if (!app.Environment.IsDevelopment()) throw;
        Log.Warning("⚠️ Continuing without database migrations in non-production environment");
    }

    app.UseDatabaseHealthCheck();

    if (app.Environment.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
    }
    else
    {
        app.UseExceptionHandler("/error");
        app.UseHsts();
    }

    app.UseStatusCodePages();
    app.UseProduction();
    app.UseSerilogRequestLogging(options =>
    {
        options.MessageTemplate =
            "HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed:0.0000} ms";
    });
    app.UseCors("AllowFrontend");
    app.UseRouting();
    app.UseAuthentication();
    app.UseAuthorization();

    if (app.Environment.IsDevelopment())
    {
        app.MapOpenApi();
        app.MapScalarApiReference(options => { options.WithTitle("StudentPerks API"); });
    }

    app.UseErrorMapping();
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