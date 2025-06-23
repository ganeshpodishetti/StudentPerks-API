using SP.Application.Dtos.Auth;

namespace SP.Application.Contracts;

public interface IAuth
{
    Task<RegisterResponse> RegisterAsync(RegisterRequest request,
        CancellationToken cancellationToken = default);

    Task<LoginResponse> LoginAsync(LoginRequest request,
        CancellationToken cancellationToken = default);

    Task<RefreshTokenResponse> RefreshTokenAsync(CancellationToken cancellationToken = default);
}