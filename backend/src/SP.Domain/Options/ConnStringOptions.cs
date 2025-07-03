namespace SP.Domain.Options;

public class ConnStringOptions
{
    public const string SpDbConnection = "ConnectionStrings";
    public string StudentPerksDb { get; set; } = null!;
}