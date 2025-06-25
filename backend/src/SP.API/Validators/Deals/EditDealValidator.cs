using FluentValidation;
using SP.Application.Dtos.Deal;
using SP.Domain.Enums;

namespace SP.API.Validators.Deals;

public class EditDealValidator : AbstractValidator<UpdateDealRequest>
{
    public EditDealValidator()
    {
        RuleFor(x => x.Title)
            .Must(x => !string.IsNullOrEmpty(x))
            .WithMessage("Title can't be empty.");

        RuleFor(x => x.IsActive)
            .Must(x => x || x == false)
            .WithMessage("IsActive must be a true or false.");

        RuleFor(x => x.Description)
            .MaximumLength(1024)
            .WithMessage("Description cannot exceed 1024 characters.");

        RuleFor(x => x.Discount)
            .Must(x => !string.IsNullOrEmpty(x))
            .WithMessage("Discount type is required.");

        RuleFor(x => x.ImageUrl)
            .Must(x => !string.IsNullOrEmpty(x))
            .WithMessage("Image URL is required.");

        RuleFor(x => x.Url)
            .Must(x => !string.IsNullOrEmpty(x))
            .WithMessage("URL is required.")
            .Must(url => Uri.TryCreate(url, UriKind.Absolute, out _))
            .WithMessage("Invalid URL format.");

        RuleFor(x => x.RedeemType)
            .Must(x => !string.IsNullOrEmpty(x))
            .WithMessage("Redeem type is required.")
            .IsEnumName(typeof(RedeemType), false)
            .WithMessage("Redeem type must be in Online, InStore, Both, Unknown.");

        When(x => x.EndDate.HasValue, () =>
        {
            RuleFor(x => x.StartDate)
                .LessThanOrEqualTo(x => x.EndDate)
                .WithMessage("Start date must be less than or equal to end date.");

            RuleFor(x => x.EndDate)
                .GreaterThanOrEqualTo(x => x.StartDate)
                .WithMessage("End date must be in the future.");
        });

        When(x => !x.EndDate.HasValue, () =>
        {
            RuleFor(x => x.StartDate)
                .LessThanOrEqualTo(DateTime.UtcNow)
                .WithMessage("Start date must be in the future when no end date is provided.");
        });

        RuleFor(x => x.CategoryName)
            .Must(x => !string.IsNullOrEmpty(x))
            .WithMessage("Category name is required.");

        RuleFor(x => x.StoreName)
            .Must(x => !string.IsNullOrEmpty(x))
            .WithMessage("Store name is required.");
    }
}