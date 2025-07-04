using SP.Application.Contracts;
using SP.Application.Dtos.Deal;
using SP.Domain.Entities;

namespace SP.Application.Mapping;

public static class DealExtension
{
    public static GetDealResponse ToDto(this Deal deal)
    {
        return new GetDealResponse(
            deal.Id,
            deal.Name,
            deal.Description,
            deal.Discount,
            deal.Promo,
            deal.ImageUrl,
            deal.IsActive,
            deal.Url,
            deal.RedeemType,
            deal.HowToRedeem,
            deal.StartDate,
            deal.EndDate,
            deal.IsUniversitySpecific,
            deal.Category.Name,
            deal.Store.Name,
            deal.University?.Name ?? string.Empty);
    }

    public static DealResponse ToDealDto(this Deal deal)
    {
        return new DealResponse(deal.Id);
    }

    public static GetDealsByCategoryResponse ToCategoryDto(this Deal deal)
    {
        return new GetDealsByCategoryResponse(
            deal.Id,
            deal.Name,
            deal.Description,
            deal.Discount,
            deal.Promo,
            deal.ImageUrl,
            deal.Category.ImageUrl,
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
            deal.Promo,
            deal.ImageUrl,
            deal.IsActive,
            deal.Url,
            deal.RedeemType,
            deal.HowToRedeem,
            deal.StartDate,
            deal.EndDate,
            deal.Store.Name
        );
    }

    public static GetDealsByUniversityResponse ToUniversityDto(this Deal deal)
    {
        return new GetDealsByUniversityResponse(
            deal.Id,
            deal.Name,
            deal.Description,
            deal.Discount,
            deal.Promo,
            deal.ImageUrl,
            deal.University?.ImageUrl,
            deal.IsActive,
            deal.Url,
            deal.RedeemType,
            deal.HowToRedeem,
            deal.StartDate,
            deal.EndDate,
            deal.University!.Name
        );
    }

    public static async Task<Deal> ToEntity(this CreateDealRequest request,
        Guid categoryId, Guid storeId, Guid? universityId, IFileService fileService)
    {
        if (request.Image is null)
            return new Deal
            {
                Name = request.Title,
                Description = request.Description,
                Discount = request.Discount,
                Promo = request.Promo,
                IsActive = request.IsActive,
                Url = request.Url,
                RedeemType = request.RedeemType,
                HowToRedeem = request.HowToRedeem,
                StartDate = request.StartDate?.Kind == DateTimeKind.Utc
                    ? request.StartDate
                    : request.StartDate?.ToUniversalTime(),
                EndDate = request.EndDate?.Kind == DateTimeKind.Utc
                    ? request.EndDate
                    : request.EndDate?.ToUniversalTime(),
                CategoryId = categoryId,
                StoreId = storeId,
                UniversityId = universityId ?? null,
                IsUniversitySpecific = universityId.HasValue
            };

        var imageUrl = await fileService.UploadImageAsync(request.Image, "deals");
        var imageKitFileId = fileService.ExtractFileIdFromUrl(imageUrl);

        return new Deal
        {
            Name = request.Title,
            Description = request.Description,
            Discount = request.Discount,
            Promo = request.Promo,
            IsActive = request.IsActive,
            Url = request.Url,
            RedeemType = request.RedeemType,
            HowToRedeem = request.HowToRedeem,
            StartDate = request.StartDate?.Kind == DateTimeKind.Utc
                ? request.StartDate
                : request.StartDate?.ToUniversalTime(),
            EndDate = request.EndDate?.Kind == DateTimeKind.Utc
                ? request.EndDate
                : request.EndDate?.ToUniversalTime(),
            CategoryId = categoryId,
            StoreId = storeId,
            UniversityId = universityId ?? null,
            IsUniversitySpecific = universityId.HasValue,
            ImageUrl = imageUrl,
            ImageKitFileId = imageKitFileId
        };
    }

    public static void ToEntity(this UpdateDealRequest request,
        Deal deal, Category category, Store store, University? university, IFileService fileService)
    {
        if (request.Image != null)
        {
            if (!string.IsNullOrEmpty(deal.ImageKitFileId))
                // Delete the old image if it exists
                fileService.DeleteImageAsync(deal.ImageKitFileId).Wait();

            // Handle image upload and update
            var imageUrl = fileService.UploadImageAsync(request.Image, "deals").Result;
            deal.ImageUrl = imageUrl;
            deal.ImageKitFileId = fileService.ExtractFileIdFromUrl(imageUrl);
        }

        deal.Name = request.Title;
        deal.Description = request.Description;
        deal.Discount = request.Discount;
        deal.Promo = request.Promo;
        deal.IsActive = request.IsActive;
        deal.Url = request.Url;
        deal.RedeemType = request.RedeemType;
        deal.HowToRedeem = request.HowToRedeem;
        deal.StartDate = request.StartDate?.Kind == DateTimeKind.Utc
            ? request.StartDate
            : request.StartDate?.ToUniversalTime();

        deal.EndDate = request.EndDate?.Kind == DateTimeKind.Utc
            ? request.EndDate
            : request.EndDate?.ToUniversalTime();
        deal.CategoryId = category.Id;
        deal.StoreId = store.Id;
        deal.UniversityId = university?.Id;
        deal.IsUniversitySpecific = request.IsUniversitySpecific ?? false;
        deal.UpdatedAt = DateTime.UtcNow;
    }
}