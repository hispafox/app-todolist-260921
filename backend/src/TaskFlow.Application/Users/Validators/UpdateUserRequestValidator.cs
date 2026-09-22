using FluentValidation;
using TaskFlow.Application.Users.Dtos;

namespace TaskFlow.Application.Users.Validators;

public class UpdateUserRequestValidator : AbstractValidator<UpdateUserRequest>
{
    public UpdateUserRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("El nombre es obligatorio.")
            .MaximumLength(80).WithMessage("El nombre no puede superar los 80 caracteres.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("El email es obligatorio.")
            .EmailAddress().WithMessage("El email no tiene un formato válido.")
            .MaximumLength(200).WithMessage("El email no puede superar los 200 caracteres.");

        RuleFor(x => x.Color)
            .NotEmpty().WithMessage("El color es obligatorio.")
            .Matches("^#[0-9A-Fa-f]{6}$").WithMessage("El color debe ser un código hexadecimal, por ejemplo #2F6F62.");
    }
}
