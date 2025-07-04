using Microsoft.AspNetCore.Http;

namespace SP.Application.Dtos.University;

public record CreateUniversityRequest(
    string Name,
    string Code,
    string? Country,
    string? State,
    string? City,
    IFormFile? Image
);

public record UpdateUniversityRequest(
    string Name,
    string Code,
    string? Country,
    string? State,
    string? City,
    bool IsActive,
    IFormFile? Image
);