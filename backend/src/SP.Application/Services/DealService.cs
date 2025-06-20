using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SP.Application.Contracts;
using SP.Application.Dtos.Deal;
using SP.Application.Mapping;
using SP.Domain.Entities;
using SP.Infrastructure.Context;

namespace SP.Application.Services;

public class DealService(SpDbContext spDbContext, ILogger<DealService> logger) : IDeal
{
    public async Task<GetDealResponse?> GetDealByIdAsync(Guid dealId, CancellationToken ct)
    {
        logger.LogInformation("Retrieving a deal with ID {DealId}", dealId);
        var deal = await spDbContext.Deals
                                    .Include(d => d.Category)
                                    .Include(d => d.Store)
                                    .AsNoTracking()
                                    .SingleOrDefaultAsync(d => d.Id == dealId, ct);
        if (deal is not null)
        {
            logger.LogInformation("Deal with ID {DealId} found", deal.Id);
            return deal?.ToDto();
        }

        logger.LogWarning("Deal with ID {DealId} not found", dealId);
        return null;
    }

    public Task<IEnumerable<GetDealsByCategoryResponse>?> GetDealsByCategoryAsync(string categoryName,
        CancellationToken ct)
    {
        logger.LogInformation("Retrieving all deals with category {CategoryName}", categoryName);
        var deals = spDbContext.Deals
                               .Include(d => d.Category)
                               .Where(d => d.Category.Name == categoryName)
                               .AsNoTracking()
                               .ToListAsync(ct);
        logger.LogInformation("Retrieved {Count} deals for category {CategoryName}", deals.Result.Count,
            categoryName);
        return Task.FromResult(deals?.Result.Select(d => d.ToCategoryDto()));
    }

    public Task<IEnumerable<GetDealsByStoreResponse>?> GetDealsByStoreAsync(string storeName, CancellationToken ct)
    {
        logger.LogInformation("Retrieving all deals for store {StoreName}", storeName);
        var deals = spDbContext.Deals
                               .Include(d => d.Store)
                               .Where(d => d.Store.Name == storeName)
                               .AsNoTracking()
                               .ToListAsync(ct);
        logger.LogInformation("Retrieved {Count} deals for store {StoreName}", deals.Result.Count, storeName);
        return Task.FromResult(deals?.Result.Select(d => d.ToStoreDto()));
    }

    public async Task<IEnumerable<GetDealResponse>> GetAllDealsAsync(CancellationToken ct)
    {
        logger.LogInformation("Retrieving all deals from the database");
        var deals = await spDbContext.Deals
                                     .Include(d => d.Category)
                                     .Include(d => d.Store)
                                     .AsNoTracking()
                                     .ToListAsync(ct);
        logger.LogInformation("Retrieved {Count} deals from the database", deals.Count);
        return deals.Select(d => d.ToDto());
    }

    public async Task<GetDealResponse> CreateDealAsync(CreateDealRequest request, CancellationToken ct)
    {
        var existingStore = await spDbContext.Stores
                                             .FirstOrDefaultAsync(c => c.Name == request.StoreName,
                                                 ct);

        var existingCategory = await spDbContext.Categories
                                                .FirstOrDefaultAsync(c => c.Name == request.CategoryName,
                                                    ct);

        Category category;

        if (existingCategory is not null)
        {
            logger.LogInformation("Existing category with {Name} found", existingCategory.Name);
            category = existingCategory;
        }
        else
        {
            category = new Category
            {
                Name = request.CategoryName
            };
            logger.LogInformation("Creating a new category with name {Name}", category.Name);
            await spDbContext.Categories.AddAsync(category, ct);
        }

        Store store;
        if (existingStore is not null)
        {
            logger.LogInformation("Existing store with {Name} found", existingStore.Name);
            store = existingStore;
        }
        else
        {
            store = new Store
            {
                Name = request.StoreName
            };
            logger.LogInformation("Creating a new store with name {Name}", store.Name);
            await spDbContext.Stores.AddAsync(store, ct);
        }

        logger.LogInformation("Creating a new deal with title {Title}", request.Title);
        var deal = request.ToEntity(category, store);

        await spDbContext.Deals.AddAsync(deal, ct);
        await spDbContext.SaveChangesAsync(ct);

        logger.LogInformation("Deal with ID {DealId} created successfully", deal.Id);
        return deal.ToDto();
    }

    public async Task<bool> UpdateDealAsync(Guid dealId, UpdateDealRequest updateDealRequest, CancellationToken ct)
    {
        var deal = await spDbContext.Deals
                                    .SingleOrDefaultAsync(d => d.Id == dealId,
                                        ct);

        if (deal is null)
        {
            logger.LogWarning("Deal with ID {DealId} not found", dealId);
            return false;
        }

        var existingStore = await spDbContext.Stores
                                             .FirstOrDefaultAsync(c => c.Name == updateDealRequest.StoreName,
                                                 ct);

        var existingCategory = await spDbContext.Categories
                                                .FirstOrDefaultAsync(
                                                    c => c.Name == updateDealRequest.CategoryName,
                                                    ct);

        if (existingCategory is null || existingStore is null)
        {
            logger.LogWarning(
                "Either category or store not found for deal update. Category: {Category}, Store: {Store}",
                existingCategory?.Name, existingStore?.Name);
            return false;
        }

        logger.LogInformation("Updating deal with ID {DealId}", dealId);
        updateDealRequest.ToEntity(deal, existingCategory, existingStore);
        await spDbContext.SaveChangesAsync(ct);
        logger.LogInformation("Deal with ID {DealId} updated successfully", dealId);
        return true;
    }

    public async Task<bool> DeleteDealAsync(Guid dealId, CancellationToken ct)
    {
        var deal = await spDbContext.Deals
                                    .SingleOrDefaultAsync(d => d.Id == dealId, ct);
        if (deal is null)
        {
            logger.LogWarning("Deal with ID {DealId} not found", dealId);
            return false;
        }

        logger.LogInformation("Deleting deal with ID {DealId}", dealId);
        spDbContext.Deals.Remove(deal);
        await spDbContext.SaveChangesAsync(ct);
        logger.LogInformation("Deal with ID {DealId} deleted successfully", dealId);

        return true;
    }
}