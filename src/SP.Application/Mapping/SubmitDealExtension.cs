using SP.Application.Dtos.SubmitDeal;
using SP.Domain.Entities;

namespace SP.Application.Mapping;

public static class SubmitDealExtension
{
    public static SubmittedDealResponse ToDto(this SubmitDeal deal)
    {
        return new SubmittedDealResponse(
            deal.Id,
            deal.Name,
            deal.Url,
            deal.MarkedAsRead,
            deal.CreatedAt);
    }

    public static SubmitDeal ToEntity(this SubmitDealRequest request)
    {
        return new SubmitDeal
        {
            Name = request.Name,
            Url = request.Url,
            MarkedAsRead = false
        };
    }

    public static void UpdateEntity(this MarkAsReadDealRequest request, SubmitDeal deal)
    {
        deal.MarkedAsRead = request.MarkedAsRead;
    }
}