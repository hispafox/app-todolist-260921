# Plan: Plantillas de tareas

> Generado por el agente planificador · 2026-09-23

## 1. Resumen

Se añade una entidad `TaskTemplate` con CRUD propio para guardar combinaciones reutilizables de `Title`, `Description`, `Priority` y `Category`, y una operación para crear una tarea nueva a partir de una plantilla, completando en el momento de la creación los campos propios de la tarea (`DueDate`, `AssignedUserId`).

## 2. Requisitos funcionales

1. El usuario puede crear una plantilla de tarea indicando `Title` (obligatorio), `Description`, `Priority` y `Category`.
2. El usuario puede listar todas las plantillas existentes.
3. El usuario puede editar una plantilla existente.
4. El usuario puede eliminar una plantilla existente.
5. El usuario puede crear una tarea nueva a partir de una plantilla existente; la tarea resultante hereda `Title`, `Description`, `Priority` y `Category` de la plantilla, y el usuario puede indicar además `DueDate` y `AssignedUserId` en el momento de la creación.
6. Si la plantilla indicada no existe, la operación de creación de tarea desde plantilla responde `404 Not Found`.
7. Si se indica un `AssignedUserId` que no existe al crear la tarea desde plantilla, la API responde `404 Not Found` (mismo comportamiento que en `POST /api/tasks`).

## 3. Cambios en el modelo de datos

### Entidades nuevas o modificadas

| Entidad | Campo | Tipo | Restricciones | Descripción |
|---------|-------|------|---------------|-------------|
| `TaskTemplate` (nueva) | Id | int | PK, autogenerado | Identificador único de la plantilla |
| `TaskTemplate` | Title | string | Obligatorio, máx. 120 caracteres | Título reutilizable para las tareas creadas desde la plantilla |
| `TaskTemplate` | Description | string? | Opcional, máx. 500 caracteres | Descripción reutilizable |
| `TaskTemplate` | Priority | `TaskPriority` (enum existente) | Obligatorio, valores 1-3 | Prioridad reutilizable |
| `TaskTemplate` | Category | string? | Opcional, máx. 40 caracteres | Categoría reutilizable |

No se modifica `TaskItem` ni `AppUser`. `TaskTemplate` no tiene relación de clave foránea con `TaskItem`: crear una tarea desde una plantilla es una operación de copia de valores en el momento de la creación, no una relación persistida. Por eso no se añade `TemplateId` a `TaskItem`.

Siguiendo el mismo criterio que `AppUser` (que tampoco lleva `CreatedAt`/`UpdatedAt`), `TaskTemplate` se mantiene con únicamente los campos reutilizables, sin campos de auditoría, para no añadir estado que no se ha pedido.

### Migración necesaria

Nueva migración EF Core (`AgregarPlantillasDeTareas` o equivalente) que crea la tabla `TaskTemplates`:

- `Id` (PK, autoincremental)
- `Title` (`nvarchar`/`TEXT`, requerido, máx. 120)
- `Description` (nullable, máx. 500)
- `Priority` (int, requerido)
- `Category` (nullable, máx. 40)

No se requiere índice adicional ni FK: es una tabla independiente sin relación con `Tasks` ni `Users`.

## 4. DTOs

### DTOs de entrada

```csharp
// TaskFlow.Application/Templates/Dtos/CreateTaskTemplateRequest.cs
public record CreateTaskTemplateRequest(
    string Title,
    string? Description,
    int Priority,
    string? Category);

// TaskFlow.Application/Templates/Dtos/UpdateTaskTemplateRequest.cs
public record UpdateTaskTemplateRequest(
    string Title,
    string? Description,
    int Priority,
    string? Category);

// TaskFlow.Application/Templates/Dtos/CreateTaskFromTemplateRequest.cs
public record CreateTaskFromTemplateRequest(
    DateTime? DueDate,
    int? AssignedUserId);
```

### DTOs de salida

```csharp
// TaskFlow.Application/Templates/Dtos/TaskTemplateDto.cs
public record TaskTemplateDto(
    int Id,
    string Title,
    string? Description,
    int Priority,
    string? Category);
```

La creación de tarea desde plantilla reutiliza el DTO de salida ya existente `TaskDto` (`TaskFlow.Application.Tasks.Dtos`), sin cambios en su forma.

## 5. Endpoints

