---
name: validaciones
description: 'Añade validaciones de entrada y reglas de negocio a la capa de lógica y a los DTOs. Úsalo cuando quieras asegurarte de que los datos recibidos son correctos antes de persistirlos, comprobar la existencia de recursos por identificador, o añadir restricciones de dominio.'
argument-hint: 'Recurso a validar (opcional, por defecto: todos los recursos con endpoints de escritura en el análisis)'
---

# Skill: Añadir Validaciones

## Cuándo usar este skill

- El usuario pide "añadir validaciones", "validar los datos de entrada", "comprobar que los datos son correctos"
- Se quiere asegurar que los campos obligatorios no lleguen vacíos
- Se quiere comprobar la existencia de un recurso por id antes de operar con él
- Se quieren añadir restricciones de dominio (p. ej. no completar una tarea ya completada)

## Prerequisitos

Antes de usar este skill, deben existir:
1. Los DTOs en `backend/src/TaskFlow.Application/<Recurso>/Dtos/`. Si no existen, ejecutar primero el skill `dto`.
2. El repositorio (`I<Recurso>Repository`) y el servicio (`I<Recurso>Service`). Si no existen, ejecutar primero los skills `logica-negocio` y `servicio`.

## Procedimiento

### Paso 1 — Leer el contexto

Leer los siguientes ficheros antes de generar nada:

- [`docs/analisis-diseño.md`](../../docs/analisis-diseño.md) — sección 4 (restricciones de campos) y sección 5 (reglas de negocio por endpoint)
- [`.github/copilot-instructions.md`](../copilot-instructions.md) — convenciones de código del proyecto
- Los DTOs en `TaskFlow.Application/<Recurso>/Dtos/` — para saber qué campos validar
- Las entidades en `TaskFlow.Domain/Entities/` — para saber qué invariantes ya protege la propia entidad
- Los validadores existentes en `TaskFlow.Application/<Recurso>/Validators/` — para seguir el mismo estilo

### Paso 2 — Añadir reglas de FluentValidation a los DTOs de entrada

TaskFlow usa **FluentValidation**, no `System.ComponentModel.DataAnnotations`. Crear o actualizar `Create<Recurso>RequestValidator.cs` y `Update<Recurso>RequestValidator.cs` en `TaskFlow.Application/<Recurso>/Validators/`, siguiendo el patrón de `CreateTaskRequestValidator.cs`:

```csharp
using FluentValidation;
using TaskFlow.Application.<Recurso>.Dtos;

namespace TaskFlow.Application.<Recurso>.Validators;

public class Create<Recurso>RequestValidator : AbstractValidator<Create<Recurso>Request>
{
    public Create<Recurso>RequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("El título es obligatorio.")
            .MaximumLength(120).WithMessage("El título no puede superar los 120 caracteres.");

        RuleFor(x => x.Priority)
            .InclusiveBetween(1, 3).WithMessage("La prioridad debe ser baja (1), media (2) o alta (3).");
    }
}
```

#### Reglas habituales con FluentValidation

| Restricción | Regla |
|---|---|
| Campo obligatorio | `.NotEmpty()` |
| Longitud máxima | `.MaximumLength(n)` |
| Longitud mínima | `.MinimumLength(n)` |
| Rango numérico / enum | `.InclusiveBetween(min, max)` |
| Formato de email | `.EmailAddress()` |
| Solo si el campo no es null | `.MaximumLength(n)` sobre la propiedad nullable, sin `.NotEmpty()` |

**Mensajes en castellano**, igual que los ya existentes (`"El título es obligatorio."`).

Los validadores se registran automáticamente vía `services.AddValidatorsFromAssemblyContaining(typeof(DependencyInjection))` en `TaskFlow.Application/DependencyInjection.cs` — no hace falta registrarlos a mano si ya siguen la convención de nombre `*RequestValidator`.

Los endpoints ya invocan el validador correspondiente antes de llamar al servicio (`await validator.ValidateAsync(request, cancellationToken)`, ver skill `controlador`) y devuelven `Results.ValidationProblem(...)` → `400` si falla. No hace falta código adicional en el endpoint salvo que el validador sea nuevo.

### Paso 3 — Verificar los invariantes de la entidad de dominio

En TaskFlow, las reglas de dominio (existencia previa a operar, transición de estado válida, campos obligatorios) viven en la propia entidad (`TaskFlow.Domain/Entities/*.cs`, skill `modelo`), no en un repositorio o lógica separada:

```csharp
private void SetTitle(string title)
{
    if (string.IsNullOrWhiteSpace(title))
    {
        throw new ArgumentException("El título es obligatorio.", nameof(title));
    }

    Title = title.Trim();
}
```

