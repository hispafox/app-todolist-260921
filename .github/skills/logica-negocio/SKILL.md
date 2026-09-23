---
name: logica-negocio
description: 'Crea o actualiza las interfaces e implementaciones de los repositorios de acceso a datos. Úsalo cuando quieras generar la capa que traduce operaciones sobre entidades de dominio en consultas EF Core, separada de la orquestación de servicios.'
argument-hint: 'Recurso a generar (opcional, por defecto: todos los recursos de la sección 5 del análisis)'
---

# Skill: Crear el Repositorio de Acceso a Datos

## Nota sobre el nombre de este skill

En TaskFlow no existe una capa `LogicaNegocio/` independiente: las reglas de negocio viven en los **métodos de comportamiento de la entidad de dominio** (`TaskFlow.Domain/Entities/*.cs`, ver skill `modelo`: `Complete`, `Reopen`, `Update`, `AssignUser`…). Lo que este skill genera es el **repositorio** — la única capa que accede a `TaskFlowDbContext` — en `TaskFlow.Infrastructure/Repositories/`, con su contrato `I<Recurso>Repository` definido en `TaskFlow.Application/<Recurso>/`.

## Cuándo usar este skill

- El usuario pide "crear el repositorio", "generar el acceso a datos", "crear la capa de persistencia de un recurso"
- Se ha añadido un nuevo recurso al análisis y hay que crear su repositorio
- Se quiere añadir una consulta o filtro nuevo sobre un recurso existente

## Prerequisitos

Antes de usar este skill, deben existir:
1. `docs/analisis-diseño.md` con la sección 4 y 5 completas. Si no existe, ejecutar primero el skill `diseño-analisis`.
2. Las entidades de dominio en `backend/src/TaskFlow.Domain/Entities/`. Si no existen, ejecutar primero el skill `modelo`.
3. `TaskFlowDbContext` con su `DbSet<T>` y configuración Fluent API. Si no existe, ejecutar primero el skill `base-de-datos`.

## Procedimiento

### Paso 1 — Leer el contexto

Leer los siguientes ficheros antes de generar nada:

- [`docs/analisis-diseño.md`](../../docs/analisis-diseño.md) — sección 4 (modelo) y sección 5 (operaciones y filtros por endpoint)
- [`.github/copilot-instructions.md`](../copilot-instructions.md) — convenciones de código del proyecto
- Las entidades en `backend/src/TaskFlow.Domain/Entities/` — para conocer las entidades y sus relaciones
- `TaskFlow.Infrastructure/Persistence/TaskFlowDbContext.cs` — para conocer los `DbSet<T>` disponibles

Si `docs/analisis-diseño.md` no existe, detener y pedir al usuario que primero ejecute el skill `diseño-analisis`.

### Paso 2 — Localizar el proyecto y verificar qué repositorios existen

- El **contrato** `I<Recurso>Repository` vive en `backend/src/TaskFlow.Application/<Recurso>/` (junto a `I<Recurso>Service`, no en una subcarpeta `Repositories/`), siguiendo el patrón de `ITaskRepository.cs`.
- La **implementación** `<Recurso>Repository` vive en `backend/src/TaskFlow.Infrastructure/Repositories/<Recurso>Repository.cs`.

Si ya existen, leer su contenido antes de modificar para evitar sobreescribir cambios manuales.

### Paso 3 — Identificar las operaciones necesarias

Derivar los métodos del repositorio a partir de los endpoints de la sección 5. El repositorio expone solo **acceso a datos**, nunca DTOs:

| Endpoint | Método del repositorio |
|---|---|
| `GET /api/<recurso>` (con filtros) | `GetAllAsync(<Recurso>FilterRequest filter, CancellationToken ct)` |
| `GET /api/<recurso>/{id}` | `GetByIdAsync(int id, CancellationToken ct)` |
| `POST /api/<recurso>` | `AddAsync(<Entidad> entity, CancellationToken ct)` |
| `DELETE /api/<recurso>/{id}` | `Remove(<Entidad> entity)` (síncrono: solo marca el estado en el `ChangeTracker`) |
| — (siempre presente) | `SaveChangesAsync(CancellationToken ct)` |

Las operaciones de actualización, completar, reabrir o asignar **no necesitan un método propio en el repositorio**: se obtiene la entidad con `GetByIdAsync`, se invoca el método de comportamiento correspondiente en la entidad (`task.Complete(now)`, `task.Update(...)`) y se persiste con `SaveChangesAsync`. Esa orquestación vive en el servicio (skill `servicio`), no en el repositorio.

### Paso 4 — Generar la interfaz e implementación por recurso

#### Contrato en `TaskFlow.Application/<Recurso>/I<Recurso>Repository.cs`

