namespace SP.Application.Dtos.Deal;

public record GetDealResponse(
    Guid Id,
    string Title,
    string Description,
    string DiscountType,
    string? DiscountValue,
    string? Promo,
    bool IsActive,
    string Url,
    string RedeemType,
    DateOnly? StartDate,
    DateOnly? EndDate,
    string CategoryName,
    string StoreName);

public record GetDealsByCategoryResponse(
    Guid Id,
    string Title,
    string Description,
    string DiscountType,
    string? DiscountValue,
    string? Promo,
    bool IsActive,
    string Url,
    string RedeemType,
    DateOnly? StartDate,
    DateOnly? EndDate,
    string CategoryName);

public record GetDealsByStoreResponse(
    Guid Id,
    string Title,
    string Description,
    string DiscountType,
    string? DiscountValue,
    string? Promo,
    bool IsActive,
    string Url,
    string RedeemType,
    DateOnly? StartDate,
    DateOnly? EndDate,
    string StoreName);