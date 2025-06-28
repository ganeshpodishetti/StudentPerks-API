namespace SP.Domain.Options;

public class ImageKitOptions
{
    public const string ImageKit = "ImageKit";
    public required string PublicKey { get; set; }
    public required string PrivateKey { get; set; }
    public required string UrlEndpoint { get; set; }
}