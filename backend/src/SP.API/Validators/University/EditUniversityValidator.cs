using FluentValidation;
using SP.Application.Dtos.University;

namespace SP.API.Validators.University;

public class EditUniversityValidator : AbstractValidator<UpdateUniversityRequest>
{
    public EditUniversityValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required.")
            .MaximumLength(250).WithMessage("Name must not exceed 250 characters.");

        RuleFor(x => x.Country)
            .NotEmpty().WithMessage("Country is required.")
            .MaximumLength(100).WithMessage("Country must not exceed 100 characters.");

        RuleFor(x => x.Code)
            .NotEmpty().WithMessage("Code is required.")
            .MaximumLength(10).WithMessage("City must not exceed 10 characters.");
    }
}