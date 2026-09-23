---
name: servicio
description: 'Crea o actualiza las interfaces e implementaciones de servicios de la aplicación. Úsalo cuando quieras generar la capa de servicios, añadir un nuevo método a un servicio existente, o sincronizar los servicios con el documento de análisis y diseño.'
argument-hint: 'Recurso a generar (opcional, por defecto: todos los recursos de la sección 5 del análisis)'
---

# Skill: Crear Servicios ASP.NET Core

## Responsabilidad de esta capa

El servicio es la capa de **orquestación**: recibe DTOs desde el endpoint, obtiene o crea la entidad de dominio a través del repositorio, invoca sus métodos de comportamiento (reglas de negocio), persiste el cambio y convierte el resultado de vuelta a DTOs con el mapper.

```
Endpoint → [Request DTO] → Servicio → [Entidad de dominio] → Repositorio → TaskFlowDbContext
Endpoint ← [Dto de salida] ← Servicio ← [Entidad de dominio] ← Repositorio ← TaskFlowDbContext
```

El servicio **no accede a `TaskFlowDbContext` directamente** — eso es responsabilidad exclusiva del repositorio (skill `logica-negocio`).

## Cuándo usar este skill

- El usuario pide "crear el servicio", "generar los servicios", "crear la capa de aplicación"
- Se quiere sincronizar los servicios con los endpoints definidos en el análisis
- Se ha añadido un nuevo recurso al análisis y hay que crear su servicio
- Se quiere añadir un método nuevo a un servicio existente

## Prerequisitos

Antes de usar este skill, deben existir:
1. `docs/analisis-diseño.md` con la sección 5 (endpoints) completa. Si no existe, ejecutar primero el skill `diseño-analisis`.
2. Las entidades de dominio en `backend/src/TaskFlow.Domain/Entities/`. Si no existen, ejecutar primero el skill `modelo`.
3. Los DTOs en `backend/src/TaskFlow.Application/<Recurso>/Dtos/`. Si no existen, ejecutar primero el skill `dto`.
4. El repositorio (`I<Recurso>Repository`) en `TaskFlow.Application/<Recurso>/` y su implementación en `TaskFlow.Infrastructure/Repositories/`. Si no existen, ejecutar primero el skill `logica-negocio`.

## Procedimiento

### Paso 1 — Leer el contexto

Leer los siguientes ficheros antes de generar nada:

- [`docs/analisis-diseño.md`](../../docs/analisis-diseño.md) — fuente de verdad de los endpoints (sección 5) y la arquitectura (sección 3)
- [`.github/copilot-instructions.md`](../copilot-instructions.md) — convenciones de código del proyecto
- Las entidades en `backend/src/TaskFlow.Domain/Entities/` — para conocer los métodos de comportamiento disponibles
- Los DTOs en `TaskFlow.Application/<Recurso>/Dtos/` — para conocer los contratos de entrada y salida
- `I<Recurso>Repository` en `TaskFlow.Application/<Recurso>/` — para conocer qué operaciones de datos delegar

Si `docs/analisis-diseño.md` no existe, detener y pedir al usuario que primero ejecute el skill `diseño-analisis`.

### Paso 2 — Localizar el proyecto y verificar qué servicios existen

El servicio de un recurso vive en `backend/src/TaskFlow.Application/<Recurso>/I<Recurso>Service.cs` y `<Recurso>Service.cs`, junto al mapper `<Recurso>Mapper.cs` (extensión estática `ToDto()`).

Si ya existen servicios, leer su contenido y **verificar que usan DTOs/entidades tal y como marca el contrato**:

- Los métodos de la interfaz `I<Recurso>Service` reciben `Create<Recurso>Request` / `Update<Recurso>Request` y devuelven `<Recurso>Dto` (o `<Recurso>Dto?`).
- Internamente, el servicio trabaja con la entidad de dominio (`TaskItem`, `AppUser`…) y delega en `I<Recurso>Repository`.

### Paso 3 — Identificar los métodos del servicio

