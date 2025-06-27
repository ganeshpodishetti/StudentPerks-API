namespace SP.Application.Helper;

public static class ConvertToBase64Helper
{
    public static string? ConvertImageToBase64(byte[]? imageData, string? contentType)
    {
        if (imageData == null || imageData.Length == 0 || string.IsNullOrEmpty(contentType))
            return null;

        var base64String = Convert.ToBase64String(imageData);
        return $"data:{contentType};base64,{base64String}";
    }
}