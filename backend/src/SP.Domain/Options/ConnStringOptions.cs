namespace SP.Domain.Options;

public class ConnStringOptions
{
    public const string ConnectionStrings = "ConnectionStrings";
    public string SpDbConnection { get; set; } = null!;
}