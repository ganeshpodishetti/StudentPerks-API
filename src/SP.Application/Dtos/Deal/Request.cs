namespace SP.Application.Dtos.Deal;

public record CreateDealRequest(
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

public record UpdateDealRequest(
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