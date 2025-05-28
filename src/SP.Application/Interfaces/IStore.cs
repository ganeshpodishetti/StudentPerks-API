using SP.Application.Dtos.Store;

namespace SP.Application.Interfaces;

public interface IStore
{
    Task<IEnumerable<StoreResponse>?> GetAllStoresAsync(CancellationToken cancellationToken);
    Task<StoreResponse?> GetStoreByIdAsync(Guid storeId, CancellationToken cancellationToken);
    Task<bool> UpdateStore(Guid storeId, UpdateStoreRequest updateStoreRequest, CancellationToken cancellationToken);
    Task<bool> DeleteStore(Guid storeId, CancellationToken cancellationToken);
}