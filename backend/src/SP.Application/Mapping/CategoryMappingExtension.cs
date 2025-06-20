using SP.Application.Dtos.Category;
using SP.Domain.Entities;

namespace SP.Application.Mapping;

public static class CategoryMappingExtension
{
    public static CategoryResponse ToDto(this Category category)
    {
        return new CategoryResponse(
            category.Id,
            category.Name,
            category.Description);
    }

    public static Category ToEntity(this CreateCategoryRequest request)
    {
        return new Category
        {
            Name = request.Name,
            Description = request.Description
        };
    }

    public static void ToEntity(this UpdateCategoryRequest request, Category category)
    {
        category.Name = request.Name;
        category.Description = request.Description;
        category.UpdatedAt = DateTime.UtcNow;
    }
}