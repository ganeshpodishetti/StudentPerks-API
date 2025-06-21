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
                                    .Where(d => d.Id == dealId)
                                    .Select(d => d.ToDto())
                                    .AsNoTracking()
                                    .SingleOrDefaultAsync(ct);
        if (deal is null)
        {
            logger.LogWarning("Deal with ID {DealId} not found", dealId);
            return null;
        }

        logger.LogInformation("Retrieved deal with ID {DealId}", dealId);
        return deal;
    }

    public async Task<IEnumerable<GetDealsByCategoryResponse>?> GetDealsByCategoryAsync(string categoryName,
        CancellationToken ct)
    {
        logger.LogInformation("Retrieving all deals with category {CategoryName}", categoryName);
        var deals = await spDbContext.Deals
                                     .Include(d => d.Category)
                                     .Where(d => d.Category.Name == categoryName)
                                     .Select(d => d.ToCategoryDto())
                                     .AsNoTracking()
                                     .ToListAsync(ct);

        logger.LogInformation("Retrieved {Count} deals for category {CategoryName}", deals.Count,
            categoryName);
        return deals;
    }

    public async Task<IEnumerable<GetDealsByStoreResponse>?> GetDealsByStoreAsync(string storeName,
        CancellationToken ct)
    {
        logger.LogInformation("Retrieving all deals for store {StoreName}", storeName);
        var deals = await spDbContext.Deals
                                     .Include(d => d.Store)
                                     .Where(d => d.Store.Name == storeName)
                                     .Select(d => d.ToStoreDto())
                                     .AsNoTracking()
                                     .ToListAsync(ct);
        logger.LogInformation("Retrieved {Count} deals for store {StoreName}", deals.Count, storeName);
        return deals;
    }

    public async Task<IEnumerable<GetDealResponse>> GetAllDealsAsync(CancellationToken ct)
    {
        logger.LogInformation("Retrieving all deals from the database");
        var deals = await spDbContext.Deals
                                     .Include(d => d.Category)
                                     .Include(d => d.Store)
                                     .Select(d => d.ToDto())
                                     .AsNoTracking()
                                     .ToListAsync(ct);
        logger.LogInformation("Retrieved {Count} deals from the database", deals.Count);
        return deals;
    }

    public async Task<bool> CreateDealAsync(CreateDealRequest request, CancellationToken ct)
    {
        var existingStore = await spDbContext.Stores
                                             .FirstOrDefaultAsync(c => c.Name == request.StoreName,
                                                 ct);

        var existingCategory = await spDbContext.Categories
                                                .FirstOrDefaultAsync(c => c.Name == request.CategoryName,
                                                    ct);

        Category category;
        if (existingCategory is null)
        {
            category = new Category { Name = request.CategoryName };
            await spDbContext.Categories.AddAsync(category, ct);
            logger.LogInformation("Created a new category with name {Name}", category.Name);
        }
        else
        {
            category = existingCategory;
            logger.LogInformation("Using existing category with name {Name}", category.Name);
        }

        Store store;
        if (existingStore is null)
        {
            store = new Store { Name = request.StoreName };
            await spDbContext.Stores.AddAsync(store, ct);
            logger.LogInformation("Created a new store with name {Name}", store.Name);
        }
        else
        {
            store = existingStore;
            logger.LogInformation("Using existing store with name {Name}", store.Name);
        }

        logger.LogInformation("Creating a new deal with title {Title}", request.Title);
        var deal = request.ToEntity(category.Id, store.Id);

        await spDbContext.Deals.AddAsync(deal, ct);
        await spDbContext.SaveChangesAsync(ct);

        logger.LogInformation("Deal with ID {DealId} created successfully", deal.Id);
        return true;
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
        spDbContext.Deals.Update(deal);
        var rowsAffected = await spDbContext.SaveChangesAsync(ct);
        if (rowsAffected > 0)
        {
            logger.LogInformation("Deal with ID {DealId} updated successfully", dealId);
            return true;
        }

        logger.LogWarning("No changes were saved for deal with ID {DealId}", dealId);
        return false;
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