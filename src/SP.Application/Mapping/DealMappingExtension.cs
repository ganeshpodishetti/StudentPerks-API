using SP.Application.Dtos.Deal;
using SP.Domain.Entities;

namespace SP.Application.Mapping;

public static class DealMappingExtension
{
    public static GetDealResponse ToDto(this Deal deal)
    {
        return new GetDealResponse(
            deal.DealId,
            deal.Title,
            deal.Description,
            deal.DiscountType,
            deal.DiscountValue,
            deal.Promo,
            deal.IsActive,
            deal.Url,
            deal.Location,
            deal.StartDate,
            deal.EndDate,
            deal.Category.Name,
            deal.Store.Name);
    }

    public static GetDealsByCategoryResponse ToCategoryDto(this Deal deal)
    {
        return new GetDealsByCategoryResponse(
            deal.DealId,
            deal.Title,
            deal.Description,
            deal.DiscountType,
            deal.DiscountValue,
            deal.Promo,
            deal.IsActive,
            deal.Url,
            deal.Location,
            deal.StartDate,
            deal.EndDate,
            deal.Category.Name
        );
    }
    
    public static GetDealsByStoreResponse ToStoreDto(this Deal deal)
    {
        return new GetDealsByStoreResponse(
            deal.DealId,
            deal.Title,
            deal.Description,
            deal.DiscountType,
            deal.DiscountValue,
            deal.Promo,
            deal.IsActive,
            deal.Url,
            deal.Location,
            deal.StartDate,
            deal.EndDate,
            deal.Store.Name
        );
    }
}