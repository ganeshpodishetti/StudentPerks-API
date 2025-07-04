using SP.Application.Dtos.Auth;
using SP.Application.ErrorHandler;

namespace SP.Application.Contracts;

public interface IAuth
{
    Task<Result<RegisterResponse>> RegisterAsync(RegisterRequest request,
        CancellationToken cancellationToken = default);

    Task<Result<LoginResponse>> LoginAsync(LoginRequest request,
        CancellationToken cancellationToken = default);

    Task<Result<RefreshTokenResponse>> RefreshTokenAsync(string refreshToken,
        CancellationToken cancellationToken = default);

    Task<Result<bool>> RevokeRefreshTokenAsync(string refreshToken,
        CancellationToken cancellationToken = default);

    Task<Result<CurrentUserResponse?>> GetCurrentUserAsync(string refreshToken,
        CancellationToken cancellationToken = default);

    Task<Result<bool>> ValidateRefreshTokenAsync(string refreshToken,
        CancellationToken cancellationToken = default);
}