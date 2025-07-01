namespace SP.Application.ErrorHandler;

public static class CustomErrors
{
    public const string InvalidToken = "Invalid token";
    public const string InvalidCredentials = "Invalid Email or Password!";
    public const string UserNotFound = "User not found";
    public const string DealNotFound = "Deal not found";
    public const string CategoryNotFound = "Category not found";
    public const string StoreNotFound = "Store not found";
    public const string DealAlreadyExists = "Deal already exists";
    public const string CategoryAlreadyExists = "Category already exists";
    public const string StoreAlreadyExists = "Store already exists";
    public const string AccountLocked = "Account is temporarily locked. Please try again later.";
    public const string JwtTokenNotSet = "JWT key is not set, missing.";
    public const string InvalidRefreshToken = "Invalid or expired refresh token";

    public const string EmailAlreadyExists = "Email already exists";
    public const string RegistrationNotAllowed = "Registration is not allowed. Admin already exists.";
}