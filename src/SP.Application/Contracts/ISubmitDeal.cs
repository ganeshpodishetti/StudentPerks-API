using SP.Application.Dtos.SubmitDeal;

namespace SP.Application.Contracts;

public interface ISubmitDeal
{
    Task<IEnumerable<SubmittedDealResponse>> GetAllDealsAsync(CancellationToken cancellationToken = default);

    Task<SubmittedDealResponse?> GetDealByIdAsync(Guid dealId, CancellationToken cancellationToken = default);

    Task<bool> SubmitDealAsync(SubmitDealRequest submitDealRequest,
        CancellationToken cancellationToken = default);

    Task<bool> UpdateDealAsync(Guid dealId, MarkAsReadDealRequest updateDealRequest,
        CancellationToken cancellationToken = default);

    Task<bool> DeleteDealAsync(Guid dealId, CancellationToken cancellationToken = default);
}