using SP.Domain.Enum;

namespace SP.Application.Dtos.Deal;

public record CreateDealRequest(
    string Title,
    string Description,
    DiscountType DiscountType,
    string? DiscountValue,
    string? Promo,
    bool IsActive,
    string Url,
    string Location,
    DateOnly? StartDate,
    DateOnly? EndDate,
    string CategoryName,
    string? StoreName);

public record UpdateDealRequest(
    string Title,
    string Description,
    DiscountType DiscountType,
    string? DiscountValue,
    string? Promo,
    bool IsActive,
    string Url,
    string Location,
    DateOnly? StartDate,
    DateOnly? EndDate,
    string CategoryName,
    string? StoreName);