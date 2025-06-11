namespace SP.Application.Dtos.Auth;

public record RegisterResponse(
    string Email
);

public record LoginResponse(
    string AccessToken
);