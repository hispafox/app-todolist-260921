---
name: base-de-datos
description: 'Crea o actualiza el contexto de base de datos (AppDbContext), configura EF Core con SQLite, aplica la configuración Fluent API de las entidades, registra el contexto en Program.cs y genera los comandos de migración. Úsalo cuando quieras conectar la aplicación a la base de datos, crear las migraciones iniciales, o añadir datos de ejemplo.'
argument-hint: 'Acción a realizar (opcional, por defecto: crear AppDbContext completo con todas las entidades del análisis)'
---

# Skill: Conectar con Base de Datos

## Cuándo usar este skill

- El usuario pide "crear el DbContext", "conectar con la base de datos", "configurar EF Core"
- Se quieren crear las migraciones iniciales
- Se quiere añadir datos de ejemplo (seeder)
- Se ha añadido una entidad nueva al modelo y hay que actualizar el DbContext

## Prerequisitos

Antes de usar este skill, deben existir:
1. `docs/analisis-diseño.md` con la sección 4 (modelo de datos) completa. Si no existe, ejecutar primero el skill `diseño-analisis`.
2. Las entidades de dominio en `backend/src/TaskFlow.Domain/Entities/`. Si no existen, ejecutar primero el skill `modelo`.

## Procedimiento

### Paso 1 — Leer el contexto

Leer los siguientes ficheros antes de generar nada:

- [`docs/analisis-diseño.md`](../../docs/analisis-diseño.md) — sección 4 (entidades, campos, relaciones, restricciones)
- [`.github/copilot-instructions.md`](../copilot-instructions.md) — convenciones de código del proyecto
- Las entidades en `backend/src/TaskFlow.Domain/Entities/` — para conocer los tipos exactos de cada propiedad

Si `docs/analisis-diseño.md` no existe, detener y pedir al usuario que primero ejecute el skill `diseño-analisis`.

### Paso 2 — Localizar el contexto y verificar qué existe ya

`TaskFlowDbContext` vive en `backend/src/TaskFlow.Infrastructure/Persistence/TaskFlowDbContext.cs`. Cada entidad tiene su propia clase de configuración Fluent API en `backend/src/TaskFlow.Infrastructure/Persistence/Configurations/<Entidad>Configuration.cs` (p. ej. `TaskItemConfiguration.cs`, `AppUserConfiguration.cs`).

Si ya existen, leer su contenido antes de modificar para evitar sobreescribir cambios manuales.

### Paso 3 — Añadir el `DbSet<T>` en `TaskFlowDbContext`

Si la entidad es nueva, añadir su `DbSet<T>` en `TaskFlowDbContext.cs`:

```csharp
namespace TaskFlow.Infrastructure.Persistence;

public class TaskFlowDbContext : DbContext
{
    public TaskFlowDbContext(DbContextOptions<TaskFlowDbContext> options) : base(options) { }

    public DbSet<TaskItem> Tasks => Set<TaskItem>();
    public DbSet<AppUser> Users => Set<AppUser>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(TaskFlowDbContext).Assembly);
    }
}
```

`OnModelCreating` no configura las entidades inline: aplica automáticamente todas las clases `IEntityTypeConfiguration<T>` del ensamblado. No cambiar ese patrón.

### Paso 4 — Crear o actualizar la configuración Fluent API de la entidad

Crear (o actualizar) `Persistence/Configurations/<Entidad>Configuration.cs` implementando `IEntityTypeConfiguration<T>`, siguiendo el patrón de `TaskItemConfiguration.cs`:

```csharp
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TaskFlow.Domain.Entities;

namespace TaskFlow.Infrastructure.Persistence.Configurations;

public class <Entidad>Configuration : IEntityTypeConfiguration<<Entidad>>
{
    public void Configure(EntityTypeBuilder<<Entidad>> builder)
    {
        builder.ToTable("<TablaEnPlural>");
        builder.HasKey(e => e.Id);

        builder.Property(e => e.<Campo>)
            .IsRequired()
            .HasMaxLength(120);

        // Relaciones e índices
        builder.HasOne<OtraEntidad>()
            .WithMany()
            .HasForeignKey(e => e.<Campo>Id)
            .OnDelete(DeleteBehavior.SetNull); // o Cascade/Restrict según el análisis

        builder.HasIndex(e => e.<CampoFiltrado>);
    }
}
```

