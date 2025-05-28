using Microsoft.EntityFrameworkCore;
using SP.Application.Dtos.Store;
using SP.Application.Interfaces;
using SP.Application.Mapping;
using SP.Infrastructure.Context;

namespace SP.Application.Services;

public class StoreService(SpDbContext spDbContext) : IStore
{
    public async Task<IEnumerable<StoreResponse>?> GetAllStoresAsync(CancellationToken ct)
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
                                     .FirstOrDefaultAsync(s => s.StoreId == storeId, ct);
        return store?.ToDto();
    }

    public async Task<bool> UpdateStore(Guid storeId, UpdateStoreRequest updateStoreRequest, CancellationToken ct)
    {
        var store = await spDbContext.Stores.FirstOrDefaultAsync(s => s.StoreId == storeId, ct);
        if (store == null) return false;

        store.Name = updateStoreRequest.Name;
        store.Description = updateStoreRequest.Description;
        store.Website = updateStoreRequest.Website;
        store.UpdatedAt = DateTime.UtcNow;

        spDbContext.Update(store);
        await spDbContext.SaveChangesAsync(ct);

        return true;
    }

    public async Task<bool> DeleteStore(Guid storeId, CancellationToken ct)
    {
        var store = await spDbContext.Stores.FirstOrDefaultAsync(s => s.StoreId == storeId, ct);
        if (store == null) return false;
        spDbContext.Stores.Remove(store);
        await spDbContext.SaveChangesAsync(ct);
        return true;
    }
}