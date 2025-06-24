namespace SP.Application.Dtos.Deal;

public record GetDealResponse(
    Guid Id,
    string Title,
    string Description,
    string Discount,
    string ImageUrl,
    string? Promo,
    bool IsActive,
    string Url,
    string RedeemType,
    DateTime? StartDate,
    DateTime? EndDate,
    string CategoryName,
    string StoreName);

public record GetDealsByCategoryResponse(
    Guid Id,
    string Title,
    string Description,
    string Discount,
    string ImageUrl,
    string? Promo,
    bool IsActive,
    string Url,
    string RedeemType,
    DateTime? StartDate,
    DateTime? EndDate,
    string CategoryName);

public record GetDealsByStoreResponse(
    Guid Id,
    string Title,
    string Description,
    string Discount,
    string ImageUrl,
    string? Promo,
    bool IsActive,
    string Url,
    string RedeemType,
    DateTime? StartDate,
    DateTime? EndDate,
    string StoreName);