#### Reglas de generación

- **Un fichero de configuración por entidad**, nunca configuración inline en `OnModelCreating`.
- **Restricciones según el análisis**: `IsRequired()`, `HasMaxLength(n)`, valores por defecto con `HasDefaultValueSql(...)` si aplica.
- **Relaciones**: `HasOne`/`HasMany` con `OnDelete` explícito. Para FKs opcionales que no deben arrastrar el borrado del recurso relacionado, usar `DeleteBehavior.SetNull` (patrón ya usado en `AssignedUserId` de `TaskItem`).
- **Índices**: añadir `HasIndex` sobre columnas usadas habitualmente para filtrar u ordenar (estado, prioridad, categoría, FKs).
- **Sin lógica de negocio** en la configuración: solo mapeo estructural.

### Paso 5 — Registrar el contexto en `TaskFlow.Infrastructure/DependencyInjection.cs`

El registro de EF Core **no va en `Program.cs`** directamente: vive en la extensión `AddInfrastructure`:

```csharp
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("TaskFlow")
            ?? "Data Source=taskflow.db";

        services.AddDbContext<TaskFlowDbContext>(options => options.UseSqlite(connectionString));

        // Repositorios (ver skill logica-negocio)
        return services;
    }
}
```

Si el registro ya existe, no duplicarlo. `Program.cs` solo llama a `builder.Services.AddInfrastructure(builder.Configuration);` — no debe contener `AddDbContext` directamente.

### Paso 6 — Configurar la cadena de conexión

Abrir `backend/src/TaskFlow.Api/appsettings.json` y asegurarse de que existe la sección `ConnectionStrings` con la clave `TaskFlow`:

```json
{
  "ConnectionStrings": {
    "TaskFlow": "Data Source=taskflow.db"
  }
}
```

Si ya existe con un valor distinto, no sobreescribir — indicárselo al usuario.

### Paso 7 — Datos de ejemplo (`DbInitializer`)

Los datos de ejemplo se gestionan en `backend/src/TaskFlow.Infrastructure/Persistence/DbInitializer.cs`, que aplica migraciones pendientes y siembra un ejemplo si la base de datos está vacía. Si el usuario pide datos de ejemplo para una entidad nueva, añadir el seed ahí siguiendo el mismo patrón (comprobar `Any()` antes de insertar para no duplicar).

### Paso 8 — Generar la migración (sin aplicarla)

**No ejecutar `dotnet ef database update` automáticamente.** Generar la migración es aceptable si el usuario lo pide explícitamente; aplicarla contra la base de datos requiere su autorización expresa (puede haber datos reales en `taskflow.db`).

Determinar el nombre de la migración:
- Si es la primera migración del proyecto: usar `InicioTaskFlow` o similar.
- Si ya existen migraciones: usar un nombre descriptivo del cambio en PascalCase (p. ej. `AgregarCategoriaATarea`).

Comando exacto (namespace `TaskFlow.Infrastructure`, proyecto de arranque `TaskFlow.Api`):

```bash
dotnet ef migrations add <NombreMigracion> --project src/TaskFlow.Infrastructure --startup-project src/TaskFlow.Api --output-dir Persistence/Migrations
```

Si EF Core Tools no está instalado, indicar el comando `dotnet tool install --global dotnet-ef` sin ejecutarlo por cuenta propia salvo autorización.

Tras generar la migración, informar al usuario del fichero creado en `Persistence/Migrations/` y del comando pendiente (`dotnet ef database update ...`) para que decida cuándo aplicarlo.

### Paso 9 — Confirmar

Informar al usuario con una lista de los ficheros creados o modificados con sus rutas relativas.

Recordar el comando de migración pendiente al final, si lo hubiera.

Como siguiente paso sugerir ejecutar el skill `logica-negocio`, que implementará el repositorio (`I<Recurso>Repository`) inyectando `TaskFlowDbContext`.
