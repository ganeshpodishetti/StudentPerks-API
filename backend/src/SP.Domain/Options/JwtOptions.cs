namespace SP.Domain.Options;

public class JwtOptions
{
    public const string Jwt = "Jwt";
    public string Issuer { get; set; } = null!;
    public string Audience { get; set; } = null!;
    public string Key { get; set; } = null!;
    public double AccessTokenExpirationInMinutes { get; set; }
    public int RefreshTokenExpirationInDays { get; set; }
}