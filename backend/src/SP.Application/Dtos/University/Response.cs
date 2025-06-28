namespace SP.Application.Dtos.University;

public record UniversityResponse(
    Guid Id,
    string Name,
    string Code,
    string? Country,
    string? State,
    string? City,
    string? ImageUrl
);

public record CreateUniversityResponse(
    Guid Id,
    string? ImageUrl
);