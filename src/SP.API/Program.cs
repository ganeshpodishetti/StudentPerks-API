using Scalar.AspNetCore;
using SP.API.Extensions;
using SP.Infrastructure.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.AddOptions();

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
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(options => { options.WithTitle("StudentPerks API"); });
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseEndpoints();
app.Run();