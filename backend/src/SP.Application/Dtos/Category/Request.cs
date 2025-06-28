using Microsoft.AspNetCore.Http;

namespace SP.Application.Dtos.Category;

public record UpdateCategoryRequest(
    string Name,
    string? Description,
    IFormFile? Image);

public record CreateCategoryRequest(
    string Name,
    string? Description,
    IFormFile? Image);