| Verbo | Ruta | Cuerpo | Respuesta exitosa | Errores posibles |
|-------|------|--------|-------------------|-------------------|
| GET | /api/templates | — | 200 + array de `TaskTemplateDto` | — |
| GET | /api/templates/{id} | — | 200 + `TaskTemplateDto` | 404 si no existe |
| POST | /api/templates | `CreateTaskTemplateRequest` | 201 + `TaskTemplateDto` | 400/ValidationProblem |
| PUT | /api/templates/{id} | `UpdateTaskTemplateRequest` | 200 + `TaskTemplateDto` | 404 si no existe, 400/ValidationProblem |
| DELETE | /api/templates/{id} | — | 204 No Content | 404 si no existe |
| POST | /api/templates/{id}/tasks | `CreateTaskFromTemplateRequest` | 201 + `TaskDto` (misma forma que `POST /api/tasks`) | 404 si la plantilla no existe, 404 si `AssignedUserId` no existe |

La ruta de creación de tarea desde plantilla se expone como sub-recurso de `/api/templates` porque la plantilla es el origen de la operación; la respuesta es un `TaskDto` con `Location: /api/tasks/{id}`, igual que hace hoy `POST /api/tasks`.

## 6. Lógica de negocio

- `TaskTemplate` valida su propio `Title` igual que `TaskItem` y `AppUser`: obligatorio, no vacío ni solo espacios, se recorta (`Trim()`).
- `ITaskTemplateRepository` (contrato en `Application`) y `TaskTemplateRepository` (implementación en `Infrastructure`) siguen el mismo patrón que `IUserRepository`/`UserRepository`: `GetByIdAsync`, `GetAllAsync`, `AddAsync`, `Remove`, `SaveChangesAsync`. No incluyen `ExistsAsync` propio porque no hay FKs que validar contra `TaskTemplate` (nadie referencia una plantilla desde otra entidad).
- `TaskTemplateService` (implementa `ITaskTemplateService`) orquesta el CRUD de plantillas: construye la entidad, delega en el repositorio y mapea a `TaskTemplateDto` mediante `TaskTemplateMapper`. Sigue el mismo patrón que `UserService`.
- La creación de tarea desde plantilla **no** vive en `TaskTemplateService`, sino en `TaskService` (capa `Tasks`), porque quien conoce las reglas de creación de `TaskItem` (incluida la validación de `AssignedUserId` vía `EnsureAssignedUserExistsAsync`) ya es `TaskService`. Se añade:
  - Nueva dependencia en el constructor de `TaskService`: `ITaskTemplateRepository`.
  - Nuevo método en `ITaskService`/`TaskService`: `CreateTaskFromTemplateAsync(int templateId, CreateTaskFromTemplateRequest request, CancellationToken cancellationToken)`.
  - El método busca la plantilla con `ITaskTemplateRepository.GetByIdAsync`; si no existe, devuelve `null` (el endpoint traduce a `404 Not Found`, igual que `UpdateTaskAsync`/`AssignUserAsync` hacen hoy con tareas inexistentes).
  - Si existe, valida `AssignedUserId` con el mismo `EnsureAssignedUserExistsAsync` ya presente en `TaskService` (lanza `NotFoundException`, capturada por el middleware global de `Program.cs` como `404`).
  - Construye un `TaskItem` nuevo copiando `Title`, `Description`, `Priority`, `Category` de la plantilla y usando `request.DueDate`/`request.AssignedUserId` para los campos propios de la tarea; persiste con `ITaskRepository.AddAsync` + `SaveChangesAsync`, igual que `CreateTaskAsync`.
- No se necesitan validadores de FluentValidation dedicados para `CreateTaskFromTemplateRequest`: ambos campos son opcionales y sin restricciones de formato adicionales, igual que ocurre hoy con `AssignTaskRequest` (que tampoco tiene validador propio).

## 7. Capas afectadas

**Crear:**
- `backend/src/TaskFlow.Domain/Entities/TaskTemplate.cs`
- `backend/src/TaskFlow.Application/Templates/Dtos/CreateTaskTemplateRequest.cs`
- `backend/src/TaskFlow.Application/Templates/Dtos/UpdateTaskTemplateRequest.cs`
- `backend/src/TaskFlow.Application/Templates/Dtos/TaskTemplateDto.cs`
- `backend/src/TaskFlow.Application/Templates/ITaskTemplateRepository.cs`
- `backend/src/TaskFlow.Application/Templates/ITaskTemplateService.cs`
- `backend/src/TaskFlow.Application/Templates/TaskTemplateService.cs`
- `backend/src/TaskFlow.Application/Templates/TaskTemplateMapper.cs`
- `backend/src/TaskFlow.Application/Templates/Validators/CreateTaskTemplateRequestValidator.cs`
- `backend/src/TaskFlow.Application/Templates/Validators/UpdateTaskTemplateRequestValidator.cs`
- `backend/src/TaskFlow.Application/Tasks/Dtos/CreateTaskFromTemplateRequest.cs`
- `backend/src/TaskFlow.Infrastructure/Repositories/TaskTemplateRepository.cs`
- `backend/src/TaskFlow.Infrastructure/Persistence/Configurations/TaskTemplateConfiguration.cs`
- `backend/src/TaskFlow.Infrastructure/Persistence/Migrations/<timestamp>_AgregarPlantillasDeTareas.cs` (generada por EF Core)
- `backend/src/TaskFlow.Api/Templates/TemplateEndpoints.cs`
- `frontend/src/types/template.ts`
- `frontend/src/api/templatesApi.ts`
- `frontend/src/hooks/useTemplates.ts`
- `frontend/src/schemas/templateFormSchema.ts`
- `frontend/src/components/TemplateManager.tsx` (gestión CRUD de plantillas, siguiendo el patrón de `UserManager.tsx`)
- `frontend/src/components/TemplateManager.test.tsx`
- `frontend/src/components/CreateTaskFromTemplateDialog.tsx` (o equivalente: selector de plantilla + campos `DueDate`/`AssignedUserId` para crear la tarea)

