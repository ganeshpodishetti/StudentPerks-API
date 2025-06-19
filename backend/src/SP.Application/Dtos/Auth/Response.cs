namespace SP.Application.Dtos.Auth;

public record RegisterResponse(
    string Email
);

public record LoginResponse(
    string AccessToken,
    DateTime AccessTokenExpiration,
    string RefreshToken,
    DateTime RefreshTokenExpiration
);