using Microsoft.AspNetCore.Http;

namespace SP.Application.Helper;

public static class RefreshTokenCookieHelper
{
    public static CookieOptions CreateRefreshTokenCookieOptions(DateTime expiration)
    {
        return new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            Expires = expiration,
            SameSite = SameSiteMode.Strict,
            Path = "/"
        };
    }
}