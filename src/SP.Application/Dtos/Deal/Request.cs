using Microsoft.AspNetCore.Http;

namespace SP.Application.Dtos.Deal;

public record CreateDealRequest(
    string Title,
    string Description,
    string Discount,
    IFormFile? Image,
    string? Promo,
    bool IsActive,
    string Url,
    string RedeemType,
    string? HowToRedeem,
    DateTime? StartDate,
    DateTime? EndDate,
    string CategoryName,
    string StoreName,
    string? UniversityName,
    bool? IsUniversitySpecific);

public record UpdateDealRequest(
    string Title,
    string Description,
    string Discount,
    IFormFile? Image,
    string? Promo,
    bool IsActive,
    string Url,
    string RedeemType,
    string? HowToRedeem,
    DateTime? StartDate,
    DateTime? EndDate,
    bool? IsUniversitySpecific,
    string CategoryName,
    string StoreName,
    string? UniversityName);