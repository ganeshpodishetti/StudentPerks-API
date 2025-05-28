using Microsoft.EntityFrameworkCore;
using SP.Application.Dtos.Category;
using SP.Application.Interfaces;
using SP.Application.Mapping;
using SP.Infrastructure.Context;

namespace SP.Application.Services;

public class CategoryService(SpDbContext spDbContext) : ICategory
{
    public async Task<IEnumerable<CategoryResponse>?> GetAllCategoriesAsync(CancellationToken ct)
    {
        var categories = await spDbContext.Categories
                                          .AsNoTracking()
                                          .ToListAsync(ct);

        return categories.Select(c => c.ToDto());
    }

    public async Task<CategoryResponse?> GetCategoryByIdAsync(Guid categoryId, CancellationToken ct)
    {
        var category = await spDbContext.Categories
                                        .FirstOrDefaultAsync(c => c.CategoryId == categoryId, ct);
        return category?.ToDto();
    }

    public async Task<bool> UpdateCategory(Guid categoryId, UpdateCategoryRequest updateCategoryRequest,
        CancellationToken ct)
    {
        var category = await spDbContext.Categories
                                        .FindAsync([categoryId], ct);
        if (category == null) return false;

        category.Name = updateCategoryRequest.Name;
        category.Description = updateCategoryRequest.Description;
        category.UpdatedAt = DateTime.UtcNow;

        spDbContext.Update(category);
        await spDbContext.SaveChangesAsync(ct);

        return true;
    }

    public async Task<bool> DeleteCategory(Guid categoryId, CancellationToken ct)
    {
        var category = await spDbContext.Categories
                                        .FindAsync([categoryId], ct);
        if (category == null) return false;

        spDbContext.Categories.Remove(category);
        await spDbContext.SaveChangesAsync(ct);
        return true;
    }
}