using Microsoft.AspNetCore.Identity;

namespace SP.Domain.Entities;

public class User : IdentityUser
{
    public string FirstName { get; init; } = null!;
    public string LastName { get; init; } = null!;
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
    public DateTime? LastModifiedAt { get; init; }
    public ICollection<RefreshToken> RefreshTokens { get; init; } = [];
}