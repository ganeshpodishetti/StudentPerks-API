using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using SP.Domain.Entities;
using SP.Domain.Enums;
using SP.Domain.Options;
using SP.Infrastructure.Context;

namespace SP.API.Extensions;

public static class AuthenticationExtension
{
    public static IServiceCollection AddAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        var jwtConfig = configuration.GetSection("Jwt").Get<JwtOptions>();

        if (jwtConfig is null || string.IsNullOrEmpty(jwtConfig.Key))
            throw new InvalidOperationException("JWT configuration is not set properly.");

        // Add validation for numeric values
        if (jwtConfig.AccessTokenExpirationInMinutes <= 0)
            throw new InvalidOperationException("JWT AccessTokenExpirationInMinutes must be a positive number.");

        if (jwtConfig.RefreshTokenExpirationInDays <= 0)
            throw new InvalidOperationException("JWT RefreshTokenExpirationInDays must be a positive number.");
        if (jwtConfig is null || string.IsNullOrEmpty(jwtConfig.Key))
            throw new InvalidOperationException("JWT configuration is not set properly.");

        services.AddIdentity<User, IdentityRole>(options =>
                {
                    // Password settings
                    options.Password.RequireDigit = true;
                    options.Password.RequiredLength = 8;
                    options.Password.RequireLowercase = true;
                    options.Password.RequireUppercase = true;
                    options.Password.RequireNonAlphanumeric = false;

                    // Lockout settings
                    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
                    options.Lockout.MaxFailedAccessAttempts = 5;
                    options.Lockout.AllowedForNewUsers = true;

                    // User settings
                    options.User.RequireUniqueEmail = true;
                })
                .AddEntityFrameworkStores<SpDbContext>()
                .AddApiEndpoints()
                .AddDefaultTokenProviders();

        services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer("Bearer", options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = jwtConfig.Issuer,
                        ValidAudience = jwtConfig.Audience,
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(jwtConfig.Key)),
                        ClockSkew = TimeSpan.Zero
                    };

                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            // Support both Authorization header and cookie
                            var token = context.Request.Headers.Authorization.FirstOrDefault()?.Split(" ").Last();

                            if (string.IsNullOrEmpty(token)) token = context.Request.Cookies["accessToken"];

                            if (!string.IsNullOrEmpty(token)) context.Token = token;

                            return Task.CompletedTask;
                        },
                        OnAuthenticationFailed = OnAuthenticationFailed,
                        OnChallenge = OnChallenge
                    };
                });

        services.AddAuthorizationBuilder()
                .AddPolicy("AdminOnly", policy =>
                    policy.RequireRole(nameof(Roles.Admin)));

        return services;
    }

    private static Task OnAuthenticationFailed(AuthenticationFailedContext context)
    {
        context.NoResult();
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        context.Response.ContentType = "application/json";
        return context.Response.WriteAsync("Authentication failed.");
    }

    private static Task OnChallenge(JwtBearerChallengeContext context)
    {
        // Important: Call HandleResponse() first to prevent a default response
        context.HandleResponse();

        // Only set properties if the response hasn't started yet
        if (context.Response.HasStarted) return Task.CompletedTask;
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        context.Response.ContentType = "application/json";

        var response = new { message = "You are not authorized to access this resource" };
        return context.Response.WriteAsJsonAsync(response);
    }
}