---
name: controlador
description: 'Crea o actualiza los grupos de Minimal APIs (endpoints) de TaskFlow a partir de los endpoints definidos en el análisis. Úsalo cuando quieras generar los endpoints del proyecto, añadir uno nuevo, o sincronizarlos con el documento de análisis y diseño.'
argument-hint: 'Recurso a generar (opcional, por defecto: todos los recursos de la sección 5 del análisis)'
---

# Skill: Crear Endpoints (Minimal APIs)

## Nota sobre el nombre de este skill

TaskFlow no usa `Controllers/` ni `[ApiController]`: expone la API con **ASP.NET Core Minimal APIs**, agrupadas por recurso en clases estáticas `<Recurso>Endpoints.cs` dentro de `backend/src/TaskFlow.Api/<Recurso>/`.

## Cuándo usar este skill

- El usuario pide "crear el endpoint", "generar los endpoints", "crear la capa de la API"
- Se quiere sincronizar los endpoints con los definidos en el análisis
- Se ha añadido un nuevo recurso al análisis y hay que crear su grupo de endpoints
- Se quiere añadir un endpoint nuevo a un recurso existente

## Prerequisitos

Antes de usar este skill, deben existir:
1. `docs/analisis-diseño.md` con la sección 5 (endpoints) completa. Si no existe, ejecutar primero el skill `diseño-analisis`.
2. Las entidades de dominio en `backend/src/TaskFlow.Domain/Entities/`. Si no existen, ejecutar primero el skill `modelo`.
3. El servicio (`I<Recurso>Service`) en `TaskFlow.Application/<Recurso>/`. Si no existe, advertir al usuario — los endpoints compilarán pero no funcionarán hasta que el servicio esté creado.

## Procedimiento

### Paso 1 — Leer el contexto

Leer los siguientes ficheros antes de generar nada:

- [`docs/analisis-diseño.md`](../../docs/analisis-diseño.md) — fuente de verdad de los endpoints (sección 5) y la arquitectura (sección 3)
- [`.github/copilot-instructions.md`](../copilot-instructions.md) — convenciones de código del proyecto
- `TaskFlow.Api/Tasks/TaskEndpoints.cs` — patrón de referencia ya implementado

Si `docs/analisis-diseño.md` no existe, detener y pedir al usuario que primero ejecute el skill `diseño-analisis`.

### Paso 2 — Localizar el proyecto y verificar qué endpoints existen

Los endpoints de un recurso viven en `backend/src/TaskFlow.Api/<Recurso>/<Recurso>Endpoints.cs` (p. ej. `Tasks/TaskEndpoints.cs`, `Users/UserEndpoints.cs`), junto con una clase `<Recurso>QueryParameters.cs` si el listado admite filtros por query string (ver `TaskQueryParameters.cs`).

Si ya existen endpoints, leer su contenido antes de modificar para evitar sobreescribir cambios manuales.

### Paso 3 — Identificar los recursos de la sección 5

En `docs/analisis-diseño.md`, sección 5, los endpoints están agrupados por recurso (p. ej. "Tareas — `/api/tasks`", "Usuarios — `/api/users`"). Cada grupo da lugar a un grupo de endpoints independiente.

Para cada grupo:
- Anotar el prefijo de ruta (p. ej. `/api/tasks`)
- Listar todos los endpoints: verbo HTTP, ruta, descripción, respuesta OK y errores posibles
- Identificar si hay endpoints de **acción** (rutas con un segmento adicional después del `{id}`, como `/{id}/complete`, `/{id}/reopen` o `/{id}/assign`)

### Paso 4 — Generar el grupo de endpoints por recurso

Crear el fichero `<Recurso>Endpoints.cs` dentro de `TaskFlow.Api/<Recurso>/`, siguiendo el patrón de `TaskEndpoints.cs`:

