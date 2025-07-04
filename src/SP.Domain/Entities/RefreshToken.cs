namespace SP.Domain.Entities;

public sealed class RefreshToken
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string Token { get; set; }
    public DateTime ExpirationDate { get; set; }
    public bool IsRevoked { get; set; }
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
    public DateTime? LastModifiedAt { get; set; }
    public string UserId { get; set; } = null!;
    public User User { get; set; } = null!;
}