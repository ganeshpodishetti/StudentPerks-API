using SP.Application.Dtos.Auth;

namespace SP.Application.Contracts;

public interface IAuth
{
    Task<RegisterResponse> RegisterAsync(RegisterRequest request,
        CancellationToken cancellationToken = default);

    Task<LoginResponse> LoginAsync(LoginRequest request,
        CancellationToken cancellationToken = default);

    Task<RefreshTokenResponse> RefreshTokenAsync(string refreshToken,
        CancellationToken cancellationToken = default);

    Task<bool> LogoutAsync(string refreshToken,
        CancellationToken cancellationToken = default);

    Task<CurrentUserResponse?> GetCurrentUserAsync(string refreshToken,
        CancellationToken cancellationToken = default);

    Task<bool> ValidateRefreshTokenAsync(string refreshToken,
        CancellationToken cancellationToken = default);
}