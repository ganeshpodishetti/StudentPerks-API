using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using SP.Application.Contracts;
using SP.Application.Dtos.Auth;
using SP.Application.Helper;
using SP.Domain.Entities;
using SP.Domain.Options;

namespace SP.Application.Services;

public class AuthService(
    UserManager<User> userManager,
    SignInManager<User> signInManager,
    IJwtHelper jwtHelper,
    IRefreshTokenHelper refreshTokenHelper,
    IOptions<JwtOptions> jwtOptions)
    : IAuth
{
    public async Task<RegisterResponse> RegisterAsync(RegisterRequest request,
        CancellationToken cancellationToken)
    {
        var existingUser = await userManager.FindByEmailAsync(request.Email);

        if (existingUser is not null)
            throw new InvalidOperationException("Email already exists.");

        var user = new User
        {
            UserName = request.Email,
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName
        };

        var result = await userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
            throw new InvalidOperationException(
                $"User creation failed: {string.Join(", ", result.Errors.Select(e => e.Description))}");

        // result = await userManager.AddToRoleAsync(user, request.Role);
        // if (!result.Succeeded)
        //     throw new InvalidOperationException(
        //         $"Failed to assign role '{request.Role}' to user: {string.Join(", ", result.Errors.Select(e => e.Description))}");

        return new RegisterResponse(user.Email);
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken)
    {
        var user = await userManager.FindByEmailAsync(request.Email) ??
                   throw new InvalidOperationException("Email not found.");

        var isPasswordValid = await signInManager.CheckPasswordSignInAsync(user, request.Password, false);

        if (!isPasswordValid.Succeeded) throw new InvalidOperationException("Invalid email or password.");

        var accessToken = await jwtHelper.GenerateJwtToken(user);
        var refreshToken = refreshTokenHelper.GenerateRefreshToken();

        user.RefreshTokens ??= [];

        var refreshTokenEntity = new RefreshToken
        {
            Token = refreshToken,
            ExpirationDate = DateTime.UtcNow.AddDays(jwtOptions.Value.RefreshTokenExpirationInDays),
            IsRevoked = false
        };

        user.RefreshTokens.Add(refreshTokenEntity);
        var result = await userManager.UpdateAsync(user);

        if (!result.Succeeded)
            throw new InvalidOperationException(
                $"Failed to update user with refresh token: {string.Join(", ", result.Errors.Select(e => e.Description))}");

        var accessTokenExpiration = DateTime.UtcNow.AddMinutes(jwtOptions.Value.AccessTokenExpirationInMinutes);
        var refreshTokenExpiration = DateTime.UtcNow.AddDays(jwtOptions.Value.RefreshTokenExpirationInDays);

        return new LoginResponse(accessToken,
            accessTokenExpiration,
            refreshToken,
            refreshTokenExpiration);
    }
}