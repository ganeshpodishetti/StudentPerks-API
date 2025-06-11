using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SP.Domain.Entities;
using SP.Domain.Options;

namespace SP.Application.Helper;

public interface ITokenHelper
{
    Task<string> GenerateJwtToken(User entity);
}

public class GenerateTokenHelper(
    IOptions<JwtOptions> jwtOptions,
    ILogger<GenerateTokenHelper> logger,
    UserManager<User> userManager) : ITokenHelper
{
    public async Task<string> GenerateJwtToken(User entity)
    {
        logger.LogInformation("Generate JWT Token for user {EntityType}", entity.UserName);

        var jwtConfig = jwtOptions.Value;
        if (string.IsNullOrEmpty(jwtConfig.Key))
        {
            logger.LogWarning("JWT key is not set. Token generation may fail.");
            throw new ArgumentException("JWT key is not set.");
        }

        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtConfig.Key));
        var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);
        var claims = await GetClaims(entity);
        var jwtSecurityToken = CreateJwtSecurityToken(jwtConfig, credentials, claims);

        if (jwtSecurityToken is null)
        {
            logger.LogError("Failed to create JWT Security Token for user {EntityType}", entity.UserName);
            throw new InvalidOperationException("Failed to create JWT Security Token.");
        }

        logger.LogInformation("JWT Token generated successfully for user {EntityType}", entity.UserName);
        return new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);
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