```csharp
using FluentValidation;
using FluentValidation.Results;
using TaskFlow.Application.<Recurso>;
using TaskFlow.Application.<Recurso>.Dtos;

namespace TaskFlow.Api.<Recurso>;

public static class <Recurso>Endpoints
{
    public static IEndpointRouteBuilder Map<Recurso>Endpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/<recurso>").WithTags("<Recurso>");

        group.MapGet("/", Get<Recurso>sAsync);
        group.MapGet("/{id:int}", Get<Recurso>ByIdAsync);
        group.MapPost("/", Create<Recurso>Async);
        group.MapPut("/{id:int}", Update<Recurso>Async);
        group.MapDelete("/{id:int}", Delete<Recurso>Async);
        // Endpoints de acción adicionales: group.MapPatch("/{id:int}/<accion>", ...);

        return app;
    }

    private static async Task<IResult> Get<Recurso>sAsync(
        [AsParameters] <Recurso>QueryParameters query,
        I<Recurso>Service service,
        CancellationToken cancellationToken)
    {
        var items = await service.Get<Recurso>sAsync(query.ToFilterRequest(), cancellationToken);
        return Results.Ok(items);
    }

    private static async Task<IResult> Get<Recurso>ByIdAsync(int id, I<Recurso>Service service, CancellationToken cancellationToken)
    {
        var item = await service.Get<Recurso>ByIdAsync(id, cancellationToken);
        return item is null ? Results.NotFound() : Results.Ok(item);
    }

    private static async Task<IResult> Create<Recurso>Async(
        Create<Recurso>Request request,
        I<Recurso>Service service,
        IValidator<Create<Recurso>Request> validator,
        CancellationToken cancellationToken)
    {
        var validation = await validator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            return Results.ValidationProblem(validation.ToDictionary());
        }

        var created = await service.Create<Recurso>Async(request, cancellationToken);
        return Results.Created($"/api/<recurso>/{created.Id}", created);
    }

    private static async Task<IResult> Update<Recurso>Async(
        int id,
        Update<Recurso>Request request,
        I<Recurso>Service service,
        IValidator<Update<Recurso>Request> validator,
        CancellationToken cancellationToken)
    {
        var validation = await validator.ValidateAsync(request, cancellationToken);
        if (!validation.IsValid)
        {
            return Results.ValidationProblem(validation.ToDictionary());
        }

        var updated = await service.Update<Recurso>Async(id, request, cancellationToken);
        return updated is null ? Results.NotFound() : Results.Ok(updated);
    }

    private static async Task<IResult> Delete<Recurso>Async(int id, I<Recurso>Service service, CancellationToken cancellationToken)
    {
        var deleted = await service.Delete<Recurso>Async(id, cancellationToken);
        return deleted ? Results.NoContent() : Results.NotFound();
    }

    private static IDictionary<string, string[]> ToDictionary(this ValidationResult result) =>
        result.Errors
            .GroupBy(e => e.PropertyName)
            .ToDictionary(g => g.Key, g => g.Select(e => e.ErrorMessage).ToArray());
}
```

#### Reglas de generación

- **Namespace**: `TaskFlow.Api.<Recurso>` (p. ej. `TaskFlow.Api.Tasks`).
- **Clase estática** con un método de extensión `Map<Recurso>Endpoints(this IEndpointRouteBuilder app)`. Nunca `[ApiController]`, `ControllerBase` ni atributos de MVC.
- **Ruta base con `MapGroup`**: `app.MapGroup("/api/<recurso>").WithTags("<Recurso>")`.
- **Inyección por parámetro** (`I<Recurso>Service service`, `IValidator<T> validator`) en cada handler — no hay constructor ni campos: el contenedor DI resuelve los parámetros en cada petición.
- **Sin lógica de negocio**: el cuerpo de cada handler solo valida (si aplica), llama al servicio y traduce el resultado a `IResult`. Ninguna regla de negocio, validación de dominio ni cálculo dentro del endpoint.
- **Validación de entrada con FluentValidation**: los endpoints `POST`/`PUT` reciben `IValidator<T>` inyectado, llaman a `ValidateAsync` y devuelven `Results.ValidationProblem(...)` si falla. No usar `System.ComponentModel.DataAnnotations` ni `ModelState`.
- **`async/await`** en todos los handlers que llamen al servicio.
- **Tipo de retorno**: `Task<IResult>` en todos los handlers.
- **Nombres de métodos**: en inglés, descriptivos del endpoint (`GetTasksAsync`, `GetTaskByIdAsync`, `CreateTaskAsync`, `UpdateTaskAsync`, `DeleteTaskAsync`, `CompleteTaskAsync`, `ReopenTaskAsync`, `AssignUserAsync`).

