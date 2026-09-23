using FluentValidation;
using TaskFlow.Application.Templates.Dtos;

namespace TaskFlow.Application.Templates.Validators;

public class UpdateTaskTemplateRequestValidator : AbstractValidator<UpdateTaskTemplateRequest>
{
    public UpdateTaskTemplateRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("El título es obligatorio.")
            .MaximumLength(120).WithMessage("El título no puede superar los 120 caracteres.");

        RuleFor(x => x.Description)
            .MaximumLength(500).WithMessage("La descripción no puede superar los 500 caracteres.");

        RuleFor(x => x.Category)
            .MaximumLength(40).WithMessage("La categoría no puede superar los 40 caracteres.");

        RuleFor(x => x.Priority)
            .InclusiveBetween(1, 3).WithMessage("La prioridad debe ser baja (1), media (2) o alta (3).");
    }
}
