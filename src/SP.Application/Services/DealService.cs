using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SP.Application.Contracts;
using SP.Application.Dtos.Deal;
using SP.Application.Mapping;
using SP.Domain.Entities;
using SP.Infrastructure.Context;

namespace SP.Application.Services;

public class DealService(
    SpDbContext spDbContext,
    IFileService fileService,
    ILogger<DealService> logger)
    : IDeal
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

    public async Task<IEnumerable<GetDealsByUniversityResponse>?> GetDealsByUniversityAsync(string universityName,
        CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving all deals for university {UniversityName}", universityName);
        var deals = await spDbContext.Deals
                                     .Include(d => d.University)
                                     .Where(d => d.University!.Name == universityName)
                                     .Select(d => d.ToUniversityDto())
                                     .AsNoTracking()
                                     .ToListAsync(cancellationToken);
        logger.LogInformation("Retrieved {Count} deals for university {UniversityName}", deals.Count, universityName);
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

    public async Task<DealResponse> CreateDealAsync(CreateDealRequest request, CancellationToken ct)
    {
        var existingStore = await spDbContext.Stores.FirstOrDefaultAsync(s => s.Name == request.StoreName, ct);
        var existingCategory =
            await spDbContext.Categories.FirstOrDefaultAsync(c => c.Name == request.CategoryName, ct);
        var existingUniversity = string.IsNullOrEmpty(request.UniversityName)
            ? null
            : await spDbContext.Universities.FirstOrDefaultAsync(u => u.Name == request.UniversityName, ct);

        // Create category if it doesn't exist
        if (existingCategory is null)
        {
            logger.LogInformation("Creating new category: {CategoryName}", request.CategoryName);
            existingCategory = new Category { Name = request.CategoryName };
            await spDbContext.Categories.AddAsync(existingCategory, ct);
            await spDbContext.SaveChangesAsync(ct);
        }

        // Create store if it doesn't exist
        if (existingStore is null)
        {
            logger.LogInformation("Creating new store: {StoreName}", request.StoreName);
            existingStore = new Store { Name = request.StoreName };
            await spDbContext.Stores.AddAsync(existingStore, ct);
            await spDbContext.SaveChangesAsync(ct);
        }

        if (request.IsUniversitySpecific is true && existingUniversity is null)
        {
            if (string.IsNullOrEmpty(request.UniversityName))
            {
                logger.LogError("University name must be provided when IsUniversitySpecific is true");
                throw new InvalidOperationException("University name must be provided when IsUniversitySpecific is true.");
            }
        }

        var deal = await request.ToEntity(existingCategory!.Id, existingStore!.Id, existingUniversity?.Id, fileService);

        await spDbContext.Deals.AddAsync(deal, ct);
        await spDbContext.SaveChangesAsync(ct);

        logger.LogInformation("Deal with ID {DealId} created successfully", deal.Id);
        return deal.ToDealDto();
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

    public async Task<bool> UpdateDealAsync(Guid dealId, UpdateDealRequest updateDealRequest,
        CancellationToken ct)
    {
        var deal = await spDbContext.Deals.SingleOrDefaultAsync(d => d.Id == dealId, ct);
        if (deal == null)
        {
            logger.LogWarning("Deal with ID {DealId} not found", dealId);
            return false;
        }

        var existingStore =
            await spDbContext.Stores.FirstOrDefaultAsync(s => s.Name == updateDealRequest.StoreName, ct);
        var existingCategory =
            await spDbContext.Categories.FirstOrDefaultAsync(c => c.Name == updateDealRequest.CategoryName, ct);
        var existingUniversity = string.IsNullOrEmpty(updateDealRequest.UniversityName)
            ? null
            : await spDbContext.Universities.FirstOrDefaultAsync(u => u.Name == updateDealRequest.UniversityName, ct);

        if (existingCategory is null || existingStore is null)
        {
            logger.LogWarning(
                "Either category or store not found for deal update. Category: {Category}, Store: {Store}",
                existingCategory?.Name, existingStore?.Name);
            return false;
        }

        if (existingUniversity is null && updateDealRequest.IsUniversitySpecific is true)
        {
            logger.LogWarning("University {UniversityName} not found for deal update",
                updateDealRequest.UniversityName);
            return false;
        }

        logger.LogInformation("Updating deal with ID {DealId}", dealId);
        updateDealRequest.ToEntity(deal, existingCategory, existingStore, existingUniversity, fileService);
        spDbContext.Deals.Update(deal);

        var rowsAffected = await spDbContext.SaveChangesAsync(ct);
        if (rowsAffected > 0)
        {
            logger.LogInformation("Deal with ID {DealId} updated successfully.", dealId);
            return true;
        }

        logger.LogWarning("No changes were saved for deal with ID {DealId}", dealId);
        return false;
    }
}