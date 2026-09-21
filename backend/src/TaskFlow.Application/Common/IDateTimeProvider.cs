namespace TaskFlow.Application.Common;

/// <summary>Abstracción del reloj para facilitar pruebas deterministas.</summary>
public interface IDateTimeProvider
{
    DateTime UtcNow { get; }
}
