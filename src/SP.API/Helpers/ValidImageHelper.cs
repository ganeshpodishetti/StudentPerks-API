namespace SP.API.Helpers;

public static class ValidImageHelper
{
    private static readonly string[] AllowedExtensions = [".png", ".svg"];
    private static readonly string[] AllowedMimeTypes = ["image/png", "image/svg+xml"];

    public static bool IsValidImageFile(IFormFile? file)
    {
        if (file == null || file.Length == 0)
            return false;

        // Check file extension
        var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!AllowedExtensions.Contains(fileExtension))
            return false;

        // Check MIME type
        if (!AllowedMimeTypes.Contains(file.ContentType.ToLowerInvariant()))
            return false;

        // Additional validation for file size (max 5MB)
        if (file.Length > 5 * 1024 * 1024)
            return false;

        return true;
    }
}