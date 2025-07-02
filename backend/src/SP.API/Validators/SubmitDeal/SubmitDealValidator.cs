using FluentValidation;
using SP.Application.Dtos.SubmitDeal;

namespace SP.API.Validators.SubmitDeal;

public class SubmitDealValidator : AbstractValidator<SubmitDealRequest>
{
    public SubmitDealValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Name is required.")
            .MaximumLength(250)
            .WithMessage("Name must not exceed 100 characters.");

        RuleFor(x => x.Url)
            .NotEmpty()
            .WithMessage("Url is required.")
            .Must(BeAValidUrl)
            .WithMessage("Url must be a valid URL.");
    }

    private static bool BeAValidUrl(string url)
    {
        return Uri.TryCreate(url, UriKind.Absolute, out var uriResult) &&
               (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
    }
}