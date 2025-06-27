using SP.Application.Dtos.Auth;
using SP.Domain.Entities;
using SP.Domain.Options;

namespace SP.Application.Mapping;

public static class AuthMappingExtension
{
    public static User ToEntity(this RegisterRequest registerRequest)
    {
        return new User
        {
            FirstName = registerRequest.FirstName,
            LastName = registerRequest.LastName,
            Email = registerRequest.Email,
            UserName = registerRequest.Email
        };
    }

    public static RegisterResponse ToDto(this User user)
    {
        return new RegisterResponse(user.Email!);
    }

    public static LoginResponse ToLoginDto(this User user, string accessToken, DateTime accessTokenExpiration)
    {
        return new LoginResponse(
            user.Id,
            user.Email!,
            user.FirstName,
            user.LastName,
            accessToken,
            accessTokenExpiration
        );
    }

    public static RefreshToken CreateRefreshTokenEntity(string token, string userId)
    {
        var jwtOptions = new JwtOptions();
        return new RefreshToken
        {
            Id = Guid.NewGuid(),
            Token = token,
            UserId = userId,
            ExpirationDate = DateTime.UtcNow.AddDays(jwtOptions.RefreshTokenExpirationInDays),
            IsRevoked = false
        };
    }

    public static CurrentUserResponse ToCurrentUserDto(this User user)
    {
        return new CurrentUserResponse(
            user.Id,
            user.Email!,
            user.FirstName,
            user.LastName);
    }

    public static RefreshTokenResponse ToRefreshTokenDto(string accessToken, DateTime accessTokenExpiration)
    {
        return new RefreshTokenResponse(accessToken, accessTokenExpiration);
    }
}