**Modificar:**
- `backend/src/TaskFlow.Application/Tasks/ITaskService.cs` — añadir `CreateTaskFromTemplateAsync`
- `backend/src/TaskFlow.Application/Tasks/TaskService.cs` — nueva dependencia `ITaskTemplateRepository` y nuevo método
- `backend/src/TaskFlow.Application/DependencyInjection.cs` — registrar `ITaskTemplateService`/`TaskTemplateService`
- `backend/src/TaskFlow.Infrastructure/Persistence/TaskFlowDbContext.cs` — añadir `DbSet<TaskTemplate> Templates`
- `backend/src/TaskFlow.Infrastructure/DependencyInjection.cs` — registrar `ITaskTemplateRepository`/`TaskTemplateRepository`
- `backend/src/TaskFlow.Api/Program.cs` — mapear `MapTemplateEndpoints()`
- `docs/analisis-diseño.md` — nueva sección de modelo de datos y endpoints para `TaskTemplate`
- `frontend/src/App.tsx` — integrar gestión de plantillas y flujo de creación de tarea desde plantilla
- `frontend/src/types/task.ts` — si se reutiliza `CreateTaskPayload` como base para el payload de creación desde plantilla, verificar compatibilidad (probablemente no requiere cambios, ver sección 4)

## 8. Tests unitarios a implementar

Backend (`TaskFlow.Application.Tests`):

- `TaskTemplateTest_TituloVacioLanzaExcepcion`: verifica que `TaskTemplate` rechaza título vacío o solo espacios.
- `TaskTemplateTest_ActualizaCamposCorrectamente`: verifica que `Update` cambia `Title`, `Description`, `Priority`, `Category`.
- `TaskTemplateServiceTest_CreaPlantillaCorrectamente`: crea una plantilla válida y verifica el DTO devuelto.
- `TaskTemplateServiceTest_ActualizaPlantillaExistente`: actualiza una plantilla existente y verifica los nuevos valores.
- `TaskTemplateServiceTest_ActualizarPlantillaInexistenteDevuelveNull`: verifica que `UpdateTemplateAsync` devuelve `null` si la plantilla no existe.
- `TaskTemplateServiceTest_EliminaPlantillaExistente`: verifica que `DeleteTemplateAsync` elimina y devuelve `true`.
- `TaskTemplateServiceTest_EliminarPlantillaInexistenteDevuelveFalse`: verifica el caso de plantilla inexistente.
- `TaskServiceTest_CreaTareaDesdePlantillaHeredaCamposReutilizables`: crea una tarea desde una plantilla y verifica que `Title`, `Description`, `Priority`, `Category` coinciden con la plantilla y que `DueDate`/`AssignedUserId` son los indicados en la petición.
- `TaskServiceTest_CreaTareaDesdePlantillaInexistenteDevuelveNull`: verifica que si la plantilla no existe, el método devuelve `null`.
- `TaskServiceTest_CreaTareaDesdePlantillaConUsuarioInexistenteLanzaNotFound`: verifica que se lanza `NotFoundException` si `AssignedUserId` no existe.

Backend (`TaskFlow.Api.Tests`):

- `TemplateEndpointsTests_GetTemplates_DevuelveListaVacia`
- `TemplateEndpointsTests_PostTemplate_CreaPlantillaYDevuelve201`
- `TemplateEndpointsTests_PostTemplate_TituloVacioDevuelve400`
- `TemplateEndpointsTests_PutTemplate_ActualizaYDevuelve200`
- `TemplateEndpointsTests_PutTemplate_InexistenteDevuelve404`
- `TemplateEndpointsTests_DeleteTemplate_EliminaYDevuelve204`
- `TemplateEndpointsTests_DeleteTemplate_InexistenteDevuelve404`
- `TemplateEndpointsTests_PostTaskFromTemplate_CreaTareaYDevuelve201`
- `TemplateEndpointsTests_PostTaskFromTemplate_PlantillaInexistenteDevuelve404`
- `TemplateEndpointsTests_PostTaskFromTemplate_UsuarioInexistenteDevuelve404`

