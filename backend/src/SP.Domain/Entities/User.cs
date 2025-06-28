using Microsoft.AspNetCore.Identity;

namespace SP.Domain.Entities;

public sealed class User : IdentityUser
{
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
    public DateTime? LastModifiedAt { get; set; }
    public ICollection<RefreshToken> RefreshTokens { get; set; } = [];
}