using Microsoft.AspNetCore.Identity;
using SP.Application.Contracts;
using SP.Application.Dtos.Auth;
using SP.Application.Helper;
using SP.Domain.Entities;

namespace SP.Application.Services;

public class AuthService(
    UserManager<User> userManager,
    SignInManager<User> signInManager,
    ITokenHelper tokenHelper)
    : IAuth
{
    public async Task<RegisterResponse> RegisterAsync(RegisterRequest request,
        CancellationToken cancellationToken)
    {
        var user = new User
        {
            UserName = request.Email,
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName
        };

        var result = await userManager.CreateAsync(user, request.Password);

        if (result.Succeeded) await userManager.AddToRoleAsync(user, request.Role);
        else
            throw new InvalidOperationException(
                $"User registration failed: {string.Join(", ", result.Errors.Select(e => e.Description))}");

        return new RegisterResponse(user.Email);
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken)
    {
        var user = await userManager.FindByEmailAsync(request.Email);

        if (user is null)
            throw new InvalidOperationException("Email not found.");

        var isPasswordValid = await signInManager.CheckPasswordSignInAsync(user, request.Password, false);

        if (!isPasswordValid.Succeeded) throw new InvalidOperationException("Invalid password.");
        var token = await tokenHelper.GenerateJwtToken(user);
        return new LoginResponse(token);
    }
}