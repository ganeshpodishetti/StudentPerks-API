using Microsoft.AspNetCore.Http;

namespace SP.Application.Helper;

public static class RefreshTokenCookieHelper
{
    public static CookieOptions CreateRefreshTokenCookieOptions(DateTime expiration)
    {
        return new CookieOptions
        {
            HttpOnly = true,
            Secure = true, // Keep true for production
            Expires = expiration,
            SameSite = SameSiteMode.None, // Changed from Strict to None for cross-origin
            Path = "/",
            Domain = null // Let browser determine domain
        };
    }
}