Para cada recurso de la sección 5, los métodos del servicio siguen el patrón ya usado en `TaskService`:

| Endpoint | Método del servicio |
|---|---|
| `GET /api/<recurso>` | `Get<Recurso>sAsync(<Recurso>FilterRequest filter, CancellationToken ct) → IReadOnlyList<<Recurso>Dto>` |
| `GET /api/<recurso>/{id}` | `Get<Recurso>ByIdAsync(int id, CancellationToken ct) → <Recurso>Dto?` |
| `POST /api/<recurso>` | `Create<Recurso>Async(Create<Recurso>Request request, CancellationToken ct) → <Recurso>Dto` |
| `PUT /api/<recurso>/{id}` | `Update<Recurso>Async(int id, Update<Recurso>Request request, CancellationToken ct) → <Recurso>Dto?` |
| `DELETE /api/<recurso>/{id}` | `Delete<Recurso>Async(int id, CancellationToken ct) → bool` |
| `PATCH /api/<recurso>/{id}/<accion>` | `<Accion><Recurso>Async(int id, ..., CancellationToken ct) → <Recurso>Dto?` |

### Paso 4 — Generar la interfaz e implementación por recurso

#### Interfaz — `I<Recurso>Service.cs`

```csharp
namespace TaskFlow.Application.<Recurso>;

public interface I<Recurso>Service
{
    Task<IReadOnlyList<<Recurso>Dto>> Get<Recurso>sAsync(Dtos.<Recurso>FilterRequest filter, CancellationToken cancellationToken);
    Task<<Recurso>Dto?> Get<Recurso>ByIdAsync(int id, CancellationToken cancellationToken);
    Task<<Recurso>Dto> Create<Recurso>Async(Dtos.Create<Recurso>Request request, CancellationToken cancellationToken);
    Task<<Recurso>Dto?> Update<Recurso>Async(int id, Dtos.Update<Recurso>Request request, CancellationToken cancellationToken);
    Task<bool> Delete<Recurso>Async(int id, CancellationToken cancellationToken);
    // Métodos adicionales según endpoints de acción del análisis (p. ej. CompleteTaskAsync)
}
```

#### Implementación — `<Recurso>Service.cs` (patrón de `TaskService`)

```csharp
using TaskFlow.Application.Common;
using TaskFlow.Application.<Recurso>.Dtos;
using TaskFlow.Domain.Entities;

namespace TaskFlow.Application.<Recurso>;

public class <Recurso>Service : I<Recurso>Service
{
    private readonly I<Recurso>Repository _repository;
    private readonly IDateTimeProvider _dateTimeProvider;

    public <Recurso>Service(I<Recurso>Repository repository, IDateTimeProvider dateTimeProvider)
    {
        _repository = repository;
        _dateTimeProvider = dateTimeProvider;
    }

    public async Task<IReadOnlyList<<Recurso>Dto>> Get<Recurso>sAsync(<Recurso>FilterRequest filter, CancellationToken cancellationToken)
    {
        var entities = await _repository.GetAllAsync(filter, cancellationToken);
        return entities.Select(e => e.ToDto()).ToList();
    }

    public async Task<<Recurso>Dto?> Get<Recurso>ByIdAsync(int id, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetByIdAsync(id, cancellationToken);
        return entity?.ToDto();
    }

    public async Task<<Recurso>Dto> Create<Recurso>Async(Create<Recurso>Request request, CancellationToken cancellationToken)
    {
        var now = _dateTimeProvider.UtcNow;
        var entity = new <Entidad>(/* campos del request + now */);

        await _repository.AddAsync(entity, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);

        return entity.ToDto();
    }

    public async Task<<Recurso>Dto?> Update<Recurso>Async(int id, Update<Recurso>Request request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetByIdAsync(id, cancellationToken);
        if (entity is null)
        {
            return null;
        }

        entity.Update(/* campos del request + _dateTimeProvider.UtcNow */);
        await _repository.SaveChangesAsync(cancellationToken);

        return entity.ToDto();
    }

    public async Task<bool> Delete<Recurso>Async(int id, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetByIdAsync(id, cancellationToken);
        if (entity is null)
        {
            return false;
        }

        _repository.Remove(entity);
        await _repository.SaveChangesAsync(cancellationToken);
        return true;
    }
}
```

