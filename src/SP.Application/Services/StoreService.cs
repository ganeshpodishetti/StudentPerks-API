using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SP.Application.Contracts;
using SP.Application.Dtos.Store;
using SP.Application.Mapping;
using SP.Infrastructure.Context;

namespace SP.Application.Services;

public class StoreService(SpDbContext spDbContext, ILogger<StoreService> logger) : IStore
{
    public async Task<IEnumerable<StoreResponse>> GetAllStoresAsync(CancellationToken ct)
    {
        logger.LogInformation("Retrieving all stores from the database");
        var stores = await spDbContext.Stores
                                      .AsNoTracking()
                                      .ToListAsync(ct);
        logger.LogInformation("Retrieved {Count} stores from the database", stores.Count);
        return stores.Select(s => s.ToDto());
    }

    public async Task<StoreResponse?> GetStoreByIdAsync(Guid storeId, CancellationToken ct)
    {
        logger.LogInformation("Retrieving a store with ID {StoreId}", storeId);
        var store = await spDbContext.Stores
                                     .AsNoTracking()
                                     .SingleOrDefaultAsync(s => s.Id == storeId, ct);
        if (store is not null)
        {
            logger.LogInformation("Retrieved a store with ID {StoreId}", storeId);
            return store?.ToDto();
        }

        logger.LogInformation("Store with ID {StoreId} not found.", storeId);
        return null;
    }

    public async Task<bool> UpdateStoreAsync(Guid storeId, UpdateStoreRequest updateStoreRequest, CancellationToken ct)
    {
        var store = await spDbContext.Stores.SingleOrDefaultAsync(s => s.Id == storeId, ct);
        if (store is null)
        {
            logger.LogInformation("Store with ID {StoreId} not found.", storeId);
            return false;
        }

        logger.LogInformation("Updating store with ID {StoreId}", storeId);
        updateStoreRequest.ToEntity(store);
        await spDbContext.SaveChangesAsync(ct);
        logger.LogInformation("Store with ID {StoreId} updated successfully", storeId);
        return true;
    }

    public async Task<bool> DeleteStoreAsync(Guid storeId, CancellationToken ct)
    {
        var store = await spDbContext.Stores.SingleOrDefaultAsync(s => s.Id == storeId, ct);
        if (store is null)
        {
            logger.LogInformation("Store with ID {StoreId} not found.", storeId);
            return false;
        }

        logger.LogInformation("Deleting store with ID {StoreId}", storeId);
        spDbContext.Stores.Remove(store);
        await spDbContext.SaveChangesAsync(ct);
        logger.LogInformation("Store with ID {StoreId} deleted successfully", storeId);
        return true;
    }

    public async Task<StoreResponse> CreateStoreAsync(CreateStoreRequest createStoreRequest,
        CancellationToken cancellationToken)
    {
        var existingStore = await spDbContext.Stores.SingleOrDefaultAsync(
            c => c.Name == createStoreRequest.Name.ToLower(),
            cancellationToken);

        if (existingStore is not null)
        {
            logger.LogInformation("Store with name {StoreName} already exists, returning existing store.",
                createStoreRequest.Name);
            return existingStore.ToDto();
        }

        logger.LogInformation("Creating a new store with name {StoreName}", createStoreRequest.Name);
        var store = createStoreRequest.ToEntity();
        await spDbContext.Stores.AddAsync(store, cancellationToken);
        await spDbContext.SaveChangesAsync(cancellationToken);
        logger.LogInformation("Store with ID {StoreId} created successfully", store.Id);
        return store.ToDto();
    }
}