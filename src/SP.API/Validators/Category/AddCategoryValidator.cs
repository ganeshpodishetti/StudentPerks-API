using FluentValidation;
using SP.Application.Dtos.Category;

namespace SP.API.Validators.Category;

public class AddCategoryValidator : AbstractValidator<CreateCategoryRequest>
{
    public AddCategoryValidator()
    {
        RuleFor(x => x.Name)
            .Must(x => !string.IsNullOrEmpty(x))
            .WithMessage("Category name can't be empty.");

        RuleFor(x => x.Description)
            .MaximumLength(150)
            .WithMessage("Description cannot exceed 150 characters.");
    }
}