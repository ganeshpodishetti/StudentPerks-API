using FluentValidation;
using SP.Application.Dtos.Deal;
using SP.Domain.Enums;

namespace SP.API.Validators.Deals;

public class AddDealValidator : AbstractValidator<CreateDealRequest>
{
    public AddDealValidator()
    {
        RuleFor(x => x.Title)
            .Must(x => !string.IsNullOrEmpty(x))
            .WithMessage("Deal title can't be empty.");

        RuleFor(x => x.Description)
            .MaximumLength(1024)
            .WithMessage("Description cannot exceed 1024 characters.");

        RuleFor(x => x.Discount)
            .Must(x => !string.IsNullOrEmpty(x))
            .WithMessage("Discount is required.");

        RuleFor(x => x.ImageUrl)
            .Must(x => !string.IsNullOrEmpty(x))
            .WithMessage("ImageUrl is required.");

        RuleFor(x => x.Url)
            .Must(x => !string.IsNullOrEmpty(x)).WithMessage("URL is required.")
            .Must(url => Uri.TryCreate(url, UriKind.Absolute, out _))
            .WithMessage("Invalid URL format.");

        RuleFor(x => x.RedeemType)
            .Must(x => !string.IsNullOrEmpty(x))
            .WithMessage("Redeem type is required.")
            .IsEnumName(typeof(RedeemType), false)
            .WithMessage("Redeem type must be in Online, InStore, Both, Unknown.");

        RuleFor(x => x.StartDate)
            .LessThanOrEqualTo(DateOnly.FromDateTime(DateTime.UtcNow))
            .WithMessage("Start date must be in the past or today.");

        RuleFor(x => x.EndDate)
            .GreaterThanOrEqualTo(DateOnly.FromDateTime(DateTime.UtcNow))
            .WithMessage("End date must be in the future.");

        RuleFor(x => x.CategoryName)
            .Must(x => !string.IsNullOrEmpty(x))
            .WithMessage("Category name is required.");

        RuleFor(x => x.StoreName)
            .Must(x => !string.IsNullOrEmpty(x))
            .WithMessage("Store name is required.");
    }
}