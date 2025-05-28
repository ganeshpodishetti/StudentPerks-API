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
}