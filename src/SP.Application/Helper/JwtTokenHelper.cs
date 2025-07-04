using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SP.Application.ErrorHandler;
using SP.Domain.Entities;
using SP.Domain.Options;

namespace SP.Application.Helper;

public interface IJwtHelper
{
    Task<Result<string>> GenerateJwtToken(User entity);
}

public class JwtTokenHelper(
    IOptions<JwtOptions> jwtOptions,
    ILogger<JwtTokenHelper> logger,
    UserManager<User> userManager)
    : IJwtHelper
{
    public async Task<Result<string>> GenerateJwtToken(User entity)
    {
        logger.LogInformation("Generate JWT Token for user {EntityType}", entity.UserName);

        var jwtConfig = jwtOptions.Value;
        if (string.IsNullOrEmpty(jwtConfig.Key))
        {
            logger.LogWarning("JWT key is not set. Token generation may fail.");
            return Result<string>.Failure(CustomErrors.JwtTokenNotSet);
        }

        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtConfig.Key));
        var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);
        var claims = await GetClaims(entity);
        var jwtSecurityToken = CreateJwtSecurityToken(jwtConfig, credentials, claims);

        logger.LogInformation("JWT Token generated successfully for user {EntityType}", entity.UserName);
        var token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);
        return Result<string>.Success(token);
    }

    private async Task<List<Claim>> GetClaims(User entity)
    {
        logger.LogDebug("Extracting claims from user {EntityType}", entity.UserName);
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, entity.Id),
            new(JwtRegisteredClaimNames.Sub, entity.Email!),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };
        var roles = await userManager.GetRolesAsync(entity);
        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));
        logger.LogDebug("Claims extracted for user {EntityType}: {Claims}", entity.UserName, claims);
        return claims;
    }

    private JwtSecurityToken CreateJwtSecurityToken(JwtOptions jwtConfig, SigningCredentials credentials,
        List<Claim> claims)
    {
        logger.LogDebug("Creating JWT Security Token with issuer: {Issuer}, audience: {Audience}",
            jwtConfig.Issuer, jwtConfig.Audience);

        return new JwtSecurityToken(
            jwtConfig.Issuer,
            jwtConfig.Audience,
            claims,
            expires: DateTime.UtcNow.AddMinutes(jwtConfig.AccessTokenExpirationInMinutes),
            signingCredentials: credentials);
    }
}