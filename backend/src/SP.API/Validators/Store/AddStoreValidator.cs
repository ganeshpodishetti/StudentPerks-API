using FluentValidation;
using SP.Application.Dtos.Store;

namespace SP.API.Validators.Store;

public class AddStoreValidator : AbstractValidator<CreateStoreRequest>
{
    public AddStoreValidator()
    {
        RuleFor(x => x.Name)
            .Must(x => !string.IsNullOrEmpty(x))
            .WithMessage("Store name can't be empty.");

        RuleFor(x => x.Description)
            .MaximumLength(150)
            .WithMessage("Description cannot exceed 150 characters.");

        When(x => !string.IsNullOrEmpty(x.Website), () =>
        {
            RuleFor(x => x.Website)
                .Must(url => Uri.TryCreate(url, UriKind.Absolute, out _))
                .WithMessage("Invalid website URL format.");
        });
    }
}