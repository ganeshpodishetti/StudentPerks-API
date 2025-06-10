using FluentValidation;
using SP.Application.Dtos.Category;

namespace SP.API.Validators.Category;

public class EditCategoryValidator : AbstractValidator<UpdateCategoryRequest>
{
    public EditCategoryValidator()
    {
        RuleFor(x => x.Description)
            .MaximumLength(150)
            .WithMessage("Description cannot exceed 150 characters.");

        RuleFor(x => x.Name)
            .Must(x => !string.IsNullOrEmpty(x))
            .WithMessage("Category name can't be empty.");
    }
}