#### Mapeo de verbos HTTP y códigos de respuesta

Respetar exactamente los códigos de respuesta definidos en la tabla de la sección 5:

| Tipo de endpoint | Método de mapeo | Respuesta éxito | Respuesta error |
|---|---|---|---|
| Listar todos | `group.MapGet("/", ...)` | `Results.Ok(lista)` → 200 | — |
| Obtener por ID | `group.MapGet("/{id:int}", ...)` | `Results.Ok(item)` → 200 | `Results.NotFound()` → 404 |
| Crear | `group.MapPost("/", ...)` | `Results.Created($"/api/<recurso>/{id}", item)` → 201 | `Results.ValidationProblem(...)` → 400 |
| Actualizar | `group.MapPut("/{id:int}", ...)` | `Results.Ok(item)` → 200 | `Results.NotFound()` → 404, `Results.ValidationProblem(...)` → 400 |
| Eliminar | `group.MapDelete("/{id:int}", ...)` | `Results.NoContent()` → 204 | `Results.NotFound()` → 404 |
| Acción especial | `group.MapPatch("/{id:int}/<accion>", ...)` | `Results.Ok(item)` según análisis | `Results.NotFound()` según análisis |

Las acciones (`complete`, `reopen`, `assign`) usan `MapPatch`, no `MapPost` — reflejan una transición de estado parcial sobre un recurso existente, siguiendo el contrato ya implementado en `TaskEndpoints`.

#### Endpoints de acción especiales

```csharp
group.MapPatch("/{id:int}/complete", CompleteTaskAsync);

private static async Task<IResult> CompleteTaskAsync(int id, ITaskService taskService, CancellationToken cancellationToken)
{
    var task = await taskService.CompleteTaskAsync(id, cancellationToken);
    return task is null ? Results.NotFound() : Results.Ok(task);
}
```

#### Filtros de listado con `[AsParameters]`

Si el listado admite filtros (búsqueda, estado, prioridad, categoría…), crear `<Recurso>QueryParameters.cs` con las propiedades de query string y un método `ToFilterRequest()` que las traduzca al `<Recurso>FilterRequest` que espera el servicio (ver `TaskQueryParameters.cs` como referencia).

### Paso 5 — Comprobar y actualizar `Program.cs`

Abrir `backend/src/TaskFlow.Api/Program.cs` y verificar:

1. Que `builder.Services.AddApplication();` y `builder.Services.AddInfrastructure(builder.Configuration);` ya están presentes.
2. Que cada grupo de endpoints existente se registra con `app.Map<Recurso>Endpoints();`.
3. Para el recurso generado, añadir `app.Map<Recurso>Endpoints();` si no estuviera ya.

No añadir `AddControllers()` ni `MapControllers()` — no aplican a Minimal APIs.

### Paso 6 — Confirmar

Informar al usuario con una lista de los ficheros creados o modificados con sus rutas relativas.

Si el servicio referenciado no existe aún, indicarlo explícitamente señalando que los endpoints compilarán con errores hasta que se cree. Sugerir ejecutar el skill `servicio` como siguiente paso.

Si los endpoints ya existían y se han modificado, señalar qué cambios se han hecho para que el usuario pueda revisarlos.
