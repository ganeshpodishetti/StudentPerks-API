namespace SP.Domain.Entities;

public sealed class Store : Base
{
    public string? Description { get; set; }
    public string? Website { get; set; }

    // One store has many deals
    public ICollection<Deal> Deals { get; set; } = [];
}