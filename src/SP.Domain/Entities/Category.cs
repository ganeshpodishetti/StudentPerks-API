namespace SP.Domain.Entities;

public sealed class Category : Base
{
    public string? Description { get; set; }
    public string? ImageUrl { get; set; } // Changed from ImagePath to ImageUrl
    public string? ImageKitFileId { get; set; }

    // One category has many deals
    public ICollection<Deal> Deals { get; set; } = [];
}