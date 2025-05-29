using Microsoft.EntityFrameworkCore;
using SP.Application.Dtos.Deal;
using SP.Application.Interfaces;
using SP.Application.Mapping;
using SP.Domain.Entities;
using SP.Infrastructure.Context;

namespace SP.Application.Services;

public class DealService(SpDbContext spDbContext) : IDeal
{
    public async Task<GetDealResponse?> GetDealByIdAsync(Guid dealId, CancellationToken ct)
    {
        var deal = await spDbContext.Deals
                                    .Include(d => d.Category)
                                    .Include(d => d.Store)
                                    .AsNoTracking()
                                    .SingleOrDefaultAsync(d => d.Id == dealId, ct);

        return deal?.ToDto();
    }

    public Task<IEnumerable<GetDealsByCategoryResponse>?> GetDealsByCategoryAsync(string categoryName,
        CancellationToken ct)
    {
        var deals = spDbContext.Deals
                               .Include(d => d.Category)
                               .Where(d => d.Category.Name == categoryName)
                               .AsNoTracking()
                               .ToListAsync(ct);

        return Task.FromResult(deals?.Result.Select(d => d.ToCategoryDto()));
    }

    public Task<IEnumerable<GetDealsByStoreResponse>?> GetDealsByStoreAsync(string storeName, CancellationToken ct)
    {
        var deals = spDbContext.Deals
                               .Include(d => d.Store)
                               .Where(d => d.Store.Name == storeName)
                               .AsNoTracking()
                               .ToListAsync(ct);

        return Task.FromResult(deals?.Result.Select(d => d.ToStoreDto()));
    }

    public async Task<IEnumerable<GetDealResponse>> GetAllDealsAsync(CancellationToken ct)
    {
        var deals = await spDbContext.Deals
                                     .Include(d => d.Category)
                                     .Include(d => d.Store)
                                     .AsNoTracking()
                                     .ToListAsync(ct);

        return deals.Select(d => d.ToDto());
    }

    public async Task<GetDealResponse> CreateDealAsync(CreateDealRequest request, CancellationToken ct)
    {
        // Check if category with same name already exists
        var existingStore = await spDbContext.Stores
                                             .FirstOrDefaultAsync(c => c.Name == request.StoreName.ToLower(),
                                                 ct);

        // Check if category with same name already exists
        var existingCategory = await spDbContext.Categories
                                                .FirstOrDefaultAsync(c => c.Name == request.CategoryName.ToLower(),
                                                    ct);

        Category category;

        if (existingCategory != null)
        {
            // Use the existing category instead of creating a new one
            category = existingCategory;
        }
        else
        {
            category = new Category
            {
                Name = request.CategoryName.ToLower()
            };
            await spDbContext.Categories.AddAsync(category, ct);
        }

        // Handle Store
        Store store;
        if (existingStore != null)
        {
            // Use the existing category instead of creating a new one
            store = existingStore;
        }
        else
        {
            // Create a new store
            store = new Store
            {
                Name = request.StoreName!.ToLower()
            };
            await spDbContext.Stores.AddAsync(store, ct);
        }

        // Create a new deal
        var deal = request.ToEntity(category, store);

        await spDbContext.Deals.AddAsync(deal, ct);
        await spDbContext.SaveChangesAsync(ct);

        return deal.ToDto();
    }

    public async Task<bool> UpdateDealAsync(Guid dealId, UpdateDealRequest updateDealRequest, CancellationToken ct)
    {
        var deal = await spDbContext.Deals
                                    .SingleOrDefaultAsync(d => d.Id == dealId,
                                        ct);

        if (deal == null) return false;

        // Check if category with same name already exists
        var existingStore = await spDbContext.Stores
                                             .FirstOrDefaultAsync(c => c.Name == updateDealRequest.StoreName.ToLower(),
                                                 ct);

        // Check if category with same name already exists
        var existingCategory = await spDbContext.Categories
                                                .FirstOrDefaultAsync(
                                                    c => c.Name == updateDealRequest.CategoryName.ToLower(),
                                                    ct);

        if (existingCategory == null || existingStore == null) return false;

        updateDealRequest.ToEntity(deal, existingCategory, existingStore);
        await spDbContext.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> DeleteDealAsync(Guid dealId, CancellationToken ct)
    {
        var deal = await spDbContext.Deals
                                    .SingleOrDefaultAsync(d => d.Id == dealId, ct);
        if (deal == null) return false;

        spDbContext.Deals.Remove(deal);
        await spDbContext.SaveChangesAsync(ct);

        return true;
    }
}