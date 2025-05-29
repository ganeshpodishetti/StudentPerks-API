using Microsoft.EntityFrameworkCore;
using SP.Application.Dtos.Category;
using SP.Application.Interfaces;
using SP.Application.Mapping;
using SP.Infrastructure.Context;

namespace SP.Application.Services;

public class CategoryService(SpDbContext spDbContext) : ICategory
{
    public async Task<IEnumerable<CategoryResponse>> GetAllCategoriesAsync(CancellationToken ct)
    {
        var categories = await spDbContext.Categories
                                          .AsNoTracking()
                                          .ToListAsync(ct);

        return categories.Select(c => c.ToDto());
    }

    public async Task<CategoryResponse?> GetCategoryByIdAsync(Guid categoryId, CancellationToken ct)
    {
        var category = await spDbContext.Categories
                                        .AsNoTracking()
                                        .SingleOrDefaultAsync(c => c.Id == categoryId, ct);
        return category?.ToDto();
    }

    public async Task<bool> UpdateCategoryAsync(Guid categoryId, UpdateCategoryRequest updateCategoryRequest,
        CancellationToken ct)
    {
        var category = await spDbContext.Categories
                                        .SingleOrDefaultAsync(c => c.Id == categoryId, ct);
        if (category == null) return false;

        updateCategoryRequest.ToEntity(category);
        await spDbContext.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> DeleteCategoryAsync(Guid categoryId, CancellationToken ct)
    {
        var category = await spDbContext.Categories
                                        .SingleOrDefaultAsync(c => c.Id == categoryId, ct);
        if (category == null) return false;

        spDbContext.Categories.Remove(category);
        await spDbContext.SaveChangesAsync(ct);
        return true;
    }

    public async Task<CategoryResponse> CreateCategoryAsync(CreateCategoryRequest createCategoryRequest,
        CancellationToken cancellationToken)
    {
        var existingCategory = await spDbContext.Categories
                                                .FirstOrDefaultAsync(
                                                    c => c.Name == createCategoryRequest.Name.ToLower(),
                                                    cancellationToken);
        if (existingCategory != null) return existingCategory.ToDto();

        var category = createCategoryRequest.ToEntity();

        await spDbContext.Categories.AddAsync(category, cancellationToken);
        await spDbContext.SaveChangesAsync(cancellationToken);

        return category.ToDto();
    }
}