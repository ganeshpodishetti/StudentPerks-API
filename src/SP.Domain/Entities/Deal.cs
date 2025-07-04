namespace SP.Domain.Entities;

public sealed class Deal : Base
{
    public required string Description { get; set; }

    public required string Discount { get; set; }
    public string? Promo { get; set; }
    public required string Url { get; set; }
    public bool IsActive { get; set; }
    public string? ImageUrl { get; set; }
    public string? ImageKitFileId { get; set; }
    public required string RedeemType { get; set; }
    public string? HowToRedeem { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }

    public bool IsUniversitySpecific { get; set; }

    // Navigation properties
    public Guid CategoryId { get; set; }
    public Guid StoreId { get; set; }
    public Guid? UniversityId { get; set; } // Nullable for general deals
    public University? University { get; set; }

    public Category Category { get; set; } = null!;
    public Store Store { get; set; } = null!;
}