```csharp
using TaskFlow.Domain.Entities;

namespace TaskFlow.Application.<Recurso>;

public interface I<Recurso>Repository
{
    Task<<Entidad>?> GetByIdAsync(int id, CancellationToken cancellationToken);

    Task<IReadOnlyList<<Entidad>>> GetAllAsync(Dtos.<Recurso>FilterRequest filter, CancellationToken cancellationToken);

    Task AddAsync(<Entidad> entity, CancellationToken cancellationToken);

    void Remove(<Entidad> entity);

    Task<bool> SaveChangesAsync(CancellationToken cancellationToken);
}
```

#### Implementación en `TaskFlow.Infrastructure/Repositories/<Recurso>Repository.cs`

```csharp
using Microsoft.EntityFrameworkCore;
using TaskFlow.Application.<Recurso>;
using TaskFlow.Application.<Recurso>.Dtos;
using TaskFlow.Domain.Entities;
using TaskFlow.Infrastructure.Persistence;

namespace TaskFlow.Infrastructure.Repositories;

public class <Recurso>Repository : I<Recurso>Repository
{
    private readonly TaskFlowDbContext _dbContext;

    public <Recurso>Repository(TaskFlowDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Task<<Entidad>?> GetByIdAsync(int id, CancellationToken cancellationToken) =>
        _dbContext.<DbSet>.FirstOrDefaultAsync(e => e.Id == id, cancellationToken);

    public async Task<IReadOnlyList<<Entidad>>> GetAllAsync(<Recurso>FilterRequest filter, CancellationToken cancellationToken)
    {
        var query = _dbContext.<DbSet>.AsQueryable();

        // Aplicar filtros de búsqueda, estado, prioridad, categoría… según la sección 5

        return await query.ToListAsync(cancellationToken);
    }

    public async Task AddAsync(<Entidad> entity, CancellationToken cancellationToken) =>
        await _dbContext.<DbSet>.AddAsync(entity, cancellationToken);

    public void Remove(<Entidad> entity) => _dbContext.<DbSet>.Remove(entity);

    public async Task<bool> SaveChangesAsync(CancellationToken cancellationToken) =>
        await _dbContext.SaveChangesAsync(cancellationToken) >= 0;
}
```

#### Reglas de generación

- **Namespace del contrato**: `TaskFlow.Application.<Recurso>` (mismo namespace que `I<Recurso>Service`, sin subcarpeta `Repositories`).
- **Namespace de la implementación**: `TaskFlow.Infrastructure.Repositories`.
- **Inyección de dependencias**: constructor con `TaskFlowDbContext`, almacenado en campo `readonly` privado. Nunca `new` directo.
- **`async/await`** en todos los métodos que accedan a base de datos.
- **Trabaja con entidades de dominio**: los parámetros y retornos son tipos de `TaskFlow.Domain.Entities`, nunca DTOs (salvo `<Recurso>FilterRequest`, que es un contrato de solo lectura para construir la consulta).
- **Consultas de filtrado en `GetAllAsync`**: aplicar `Where` según los campos de `<Recurso>FilterRequest` (búsqueda con `EF.Functions.Like`, estado, prioridad, categoría…) y ordenar según el criterio del análisis (ver `TaskRepository.GetAllAsync` como referencia).
- **Sin `AsNoTracking()` salvo que el análisis pida explícitamente consultas de solo lectura masivas**: como el servicio suele modificar la entidad tras `GetByIdAsync` (completar, reabrir, actualizar), el tracking por defecto es necesario para que `SaveChangesAsync` detecte los cambios.
- **Sin reglas de negocio en el repositorio**: ninguna validación de dominio, ningún cálculo. Esas reglas viven en la entidad (`modelo`) o en el servicio (`servicio`).
- **Sin lógica HTTP**: no conoce DTOs de entrada/salida distintos al filtro, ni códigos de estado.
- Si `TaskFlowDbContext` **no existe aún**, generar la interfaz completa y advertir al usuario que ejecute primero `base-de-datos`.

### Paso 5 — Registrar el repositorio en `TaskFlow.Infrastructure/DependencyInjection.cs`

Añadir el registro dentro de `AddInfrastructure`:

```csharp
services.AddScoped<I<Recurso>Repository, <Recurso>Repository>();
```

Si ya estaba registrado, no duplicar la línea. No registrar el repositorio en `Program.cs` directamente.

### Paso 6 — Confirmar

Informar al usuario con una lista de los ficheros creados o modificados con sus rutas relativas.

Si `TaskFlowDbContext` no existía, indicarlo explícitamente.

Como siguiente paso sugerir ejecutar el skill `servicio`, que inyectará `I<Recurso>Repository` y se encargará del mapeo con los DTOs.
