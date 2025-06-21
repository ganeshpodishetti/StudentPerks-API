using SP.Application.Dtos.Deal;

namespace SP.Application.Contracts;

public interface IDeal
{
    Task<GetDealResponse?> GetDealByIdAsync(Guid dealId, CancellationToken cancellationToken);

    Task<IEnumerable<GetDealsByCategoryResponse>?> GetDealsByCategoryAsync(string categoryName,
        CancellationToken cancellationToken);

    Task<IEnumerable<GetDealsByStoreResponse>?> GetDealsByStoreAsync(string storeName,
        CancellationToken cancellationToken);

    Task<IEnumerable<GetDealResponse>> GetAllDealsAsync(CancellationToken cancellationToken);
    Task<bool> CreateDealAsync(CreateDealRequest createDealRequest, CancellationToken cancellationToken);
    Task<bool> UpdateDealAsync(Guid dealId, UpdateDealRequest updateDealDto, CancellationToken cancellationToken);
    Task<bool> DeleteDealAsync(Guid dealId, CancellationToken cancellationToken);
}