Frontend (Vitest + Testing Library):

- `TemplateManager.test.tsx`: renderiza la lista de plantillas, permite crear, editar y eliminar una plantilla (con confirmación de borrado, igual que las tareas).
- Prueba de componente/hook para el flujo "crear tarea desde plantilla": selecciona una plantilla, completa `DueDate`/usuario asignado, y verifica que se invoca la mutación correcta.

E2E (Playwright), si se decide ampliar `frontend/e2e/tasks.spec.ts` o crear `frontend/e2e/templates.spec.ts`:

- Recorrido: crear una plantilla, usarla para crear una tarea, verificar que la tarea aparece en el listado con los campos heredados.

## 9. Criterios de aceptación

1. Existe el CRUD completo de plantillas (`GET`, `GET/{id}`, `POST`, `PUT`, `DELETE`) bajo `/api/templates`, con validación de entrada y respuestas HTTP coherentes con el resto de la API.
2. `POST /api/templates/{id}/tasks` crea una tarea nueva que hereda `Title`, `Description`, `Priority`, `Category` de la plantilla, y admite `DueDate`/`AssignedUserId` en el cuerpo de la petición.
3. Si la plantilla no existe, la operación de creación de tarea desde plantilla responde `404 Not Found`.
4. Si `AssignedUserId` no existe, la operación responde `404 Not Found`, igual que en `POST /api/tasks`.
5. `TaskItem` y `AppUser` no cambian de forma ni de comportamiento.
6. El frontend permite listar, crear, editar y eliminar plantillas, y crear una tarea a partir de una plantilla existente, sin recarga de página.
7. Todos los tests nuevos (backend y frontend) pasan y la suite completa sigue en verde.
8. `docs/analisis-diseño.md` refleja la nueva entidad, sus DTOs y sus endpoints.

## 10. Skills a invocar

> Para ejecutar toda la cadena de una vez, usa el skill orquestador: `nueva-feature`.
> Para ejecutar skills individuales, llámalos en el orden indicado a continuación.

| Orden | Skill | Motivo (qué genera para esta feature) |
|-------|-------|---------------------------------------|
| 1 | `diseño-analisis` | Sí — hay entidad nueva (`TaskTemplate`), DTOs nuevos y endpoints nuevos (`/api/templates`, `/api/templates/{id}/tasks`); actualiza `docs/analisis-diseño.md` |
| 2 | `modelo` | Sí — crea la entidad `TaskTemplate` en `TaskFlow.Domain/Entities/` con sus invariantes (`Title` obligatorio) |
| 3 | `dto` | Sí — crea `CreateTaskTemplateRequest`, `UpdateTaskTemplateRequest`, `TaskTemplateDto` y `CreateTaskFromTemplateRequest` |
| 4 | `base-de-datos` | Sí — añade `DbSet<TaskTemplate>`, `TaskTemplateConfiguration` y la migración `AgregarPlantillasDeTareas` |
| 5 | `logica-negocio` | Sí — crea `ITaskTemplateRepository`/`TaskTemplateRepository` |
| 6 | `validaciones` | Sí — validadores de `CreateTaskTemplateRequest`/`UpdateTaskTemplateRequest` y la comprobación de existencia de plantilla/usuario en `TaskService.CreateTaskFromTemplateAsync` |
| 7 | `servicio` | Sí — crea `ITaskTemplateService`/`TaskTemplateService`/`TaskTemplateMapper` y amplía `ITaskService`/`TaskService` con `CreateTaskFromTemplateAsync` |
| 8 | `controlador` | Sí — crea `TemplateEndpoints` (`/api/templates`) y su registro en `Program.cs` |
| 9 | `ui-ux-pro-max` | Sí, antes del frontend — patrones de accesibilidad y consistencia visual para el gestor de plantillas y el flujo de creación desde plantilla, coherentes con la dirección visual del MVP |
| 10 | `frontend-react` | Sí — tipos, cliente API, hooks de TanStack Query, schema Zod y componentes (`TemplateManager`, selector de creación desde plantilla) |
| 11 | `tests-unitarios` | Sí — cobertura de los casos listados en la sección 8, backend y frontend |
| 12 | `commit-message` | Siempre, al finalizar la implementación |

