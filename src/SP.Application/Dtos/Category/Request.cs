namespace SP.Application.Dtos.Category;

public record UpdateCategoryRequest(
    string Name,
    string? Description);

public record CreateCategoryRequest(
    string Name,
    string? Description);