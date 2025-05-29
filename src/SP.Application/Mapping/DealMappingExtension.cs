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
            deal.DiscountType,
            deal.DiscountValue,
            deal.Promo,
            deal.IsActive,
            deal.Url,
            deal.RedeemType,
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
            deal.DiscountType,
            deal.DiscountValue,
            deal.Promo,
            deal.IsActive,
            deal.Url,
            deal.RedeemType,
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
            deal.DiscountType,
            deal.DiscountValue,
            deal.Promo,
            deal.IsActive,
            deal.Url,
            deal.RedeemType,
            deal.StartDate,
            deal.EndDate,
            deal.Store.Name
        );
    }

    public static Deal ToEntity(this CreateDealRequest request,
        Category category, Store store)
    {
        return new Deal
        {
            Name = request.Title,
            Description = request.Description,
            DiscountType = request.DiscountType.ToString(),
            DiscountValue = request.DiscountValue,
            Promo = request.Promo,
            IsActive = request.IsActive,
            Url = request.Url,
            RedeemType = request.RedeemType.ToString(),
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            Category = category,
            Store = store
        };
    }

    public static void ToEntity(this UpdateDealRequest request,
        Deal deal, Category category, Store store)
    {
        deal.Name = request.Title;
        deal.Description = request.Description;
        deal.DiscountType = request.DiscountType.ToString();
        deal.DiscountValue = request.DiscountValue;
        deal.Promo = request.Promo;
        deal.IsActive = request.IsActive;
        deal.Url = request.Url;
        deal.RedeemType = request.RedeemType.ToString();
        deal.StartDate = request.StartDate;
        deal.EndDate = request.EndDate;
        deal.Category = category;
        deal.Store = store;
        deal.UpdatedAt = DateTime.UtcNow;
    }
}