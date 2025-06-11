using FluentValidation;
using SP.Application.Dtos.Auth;

namespace SP.API.Validators.Auth;

public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
{
    public RegisterRequestValidator()
    {
        RuleFor(x => x.FirstName)
            .Must(x => !string.IsNullOrEmpty(x))
            .WithMessage("First name is required.")
            .MaximumLength(50)
            .WithMessage("First name cannot exceed 50 characters.");

        RuleFor(x => x.LastName)
            .Must(x => !string.IsNullOrEmpty(x))
            .WithMessage("Last name is required.")
            .MaximumLength(50)
            .WithMessage("Last name cannot exceed 50 characters.");

        RuleFor(x => x.Email)
            .Must(x => !string.IsNullOrEmpty(x))
            .WithMessage("Email is required.")
            .EmailAddress()
            .WithMessage("Invalid email format.");

        RuleFor(x => x.Password)
            .Must(x => !string.IsNullOrEmpty(x))
            .WithMessage("Password is required.")
            .MinimumLength(8)
            .WithMessage("Password must be at least 8 characters long.");

        RuleFor(x => x.Role)
            .Must(x => !string.IsNullOrEmpty(x))
            .WithMessage("Role is required.")
            .MaximumLength(20)
            .WithMessage("Role cannot exceed 20 characters.");
    }
}