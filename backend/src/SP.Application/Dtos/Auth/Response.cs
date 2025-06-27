namespace SP.Application.Dtos.Auth;

public record RegisterResponse(
    string Email
);

public record LoginResponse(
    string Id,
    string Email,
    string? FirstName,
    string? LastName,
    string AccessToken,
    DateTime AccessTokenExpirationInMinutes
);

public record CurrentUserResponse(
    string Id,
    string Email,
    string? FirstName,
    string? LastName
);