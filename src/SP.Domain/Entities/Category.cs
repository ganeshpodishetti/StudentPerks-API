namespace SP.Domain.Entities;

public sealed class Category : Base
{
    public Guid CategoryId { get; set; }
    public string? Name { get; set; } 
    public string? Description { get; set; } 
    
    // One category has many deals
    public ICollection<Deal> Deals { get; set; } = [];
}