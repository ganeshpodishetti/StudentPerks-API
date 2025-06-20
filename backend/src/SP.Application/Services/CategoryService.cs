using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SP.Application.Contracts;
using SP.Application.Dtos.Category;
using SP.Application.Mapping;
using SP.Infrastructure.Context;

namespace SP.Application.Services;

public class CategoryService(SpDbContext spDbContext, ILogger<CategoryService> logger)
    : ICategory
{
    public async Task<IEnumerable<CategoryResponse>> GetAllCategoriesAsync(CancellationToken ct)
    {
        logger.LogInformation("Retrieving all categories from the database");
        var categories = await spDbContext.Categories
                                          .AsNoTracking()
                                          .ToListAsync(ct);
        logger.LogInformation("Retrieved all categories from the database. Count: {Count}", categories.Count);
        return categories.Select(c => c.ToDto());
    }

    public async Task<CategoryResponse?> GetCategoryByIdAsync(Guid categoryId, CancellationToken ct)
    {
        logger.LogInformation("Retrieving a category with an ID {Id}", categoryId);
        var category = await spDbContext.Categories
                                        .AsNoTracking()
                                        .SingleOrDefaultAsync(c => c.Id == categoryId, ct);
        if (category is not null)
        {
            logger.LogInformation("Category with ID {CategoryId} found", categoryId);
            return category.ToDto();
        }

        logger.LogWarning("Category with ID {CategoryId} not found", categoryId);
        return null;
    }

    public async Task<bool> UpdateCategoryAsync(Guid categoryId, UpdateCategoryRequest updateCategoryRequest,
        CancellationToken ct)
    {
        var category = await spDbContext.Categories
                                        .SingleOrDefaultAsync(c => c.Id == categoryId, ct);
        if (category is null)
        {
            logger.LogWarning("Attempted to update a non-existing category with ID {CategoryId}", categoryId);
            return false;
        }

        logger.LogInformation("Updating category with ID {CategoryId}", categoryId);
        updateCategoryRequest.ToEntity(category);
        await spDbContext.SaveChangesAsync(ct);
        logger.LogInformation("Category with ID {CategoryId} updated successfully", categoryId);
        return true;
    }

    public async Task<bool> DeleteCategoryAsync(Guid categoryId, CancellationToken ct)
    {
        var category = await spDbContext.Categories
                                        .SingleOrDefaultAsync(c => c.Id == categoryId, ct);
        if (category is null)
        {
            logger.LogWarning("Attempted to delete a non-existing category with ID {CategoryId}", categoryId);
            return false;
        }

        logger.LogInformation("Deleting category with ID {CategoryId}", categoryId);
        spDbContext.Categories.Remove(category);
        await spDbContext.SaveChangesAsync(ct);
        logger.LogInformation("Category with ID {CategoryId} deleted successfully", categoryId);
        return true;
    }

    public async Task<CategoryResponse> CreateCategoryAsync(CreateCategoryRequest createCategoryRequest,
        CancellationToken cancellationToken)
    {
        var existingCategory = await spDbContext.Categories
                                                .FirstOrDefaultAsync(
                                                    c => c.Name == createCategoryRequest.Name,
                                                    cancellationToken);

        if (existingCategory is not null)
        {
            logger.LogInformation("Category with name {CategoryName} already exists, returning existing category",
                existingCategory.Name);
            return existingCategory.ToDto();
        }

        logger.LogInformation("Creating new category with name {CategoryName}", createCategoryRequest.Name);
        var category = createCategoryRequest.ToEntity();
        await spDbContext.Categories.AddAsync(category, cancellationToken);
        await spDbContext.SaveChangesAsync(cancellationToken);
        logger.LogInformation("Category with name {CategoryName} added successfully", category.Name);
        return category.ToDto();
    }
}