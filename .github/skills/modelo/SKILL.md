---
name: modelo
description: 'Crea o actualiza los modelos de dominio de la aplicación y los elementos relacionados (DTOs, ViewModels, DbContext, migraciones). Úsalo cuando quieras generar o regenerar las entidades del proyecto, actualizar campos del modelo, o sincronizar el código con el documento de análisis y diseño.'
argument-hint: 'Modelo a crear o actualizar (opcional, por defecto: todos los modelos del análisis)'
---

# Skill: Crear y Actualizar el Modelo de la Aplicación

## Cuándo usar este skill

- El usuario pide "crear el modelo", "generar las entidades", "actualizar el modelo"
- Se quiere sincronizar las clases de dominio con el documento de análisis
- Se ha modificado el análisis y hay que reflejar los cambios en el código
- Se quiere añadir o eliminar campos de una entidad existente
- Se ha cambiado un campo y hay que propagar el cambio a DTOs, ViewModels, DbContext o migraciones

## Procedimiento

### Paso 1 — Leer el contexto

Leer los siguientes ficheros antes de generar nada:

- [`docs/analisis-diseño.md`](../../docs/analisis-diseño.md) — fuente de verdad del modelo de datos (sección 4)
- [`.github/copilot-instructions.md`](../copilot-instructions.md) — convenciones de código del proyecto

Si `docs/analisis-diseño.md` no existe, detener y pedir al usuario que primero ejecute el skill `diseño-analisis`.

### Paso 2 — Localizar el proyecto y verificar si ya existen los modelos

Las entidades viven siempre en `backend/src/TaskFlow.Domain/Entities/`, y los enums en `backend/src/TaskFlow.Domain/Enums/`. No crear una carpeta `Models/` ni ubicar entidades fuera de `TaskFlow.Domain`.

Comprobar qué ficheros contiene ya `TaskFlow.Domain/Entities/` (p. ej. `TaskItem.cs`, `AppUser.cs`).  
Si ya existen entidades, leer su contenido antes de modificar para evitar sobreescribir cambios manuales.

### Paso 3 — Crear o actualizar las entidades

Generar o actualizar **cada entidad** definida en la sección 4 del análisis dentro de `TaskFlow.Domain/Entities/`.

#### Reglas de generación

- **Namespace**: `TaskFlow.Domain.Entities` (enums en `TaskFlow.Domain.Enums`).
- **Idioma**: nombres de clases, propiedades y métodos siempre en **inglés** (p. ej. `TaskItem`, `Title`, `IsCompleted`, `AssignUser`, `Complete`) — es el contrato que consume la API y el frontend. Los comentarios del código pueden ir en castellano.
- **Encapsulación con comportamiento**: propiedades con `private set` (o `internal set` para `Id`, ver `TaskItem.Id`), sin setters públicos. El estado solo cambia a través de métodos de la propia entidad.
- **Constructor privado sin parámetros** para EF Core (`private TaskItem() { }`), y un **constructor público** que recibe los campos obligatorios y aplica las reglas de validación (p. ej. `SetTitle` lanza `ArgumentException` si el título está vacío).
- **Métodos de comportamiento** en vez de setters sueltos: `Update(...)`, `Complete(DateTime now)`, `Reopen(DateTime now)`, `AssignUser(int? userId, DateTime now)`. Cada método actualiza también `UpdatedAt` cuando corresponda.
- **Sin anotaciones de datos** (`[Required]`, `[MaxLength]`…): las restricciones de columna se configuran en `TaskFlow.Infrastructure/Persistence/Configurations/` con Fluent API (skill `base-de-datos`); las reglas de entrada de la API se validan con FluentValidation (skill `validaciones`).
- **Relaciones**: claves foráneas opcionales como `int?` (p. ej. `AssignedUserId`); no añadir propiedades de navegación salvo que el análisis las requiera explícitamente.
- **Enums** en fichero propio dentro de `TaskFlow.Domain/Enums/` (p. ej. `TaskPriority`, `TaskStatusFilter`), con valores numéricos explícitos si el análisis los define (`Low = 1, Medium = 2, High = 3`).

#### Entidades a generar

Extraer la lista completa de entidades y sus campos de la **sección 4 del análisis** (`docs/analisis-diseño.md`). Esa sección es la única fuente de verdad — no inferir ni añadir campos que no estén definidos ahí.

Respetar el orden de generación según dependencias: los enums primero, luego las entidades sin FK, por último las entidades que referencian a otras.

### Paso 4 — Propagar cambios a elementos relacionados (solo si ya existen)

Comprobar qué elementos relacionados existen en el proyecto. **Si ninguno existe, omitir este paso por completo** y pasar directamente al Paso 5.

Solo actuar sobre los elementos que ya estén presentes en el código. No crear DTOs, mappers ni configuración de `TaskFlowDbContext` si no existían antes — eso lo hacen los skills `dto` y `base-de-datos`.

#### DTOs (`backend/src/TaskFlow.Application/<Recurso>/Dtos/`)

Si existen DTOs:
- Añadir o eliminar las propiedades que correspondan al cambio del modelo.
- No incluir propiedades de navegación ni claves foráneas internas salvo que el contrato de la API las necesite (p. ej. `assignedUserId` sí se expone porque el cliente lo usa).

#### DbContext (`backend/src/TaskFlow.Infrastructure/Persistence/TaskFlowDbContext.cs`)

Si el fichero existe:
- Añadir el `DbSet<T>` de la nueva entidad si no estuviera.
- Crear o actualizar su `IEntityTypeConfiguration<T>` en `Persistence/Configurations/` para reflejar los cambios (skill `base-de-datos`).

#### Migraciones

Si existe la carpeta `Persistence/Migrations/` (EF Core ya está configurado):
- **No crear la migración ni aplicarla automáticamente.** Indicar al usuario el comando exacto a ejecutar:
  ```
  dotnet ef migrations add <NombreDescriptivo> --project src/TaskFlow.Infrastructure --startup-project src/TaskFlow.Api --output-dir Persistence/Migrations
  ```
  La aplicación de la migración (`dotnet ef database update`) solo se ejecuta con autorización explícita del usuario.

### Paso 5 — Confirmar

Informar al usuario con una lista de los ficheros creados o modificados con sus rutas relativas.  
Si algún campo del análisis y el código existente difieren, señalarlo explícitamente para que el usuario decida.  
Si hay migraciones pendientes, recordarlo al final con el comando listo para copiar.
