namespace SP.Application.Dtos.Auth;

public record RegisterRequest(
    string FirstName,
    string LastName,
    string Email,
    string Password,
    string Role
);

public record LoginRequest(
    string Email,
    string Password
);