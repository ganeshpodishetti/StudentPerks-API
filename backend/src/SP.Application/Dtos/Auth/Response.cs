namespace SP.Application.Dtos.Auth;

public record RegisterResponse(
    string Email
);

public record LoginResponse(
    string Id,
    string FirstName,
    string LastName,
    string Email,
    string AccessToken
);