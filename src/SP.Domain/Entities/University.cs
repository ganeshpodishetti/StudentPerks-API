namespace SP.Domain.Entities;

public sealed class University : Base
{
    public required string Code { get; set; }
    public string? Country { get; set; }
    public string? State { get; set; }
    public string? City { get; set; }
    public string? ImageUrl { get; set; } // Changed from ImagePath to ImageUrl
    public string? ImageKitFileId { get; set; }
    public bool IsActive { get; set; } = true;
    public ICollection<Deal> Deals { get; set; } = [];
}