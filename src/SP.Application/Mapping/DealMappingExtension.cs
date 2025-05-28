using SP.Application.Dtos.Deal;
using SP.Domain.Entities;

namespace SP.Application.Mapping;

public static class DealMappingExtension
{
    public static GetDealResponse ToDto(this Deal deal)
    {
        return new GetDealResponse(
            deal.Id,
            deal.Name,
            deal.Description,
            deal.DiscountType.ToString(),
            deal.DiscountValue,
            deal.Promo,
            deal.IsActive,
            deal.Url,
            deal.RedeemType.ToString(),
            deal.StartDate,
            deal.EndDate,
            deal.Category.Name,
            deal.Store.Name);
    }

    public static GetDealsByCategoryResponse ToCategoryDto(this Deal deal)
    {
        return new GetDealsByCategoryResponse(
            deal.Id,
            deal.Name,
            deal.Description,
            deal.DiscountType.ToString(),
            deal.DiscountValue,
            deal.Promo,
            deal.IsActive,
            deal.Url,
            deal.RedeemType.ToString(),
            deal.StartDate,
            deal.EndDate,
            deal.Category.Name
        );
    }

    public static GetDealsByStoreResponse ToStoreDto(this Deal deal)
    {
        return new GetDealsByStoreResponse(
            deal.Id,
            deal.Name,
            deal.Description,
            deal.DiscountType.ToString(),
            deal.DiscountValue,
            deal.Promo,
            deal.IsActive,
            deal.Url,
            deal.RedeemType.ToString(),
            deal.StartDate,
            deal.EndDate,
            deal.Store.Name
        );
    }
}