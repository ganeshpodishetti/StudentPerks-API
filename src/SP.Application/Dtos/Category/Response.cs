namespace SP.Application.Dtos.Category;

public record CategoryResponse(
    Guid Id,
    string? Name,
    string? Description,
    string? ImageUrl);

public record CreateCategoryResponse(
    Guid Id,
    string? ImageUrl);