namespace SP.Domain.Options;

public class RolesOptions
{
    public const string Identity = "Identity";
    public string[] Roles { get; init; } = [];
}