using Microsoft.AspNetCore.Http;

namespace SP.Application.Contracts;

public interface IFileService
{
    Task<string> UploadImageAsync(IFormFile file, string folder, CancellationToken cancellationToken = default);
    Task<bool> DeleteImageAsync(string filePath, CancellationToken cancellationToken = default);
    Task<byte[]> GetImageAsync(string filePath, CancellationToken cancellationToken = default);
    string ExtractFileIdFromUrl(string imageUrl);
}