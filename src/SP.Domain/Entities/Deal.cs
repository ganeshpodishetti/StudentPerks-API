namespace SP.Domain.Entities;

public sealed class Deal : Base
{
    public required string Description { get; set; }
    public required string DiscountType { get; set; }
    public string? DiscountValue { get; set; }

    public string? Promo { get; set; }
    public required string Url { get; set; }
    public bool IsActive { get; set; } = true;

    public required string RedeemType { get; set; }

    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }

    // Navigation properties
    public Guid CategoryId { get; init; }
    public Guid StoreId { get; init; }

    public required Category Category { get; set; }
    public required Store Store { get; set; }
}