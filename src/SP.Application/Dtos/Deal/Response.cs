namespace SP.Application.Dtos.Deal;

public record GetDealResponse(
    Guid Id,
    string Title,
    string Description,
    string Discount,
    string? Promo,
    string? ImageUrl,
    bool IsActive,
    string Url,
    string RedeemType,
    string? HowToRedeem,
    DateTime? StartDate,
    DateTime? EndDate,
    bool IsUniversitySpecific,
    string CategoryName,
    string StoreName,
    string? UniversityName);

public record GetDealsByCategoryResponse(
    Guid Id,
    string Title,
    string Description,
    string Discount,
    string? Promo,
    string? DealImageUrl,
    string? CategoryImageUrl,
    bool IsActive,
    string Url,
    string RedeemType,
    string? HowToRedeem,
    DateTime? StartDate,
    DateTime? EndDate,
    string CategoryName);

public record GetDealsByStoreResponse(
    Guid Id,
    string Title,
    string Description,
    string Discount,
    string? Promo,
    string? ImageUrl,
    bool IsActive,
    string Url,
    string RedeemType,
    string? HowToRedeem,
    DateTime? StartDate,
    DateTime? EndDate,
    string StoreName);

public record GetDealsByUniversityResponse(
    Guid Id,
    string Title,
    string Description,
    string Discount,
    string? Promo,
    string? DealImageUrl,
    string? UniversityImageUrl,
    bool IsActive,
    string Url,
    string RedeemType,
    string? HowToRedeem,
    DateTime? StartDate,
    DateTime? EndDate,
    string UniversityName);

public record DealResponse(
    Guid Id);