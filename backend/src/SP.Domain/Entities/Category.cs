namespace SP.Domain.Entities;

public sealed class Category : Base
{
    public string? Description { get; set; }

    // One category has many deals
    public ICollection<Deal> Deals { get; set; } = [];
}