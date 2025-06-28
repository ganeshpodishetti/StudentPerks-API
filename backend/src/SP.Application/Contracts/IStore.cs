using SP.Application.Dtos.Store;

namespace SP.Application.Contracts;

public interface IStore
{
    Task<IEnumerable<StoreResponse>> GetAllStoresAsync(CancellationToken cancellationToken);
    Task<StoreResponse?> GetStoreByIdAsync(Guid storeId, CancellationToken cancellationToken);

    Task<bool> UpdateStoreAsync(Guid storeId, UpdateStoreRequest updateStoreRequest,
        CancellationToken cancellationToken);

    Task<bool> DeleteStoreAsync(Guid storeId, CancellationToken cancellationToken);

    Task<CreateStoreResponse> CreateStoreAsync(CreateStoreRequest createStoreRequest,
        CancellationToken cancellationToken);
}