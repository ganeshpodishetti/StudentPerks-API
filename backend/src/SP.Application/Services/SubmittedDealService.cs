using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SP.Application.Contracts;
using SP.Application.Dtos.SubmitDeal;
using SP.Application.Mapping;
using SP.Infrastructure.Context;

namespace SP.Application.Services;

public class SubmittedDealService(
    SpDbContext dbContext,
    ILogger<SubmittedDealService> logger)
    : ISubmitDeal
{
    public async Task<IEnumerable<SubmittedDealResponse>> GetAllDealsAsync(
        CancellationToken cancellationToken = default)
    {
        var deals = await dbContext.SubmitDeals
                                   .AsNoTracking()
                                   .ToListAsync(cancellationToken);
        logger.LogInformation("Retrieved {Count} submitted deals from the database", deals.Count);
        return deals.Select(d => d.ToDto());
    }

    public async Task<SubmittedDealResponse?> GetDealByIdAsync(Guid dealId,
        CancellationToken cancellationToken = default)
    {
        var deal = await dbContext.SubmitDeals
                                  .AsNoTracking()
                                  .SingleOrDefaultAsync(d => d.Id == dealId, cancellationToken);
        if (deal is not null)
        {
            logger.LogInformation("Deal with ID {DealId} found", dealId);
            return deal.ToDto();
        }

        logger.LogWarning("Deal with ID {DealId} not found", dealId);
        return null;
    }

    public async Task<bool> SubmitDealAsync(SubmitDealRequest submitDealRequest,
        CancellationToken cancellationToken = default)
    {
        var deal = submitDealRequest.ToEntity();
        await dbContext.SubmitDeals.AddAsync(deal, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
        logger.LogInformation("Deal with ID {DealId} submitted successfully", deal.Id);
        return true;
    }

    public async Task<bool> UpdateDealAsync(Guid dealId, MarkAsReadDealRequest updateDealRequest,
        CancellationToken cancellationToken = default)
    {
        var deal = await dbContext.SubmitDeals
                                  .SingleOrDefaultAsync(d => d.Id == dealId, cancellationToken);
        if (deal is null)
        {
            logger.LogWarning("Attempted to update a non-existing deal with ID {DealId}", dealId);
            return false;
        }

        updateDealRequest.UpdateEntity(deal);
        dbContext.SubmitDeals.Update(deal);
        await dbContext.SaveChangesAsync(cancellationToken);
        logger.LogInformation("Deal with ID {DealId} updated successfully", dealId);
        return true;
    }

    public async Task<bool> DeleteDealAsync(Guid dealId, CancellationToken cancellationToken = default)
    {
        var deal = await dbContext.SubmitDeals
                                  .SingleOrDefaultAsync(d => d.Id == dealId, cancellationToken);
        if (deal is null)
        {
            logger.LogWarning("Attempted to delete a non-existing deal with ID {DealId}", dealId);
            return false;
        }

        dbContext.SubmitDeals.Remove(deal);
        await dbContext.SaveChangesAsync(cancellationToken);
        logger.LogInformation("Deal with ID {DealId} deleted successfully", dealId);
        return true;
    }
}