#### El mapper — `<Recurso>Mapper.cs`

El mapeo entidad → DTO vive en una clase estática con métodos de extensión, no dentro del servicio:

```csharp
namespace TaskFlow.Application.<Recurso>;

public static class <Recurso>Mapper
{
    public static <Recurso>Dto ToDto(this <Entidad> entity) => new(
        entity.Id,
        entity.<Campo>,
        // resto de campos
    );
}
```

#### Reglas de generación

- **Namespace**: `TaskFlow.Application.<Recurso>` (mismo namespace que el repositorio y el mapper).
- **Inyección de dependencias**: constructor con `I<Recurso>Repository` y, si aplica, `IDateTimeProvider` u otro repositorio relacionado (p. ej. `TaskService` también inyecta `IUserRepository` para validar `AssignedUserId`). Nunca `new` directo.
- **`async/await`** en todos los métodos que deleguen en el repositorio.
- **La firma pública usa DTOs**: parámetros de entrada son `Create<Recurso>Request` / `Update<Recurso>Request`, retornos son `<Recurso>Dto` (o `<Recurso>Dto?`).
- **El mapeo entidad → DTO se hace con el mapper** (`entity.ToDto()`), nunca con un método privado duplicado.
- **Las reglas de negocio se invocan a través de la entidad**: `entity.Complete(now)`, `entity.Update(...)` — el servicio no reimplementa la regla, solo la invoca y persiste.
- **Validación de referencias externas**: si el DTO de entrada trae una FK opcional a otro recurso (p. ej. `AssignedUserId`), verificar su existencia con el repositorio correspondiente antes de crear/actualizar, lanzando `TaskFlow.Application.Common.NotFoundException` si no existe (ver `EnsureAssignedUserExistsAsync` en `TaskService`).
- **Sin lógica HTTP**: el servicio no conoce `IResult`, códigos de estado ni nada de Minimal APIs — eso es responsabilidad del endpoint (skill `controlador`).
- **Sin acceso a `TaskFlowDbContext`**: toda operación de datos se delega a `I<Recurso>Repository`.
- Si los DTOs **no existen aún**, generar la implementación con comentarios `// TODO: mapear <Recurso>Dto` y advertir al usuario.
- Si el repositorio **no existe aún**, generar la interfaz del servicio y advertir al usuario.

### Paso 5 — Registrar el servicio en `TaskFlow.Application/DependencyInjection.cs`

El registro del servicio **no va en `Program.cs`** ni en el `DependencyInjection.cs` de Infrastructure: vive en la extensión `AddApplication`:

```csharp
public static IServiceCollection AddApplication(this IServiceCollection services)
{
    services.AddScoped<I<Recurso>Service, <Recurso>Service>();
    services.AddValidatorsFromAssemblyContaining(typeof(DependencyInjection));
    return services;
}
```

Si ya estaba registrado, no duplicar la línea. `Program.cs` solo llama a `builder.Services.AddApplication();`.

> **Checklist de verificación antes de terminar:**
> - [ ] `I<Recurso>Repository` tiene su `AddScoped` en `TaskFlow.Infrastructure/DependencyInjection.cs`
> - [ ] `I<Recurso>Service` tiene su `AddScoped` en `TaskFlow.Application/DependencyInjection.cs`
> - [ ] El mapper `<Recurso>Mapper.cs` existe y expone `ToDto()`

### Paso 6 — Confirmar

Informar al usuario con una lista de los ficheros creados o modificados con sus rutas relativas.

Si algún prerequisito faltaba (DTOs, repositorio), indicarlo explícitamente.

Si los endpoints aún no existen, sugerir ejecutar el skill `controlador` como siguiente paso.
Si los endpoints ya existían pero referencian este servicio, indicar que ya deberían compilar correctamente.