Verificar que **todo método de comportamiento** (`Update`, `Complete`, `Reopen`, `AssignUser`…) que reciba datos externos valide sus invariantes con guard clauses similares. Si falta alguna, añadirla en la entidad, no en el servicio ni en el repositorio.

La comprobación de "¿existe el recurso con este id?" se resuelve en el **servicio**, no en el repositorio: `GetByIdAsync` devuelve `null` y el servicio corta la operación devolviendo `null` (el endpoint lo traduce a `404`).

#### Validación de claves foráneas (FKs) en recursos relacionados

Cuando un DTO trae una FK opcional a otro recurso (por ejemplo, `AssignedUserId` en `CreateTaskRequest`/`UpdateTaskRequest`), **el servicio debe validar su existencia antes de crear/actualizar**, no la entidad ni el repositorio.

**Patrón ya usado en `TaskService`** (método `EnsureAssignedUserExistsAsync`):

```csharp
// En <Recurso>Service, antes de construir o actualizar la entidad
private async Task EnsureAssignedUserExistsAsync(int? userId, CancellationToken cancellationToken)
{
    if (userId is null)
    {
        return;
    }

    var user = await _userRepository.GetByIdAsync(userId.Value, cancellationToken);
    if (user is null)
    {
        throw new NotFoundException($"No existe un usuario con Id {userId}.");
    }
}
```

**Pasos obligatorios:**
1. Identificar todas las entidades que referencian al nuevo recurso mediante FK (revisar `TaskFlow.Domain/Entities/` y las configuraciones en `TaskFlow.Infrastructure/Persistence/Configurations/`).
2. Inyectar el repositorio del recurso referenciado (`I<RecursoReferenciado>Repository`) en el servicio que crea/actualiza la entidad con la FK.
3. Llamar al método de comprobación en `Create<Recurso>Async` y `Update<Recurso>Async` (y en cualquier acción que modifique la FK, como `AssignUserAsync`) antes de persistir.
4. Lanzar `TaskFlow.Application.Common.NotFoundException` si el recurso referenciado no existe.

**Regla general:** por cada FK nullable añadida a una entidad, el servicio que crea/actualiza esa entidad debe validar la existencia del recurso referenciado. Esto evita errores de violación de FK en SQLite que se manifiestan como `500 Internal Server Error` en lugar de un código 4xx.

### Paso 4 — Añadir reglas de negocio específicas del análisis

Revisar la sección 5 del análisis en busca de reglas de negocio adicionales. Ejemplos habituales, siempre como método de comportamiento en la entidad:

#### Validar transición de estado

```csharp
// En TaskItem (TaskFlow.Domain/Entities/TaskItem.cs)
public void Complete(DateTime now)
{
    if (IsCompleted)
    {
        throw new InvalidOperationException("La tarea ya está completada.");
    }

    IsCompleted = true;
    UpdatedAt = now;
}
```

#### Evitar duplicados (consulta desde el repositorio, decisión en el servicio)

```csharp
// En I<Recurso>Repository / <Recurso>Repository
Task<bool> ExistsByTitleAsync(string title, CancellationToken cancellationToken);

// En <Recurso>Service.Create<Recurso>Async, antes de persistir
if (await _repository.ExistsByTitleAsync(request.Title, cancellationToken))
{
    throw new ConflictException("Ya existe un recurso con ese título.");
}
```

### Paso 5 — Mapear excepciones de dominio a códigos HTTP

TaskFlow centraliza el manejo de excepciones con `app.UseExceptionHandler(...)` en `Program.cs`, que traduce las excepciones de `TaskFlow.Application.Common` a códigos HTTP:

| Excepción | Código HTTP |
|---|---|
| `NotFoundException` | 404 |
| `ConflictException` | 409 |
| `ArgumentException` / `InvalidOperationException` (reglas de dominio) | 400 |

No añadir `try/catch` en el servicio ni en el endpoint para estos casos — lanzar la excepción y dejar que el middleware la traduzca. Si se necesita un código HTTP nuevo, añadir el `case` correspondiente en el manejador de `Program.cs`, no un `try/catch` local.

### Paso 6 — Confirmar

Informar al usuario con una lista de los ficheros modificados con sus rutas relativas y un resumen de las validaciones añadidas:
- Validadores de FluentValidation actualizados
- Invariantes reforzados en la entidad de dominio
- Comprobaciones de FK añadidas en el servicio
- Reglas de negocio específicas añadidas

Como siguiente paso sugerir ejecutar el skill `servicio` si aún no se ha hecho, o `commit-message` si el trabajo está completo.
