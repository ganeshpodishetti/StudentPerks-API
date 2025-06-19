namespace SP.Domain.Entities;

public class Base
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string Name { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}