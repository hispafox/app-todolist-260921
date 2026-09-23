---
name: dto
description: 'Crea o actualiza los DTOs (Data Transfer Objects) de entrada y salida de la API. Úsalo cuando quieras generar los contratos de datos entre la API y los clientes, separar el modelo de dominio de lo que se expone en los endpoints, o sincronizar los DTOs con el documento de análisis y diseño.'
argument-hint: 'Recurso a generar (opcional, por defecto: todos los recursos de la sección 5 del análisis)'
---

# Skill: Crear DTOs (Data Transfer Objects)

## Cuándo usar este skill

- El usuario pide "crear los DTOs", "generar los contratos de datos", "crear la capa de DTOs"
- Se quiere separar el modelo de dominio de lo que se expone en la API
- Se ha modificado el análisis y hay que reflejar los cambios en los DTOs
- Se quiere añadir o eliminar campos de un DTO existente

## Prerequisitos

Antes de usar este skill, deben existir:
1. `docs/analisis-diseño.md` con la sección 4 (modelo) y sección 5 (endpoints) completas. Si no existe, ejecutar primero el skill `diseño-analisis`.
2. Las entidades de dominio en `backend/src/TaskFlow.Domain/Entities/`. Si no existen, ejecutar primero el skill `modelo`.

## Procedimiento

### Paso 1 — Leer el contexto

Leer los siguientes ficheros antes de generar nada:

- [`docs/analisis-diseño.md`](../../docs/analisis-diseño.md) — sección 4 (campos del modelo) y sección 5 (campos que entran/salen por cada endpoint)
- [`.github/copilot-instructions.md`](../copilot-instructions.md) — convenciones de código del proyecto
- Las entidades en `backend/src/TaskFlow.Domain/Entities/` — para conocer los tipos de datos y no repetir campos innecesarios

Si `docs/analisis-diseño.md` no existe, detener y pedir al usuario que primero ejecute el skill `diseño-analisis`.

### Paso 2 — Localizar el proyecto y verificar qué DTOs existen

Los contratos de un recurso viven en `backend/src/TaskFlow.Application/<Recurso>/Dtos/` (p. ej. `TaskFlow.Application/Tasks/Dtos/`, `TaskFlow.Application/Users/Dtos/`).

Comprobar qué ficheros contiene ya esa carpeta.
Si ya existen DTOs, leer su contenido antes de modificar para evitar sobreescribir cambios manuales.

### Paso 3 — Identificar los DTOs necesarios por recurso

Para cada recurso de la sección 5, generar los siguientes tipos de contrato:

| Contrato | Nombre | Cuándo se usa |
|---|---|---|
| Creación (entrada) | `Create<Recurso>Request` | Cuerpo del `POST /api/<recurso>` |
| Actualización (entrada) | `Update<Recurso>Request` | Cuerpo del `PUT /api/<recurso>/{id}` |
| Respuesta (salida) | `<Recurso>Dto` | Cuerpo de las respuestas `200` y `201` |
| Filtro de listado (entrada, opcional) | `<Recurso>FilterRequest` | Parámetros de consulta de `GET /api/<recurso>` (búsqueda, estado, prioridad, categoría…) |

Si el recurso no tiene endpoint de creación (solo lectura), omitir `Create<Recurso>Request`.
Si el recurso no tiene endpoint de actualización, omitir `Update<Recurso>Request`.
Si el listado no admite filtros, omitir `<Recurso>FilterRequest`.

### Paso 4 — Generar los DTOs

Crear los ficheros dentro de `TaskFlow.Application/<Recurso>/Dtos/`. Un fichero por contrato (p. ej. `CreateTaskRequest.cs`, `UpdateTaskRequest.cs`, `TaskDto.cs`, `TaskFilterRequest.cs`), siguiendo el patrón ya usado en `Tasks/Dtos/` y `Users/Dtos/`.

#### Reglas de generación

- **Namespace**: `TaskFlow.Application.<Recurso>.Dtos` (p. ej. `TaskFlow.Application.Tasks.Dtos`).
- **`record` o `class` con solo propiedades públicas**: sin métodos, sin lógica. Seguir el estilo ya presente en el recurso (revisar un DTO existente antes de decidir).
- **Nombres en inglés**, igual que las propiedades de la entidad (`Title`, `Priority`, `DueDate`, `AssignedUserId`…) — es el contrato real que consume la API y el frontend.
- **Sin referencias a entidades de dominio**: los DTOs no incluyen propiedades de tipo `TaskItem`, `AppUser` u otras entidades; solo tipos primitivos, enums o sus valores numéricos/string.
- **Sin claves primarias en contratos de entrada**: `Id` no se incluye en `Create<Recurso>Request` ni en `Update<Recurso>Request` — el `id` viene por ruta.
- **Campos calculados o de auditoría** (`CreatedAt`, `UpdatedAt`): no se incluyen en los contratos de entrada; sí en `<Recurso>Dto` si son relevantes para el cliente.
- **Sin anotaciones de validación en los DTOs**: este proyecto usa **FluentValidation**, no `System.ComponentModel.DataAnnotations`. Las reglas de validación se añaden aparte con el skill `validaciones`, en `TaskFlow.Application/<Recurso>/Validators/`.

#### Patrón de ejemplo (basado en `Tasks/Dtos/`)

```csharp
namespace TaskFlow.Application.Tasks.Dtos;

// Contrato de entrada para crear
public record CreateTaskRequest(
    string Title,
    string? Description,
    int Priority,
    string? Category,
    DateTime? DueDate,
    int? AssignedUserId);

// Contrato de entrada para actualizar (mismos campos que Create<Recurso>Request salvo que el análisis indique lo contrario)
public record UpdateTaskRequest(
    string Title,
    string? Description,
    int Priority,
    string? Category,
    DateTime? DueDate,
    int? AssignedUserId);

// Contrato de salida (respuesta)
public record TaskDto(
    int Id,
    string Title,
    string? Description,
    int Priority,
    string? Category,
    bool IsCompleted,
    DateTime? DueDate,
    int? AssignedUserId,
    DateTime CreatedAt,
    DateTime UpdatedAt);
```

### Paso 5 — Confirmar

Informar al usuario con una lista de los ficheros creados o modificados con sus rutas relativas.

Como siguiente paso sugerir ejecutar el skill `validaciones` para añadir las reglas de FluentValidation, y luego `servicio`, que necesita los DTOs para el mapeo entre entidades y contratos de API (`TaskMapper`).
