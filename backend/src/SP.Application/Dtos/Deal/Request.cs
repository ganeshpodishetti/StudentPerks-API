namespace SP.Application.Dtos.Deal;

public record CreateDealRequest(
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

public record UpdateDealRequest(
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