using System;
using SP.Domain.Enum;

namespace SP.Application.Dtos.Deal;

public record GetDealResponse(
    Guid DealId,
    string Title,
    string Description,
    DiscountType? DiscountType,
    string? DiscountValue,
    string? Promo,
    bool IsActive,
    string Url,
    string Location,
    DateOnly? StartDate,
    DateOnly? EndDate,
    string? CategoryName,
    string? StoreName);

public record GetDealsByCategoryResponse(
    Guid DealId,
    string Title,
    string Description,
    DiscountType? DiscountType,
    string? DiscountValue,
    string? Promo,
    bool IsActive,
    string Url,
    string Location,
    DateOnly? StartDate,
    DateOnly? EndDate,
    string? CategoryName);
    
public record GetDealsByStoreResponse(
    Guid DealId,
    string Title,
    string Description,
    DiscountType? DiscountType,
    string? DiscountValue,
    string? Promo,
    bool IsActive,
    string Url,
    string Location,
    DateOnly? StartDate,
    DateOnly? EndDate,
    string? StoreName);