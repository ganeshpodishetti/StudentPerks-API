using Imagekit.Sdk;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SP.Application.Contracts;
using SP.Domain.Options;

namespace SP.Application.Services;

public class FileService : IFileService
{
    private const long MaxFileSize = 5 * 1024 * 1024; // 5MB
    private readonly string[] _allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];

    private readonly string[] _allowedMimeTypes =
        ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/svg+xml"];

    private readonly ImagekitClient _imagekit;
    private readonly ILogger<FileService> _logger;

    public FileService(IOptions<ImageKitOptions> imagekitConfig, ILogger<FileService> logger)
    {
        var config = imagekitConfig.Value;
        _imagekit = new ImagekitClient(config.PublicKey, config.PrivateKey, config.UrlEndpoint);
        _logger = logger;
    }

    public async Task<string> UploadImageAsync(IFormFile file, string folder,
        CancellationToken cancellationToken = default)
    {
        if (!ValidateImage(file))
            throw new ArgumentException("Invalid image file");

        try
        {
            await using var stream = file.OpenReadStream();
            var bytes = new byte[stream.Length];
            await stream.ReadExactlyAsync(bytes, 0, (int)stream.Length, cancellationToken);

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = string.IsNullOrEmpty(folder) ? fileName : $"{fileName}";

            var uploadRequest = new FileCreateRequest
            {
                file = bytes,
                fileName = filePath,
                useUniqueFileName = false,
                tags = [folder ?? "general"],
                folder = folder,
                isPrivateFile = false,
                customCoordinates = "",
                responseFields = ["isPrivateFile", "tags", "customCoordinates"]
            };

            var uploadResult = await _imagekit.UploadAsync(uploadRequest);

            if (uploadResult.fileId == null)
            {
                _logger.LogError("ImageKit upload failed for file: {FileName}", file.FileName);
                throw new Exception("Upload failed");
            }

            _logger.LogInformation("Image uploaded successfully to ImageKit: {FileId}", uploadResult.fileId);
            return uploadResult.url;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to upload image: {FileName}", file.FileName);
            throw;
        }
    }

    public async Task<bool> DeleteImageAsync(string imageUrl, CancellationToken cancellationToken = default)
    {
        try
        {
            if (string.IsNullOrEmpty(imageUrl)) return true;

            var fileId = ExtractFileIdFromUrl(imageUrl);
            if (string.IsNullOrEmpty(fileId)) return false;

            await _imagekit.DeleteFileAsync(fileId);
            _logger.LogInformation("Image deleted successfully from ImageKit: {FileId}", fileId);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to delete image: {ImageUrl}", imageUrl);
            return false;
        }
    }

    public async Task<byte[]> GetImageAsync(string imageUrl, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrEmpty(imageUrl))
            throw new ArgumentException("Image URL cannot be null or empty");

        try
        {
            using var httpClient = new HttpClient();
            return await httpClient.GetByteArrayAsync(imageUrl, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve image: {ImageUrl}", imageUrl);
            throw new FileNotFoundException("Image not found", imageUrl);
        }
    }

    public bool ValidateImage(IFormFile? file)
    {
        if (file == null || file.Length == 0)
            return false;

        if (file.Length > MaxFileSize)
        {
            _logger.LogWarning("File size exceeds limit: {Size} bytes", file.Length);
            return false;
        }

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!_allowedExtensions.Contains(extension))
        {
            _logger.LogWarning("Invalid file extension: {Extension}", extension);
            return false;
        }

        if (_allowedMimeTypes.Contains(file.ContentType.ToLowerInvariant())) return true;
        _logger.LogWarning("Invalid MIME type: {MimeType}", file.ContentType);
        return false;
    }

    public string ExtractFileIdFromUrl(string imageUrl)
    {
        try
        {
            var uri = new Uri(imageUrl);
            var path = uri.AbsolutePath;
            var segments = path.Split('/', StringSplitOptions.RemoveEmptyEntries);

            // ImageKit URLs typically have the file ID as the last segment before the file extension
            if (segments.Length > 0)
            {
                var lastSegment = segments[^1];
                return Path.GetFileNameWithoutExtension(lastSegment);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to extract file ID from URL: {ImageUrl}", imageUrl);
        }

        return string.Empty;
    }
}