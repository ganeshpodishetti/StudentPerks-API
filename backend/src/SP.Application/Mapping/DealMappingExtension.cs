using SP.Application.Dtos.Deal;
using SP.Application.Helper;
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
            deal.Discount,
            ConvertToBase64Helper.ConvertImageToBase64(deal.ImageData, deal.ImageContentType),
            deal.Promo,
            deal.IsActive,
            deal.Url,
            deal.RedeemType,
            deal.HowToRedeem,
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
            deal.Discount,
            ConvertToBase64Helper.ConvertImageToBase64(deal.ImageData, deal.ImageContentType),
            deal.Promo,
            deal.IsActive,
            deal.Url,
            deal.RedeemType,
            deal.HowToRedeem,
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
            deal.Discount,
            ConvertToBase64Helper.ConvertImageToBase64(deal.ImageData, deal.ImageContentType),
            deal.Promo,
            deal.IsActive,
            deal.Url,
            deal.RedeemType,
            deal.HowToRedeem,
            deal.StartDate,
            deal.EndDate,
            deal.Store.Name
        );
    }

    public static Deal ToEntity(this CreateDealRequest request,
        Guid categoryId, Guid storeId)
    {
        byte[] imageData;
        using (var memoryStream = new MemoryStream())
        {
            request.Image?.CopyToAsync(memoryStream);
            imageData = memoryStream.ToArray();
        }

        return new Deal
        {
            Name = request.Title,
            Description = request.Description,
            Discount = request.Discount,
            ImageData = imageData,
            ImageContentType = request.Image?.ContentType,
            Promo = request.Promo,
            IsActive = request.IsActive,
            Url = request.Url,
            RedeemType = request.RedeemType,
            HowToRedeem = request.HowToRedeem,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            CategoryId = categoryId,
            StoreId = storeId
        };
    }

    public static void ToEntity(this UpdateDealRequest request,
        Deal deal, Category category, Store store)
    {
        deal.Name = request.Title;
        deal.Description = request.Description;
        deal.Discount = request.Discount;

        if (request.Image != null)
        {
            using var memoryStream = new MemoryStream();
            request.Image.CopyToAsync(memoryStream);
            deal.ImageData = memoryStream.ToArray();
            deal.ImageContentType = request.Image.ContentType;
        }

        deal.Promo = request.Promo;
        deal.IsActive = request.IsActive;
        deal.Url = request.Url;
        deal.RedeemType = request.RedeemType;
        deal.HowToRedeem = request.HowToRedeem;
        deal.StartDate = request.StartDate;
        deal.EndDate = request.EndDate;
        deal.CategoryId = category.Id;
        deal.StoreId = store.Id;
        deal.UpdatedAt = DateTime.UtcNow;
    }
}