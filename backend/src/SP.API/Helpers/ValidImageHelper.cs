namespace SP.API.Helpers;

public static class ValidImageHelper
{
    public static bool IsValidImageFile(IFormFile? file)
    {
        var allowedTypes = new[] { "image/svg+xml", "image/png" };
        return allowedTypes.Contains(file?.ContentType);
    }
}