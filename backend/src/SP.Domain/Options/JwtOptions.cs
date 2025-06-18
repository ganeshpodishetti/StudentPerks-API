namespace SP.Domain.Options;

public class JwtOptions
{
    public const string Jwt = "Jwt";
    public string Issuer { get; init; } = null!;
    public string Audience { get; init; } = null!;
    public string Key { get; init; } = null!;
    public double AccessTokenExpirationInMinutes { get; init; }
    public int RefreshTokenExpirationInDays { get; init; }
}