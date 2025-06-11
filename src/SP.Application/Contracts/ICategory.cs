using SP.Application.Dtos.Category;

namespace SP.Application.Contracts;

public interface ICategory
{
    Task<IEnumerable<CategoryResponse>> GetAllCategoriesAsync(CancellationToken cancellationToken);
    Task<CategoryResponse?> GetCategoryByIdAsync(Guid categoryId, CancellationToken cancellationToken);

    Task<bool> UpdateCategoryAsync(Guid categoryId, UpdateCategoryRequest updateCategoryRequest,
        CancellationToken cancellationToken);

    Task<bool> DeleteCategoryAsync(Guid categoryId, CancellationToken cancellationToken);

    Task<CategoryResponse> CreateCategoryAsync(CreateCategoryRequest createCategoryRequest,
        CancellationToken cancellationToken);
}