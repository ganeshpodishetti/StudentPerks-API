using SP.Application.Dtos.Auth;
using SP.Domain.Entities;

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

    public static User ToEntity(this LoginRequest loginRequest)
    {
        return new User
        {
            Email = loginRequest.Email,
            UserName = loginRequest.Email
        };
    }

    public static RegisterResponse ToDto(this User user)
    {
        return new RegisterResponse(user.Email!);
    }
}