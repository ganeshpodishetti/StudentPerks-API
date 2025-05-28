using SP.Application.Dtos.Category;

namespace SP.Application.Interfaces;

public interface ICategory
{
    Task<IEnumerable<CategoryResponse>?> GetAllCategoriesAsync(CancellationToken cancellationToken);
    Task<CategoryResponse?> GetCategoryByIdAsync(Guid categoryId, CancellationToken cancellationToken);

    Task<bool> UpdateCategory(Guid categoryId, UpdateCategoryRequest updateCategoryRequest,
        CancellationToken cancellationToken);

    Task<bool> DeleteCategory(Guid categoryId, CancellationToken cancellationToken);
}