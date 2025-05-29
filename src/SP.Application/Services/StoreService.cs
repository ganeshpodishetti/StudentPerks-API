using Microsoft.EntityFrameworkCore;
using SP.Application.Dtos.Store;
using SP.Application.Interfaces;
using SP.Application.Mapping;
using SP.Infrastructure.Context;

namespace SP.Application.Services;

public class StoreService(SpDbContext spDbContext) : IStore
{
    public async Task<IEnumerable<StoreResponse>> GetAllStoresAsync(CancellationToken ct)
    {
        var stores = await spDbContext.Stores
                                      .AsNoTracking()
                                      .ToListAsync(ct);
        return stores.Select(s => s.ToDto());
    }

    public async Task<StoreResponse?> GetStoreByIdAsync(Guid storeId, CancellationToken ct)
    {
        var store = await spDbContext.Stores
                                     .AsNoTracking()
                                     .SingleOrDefaultAsync(s => s.Id == storeId, ct);
        return store?.ToDto();
    }

    public async Task<bool> UpdateStoreAsync(Guid storeId, UpdateStoreRequest updateStoreRequest, CancellationToken ct)
    {
        var store = await spDbContext.Stores.SingleOrDefaultAsync(s => s.Id == storeId, ct);
        if (store == null) return false;

        updateStoreRequest.ToEntity(store);
        await spDbContext.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> DeleteStoreAsync(Guid storeId, CancellationToken ct)
    {
        var store = await spDbContext.Stores.SingleOrDefaultAsync(s => s.Id == storeId, ct);
        if (store == null) return false;
        spDbContext.Stores.Remove(store);
        await spDbContext.SaveChangesAsync(ct);
        return true;
    }

    public async Task<StoreResponse> CreateStoreAsync(CreateStoreRequest createStoreRequest,
        CancellationToken cancellationToken)
    {
        var existingStore = await spDbContext.Stores.SingleOrDefaultAsync(
            c => c.Name == createStoreRequest.Name.ToLower(),
            cancellationToken);

        if (existingStore != null) return existingStore.ToDto();

        var store = createStoreRequest.ToEntity();

        await spDbContext.Stores.AddAsync(store, cancellationToken);
        await spDbContext.SaveChangesAsync(cancellationToken);
        return store.ToDto();
    }
}