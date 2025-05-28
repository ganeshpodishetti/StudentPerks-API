using SP.Domain.Enum;

namespace SP.Domain.Entities;

public sealed class Deal : Base
{
    public Guid DealId { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; } 
    
    public DiscountType? DiscountType { get; set; } 
    public string? DiscountValue { get; set; }

    public string? Promo { get; set; }
    public string Url { get; set; }
    public bool IsActive { get; set; } = true;
    
    public string Location { get; set; }
    
    public DateOnly? StartDate { get; set; } 
    public DateOnly? EndDate { get; set; } 
    
    // Navigation properties
    public Guid CategoryId { get; init; }
    public Guid StoreId { get; init; }
    
    public Category Category { get; set; } 
    public Store Store { get; set; } 
}