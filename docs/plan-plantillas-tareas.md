# Plan de implementación: Plantillas de tareas

## Contexto y objetivo

TaskFlow permite gestionar tareas persistidas como `TaskItem`, pero actualmente no ofrece una forma de guardar configuraciones reutilizables para crear tareas similares. La petición se interpreta como la incorporación de un recurso persistente `TaskTemplate`, con gestión CRUD y una acción para instanciar una tarea a partir de una plantilla.

La implementación debe mantener la arquitectura real del repositorio: `TaskFlow.Domain` para entidades, `TaskFlow.Application` para DTOs, servicios y repositorios, `TaskFlow.Infrastructure` para EF Core/SQLite, `TaskFlow.Api` para Minimal APIs y `frontend` para la experiencia React. Las tareas instanciadas serán tareas normales, empezarán pendientes y quedarán sujetas al flujo existente de edición, completado, reapertura y eliminación.

## Requisitos y criterios de aceptación

- El usuario puede listar, crear, editar y eliminar plantillas.
- Una plantilla tiene un nombre propio y contiene los datos reutilizables de una tarea: título, descripción, prioridad, categoría, vencimiento opcional y usuario asignado opcional.
- El nombre y el título son obligatorios y respetan los límites ya aplicados a tareas: 120 caracteres para título y 500 para descripción; el nombre de plantilla debe tener un límite explícito, recomendado de 80 caracteres.
- El usuario puede instanciar una plantilla mediante una acción de API y obtiene la tarea creada.
- Instanciar una plantilla copia sus campos configurables, fuerza `IsCompleted = false` y genera `CreatedAt`/`UpdatedAt` nuevos; no modifica ni elimina la plantilla.
- Si la plantilla o el usuario asignado no existen, la API responde `404 Not Found` mediante el manejo de excepciones existente.
- No se puede instanciar una plantilla inactiva si se incorpora el estado `IsActive`; en la primera versión se recomienda no añadir activación/desactivación hasta que se solicite explícitamente.
- Las operaciones de plantilla se persisten en SQLite mediante una migración EF Core sin pérdida de datos existentes.
- La interfaz permite consultar las plantillas, crear/editar/eliminar una plantilla, e instanciarla con confirmación visual del resultado y del error.
- La UI conserva los textos en castellano, el estilo visual del MVP, los estados de carga/error/vacío y la accesibilidad de controles y foco.
- Los tests cubren éxito, validación, recurso inexistente, usuario asignado inexistente, instanciación y eliminación.

## Alcance técnico

### Backend

Crear la entidad `TaskTemplate` en `backend/src/TaskFlow.Domain/Entities/TaskTemplate.cs` con `Id`, `Name`, `Title`, `Description`, `Priority`, `Category`, `DueDate`, `AssignedUserId`, `CreatedAt` y `UpdatedAt`. La relación con `AppUser` será opcional y usará `ON DELETE SET NULL`, igual que `TaskItem`. La plantilla no tendrá estado de completado ni timestamps de tarea.

Añadir los contratos `CreateTaskTemplateRequest`, `UpdateTaskTemplateRequest` y `TaskTemplateDto`, más un contrato de instanciación solo si el diseño final permite sobrescribir la fecha de vencimiento al crear la tarea. La opción mínima es que `POST /api/task-templates/{id}/instantiate` no tenga cuerpo y copie `DueDate`; esta decisión debe quedar confirmada antes de implementar.

Añadir `ITaskTemplateRepository`, `TaskTemplateRepository`, `TaskTemplateService`, `ITaskTemplateService` y el mapper correspondiente en `TaskFlow.Application`, siguiendo el patrón existente de `TaskService`, `TaskMapper`, `ITaskRepository` y repositorios EF. La operación de instanciación debe validar la existencia de la plantilla y del `AssignedUserId`, crear un `TaskItem` con el reloj inyectado y guardar ambas entidades mediante el repositorio de tareas.

Añadir `TaskTemplateEndpoints` en `backend/src/TaskFlow.Api/TaskTemplates/TaskTemplateEndpoints.cs` y registrarlo en `Program.cs`:

| Verbo | Ruta | Resultado |
|---|---|---|
| `GET` | `/api/task-templates` | `200` con la lista de plantillas |
| `GET` | `/api/task-templates/{id}` | `200` con la plantilla o `404` |
| `POST` | `/api/task-templates` | `201` con la plantilla creada o `400` por validación |
| `PUT` | `/api/task-templates/{id}` | `200` con la plantilla actualizada o `404`/`400` |
| `POST` | `/api/task-templates/{id}/instantiate` | `201` o `200` con `TaskDto`, o `404` |
| `DELETE` | `/api/task-templates/{id}` | `204` o `404` |

Configurar `TaskTemplateConfiguration`, añadir `DbSet<TaskTemplate>` a `TaskFlowDbContext`, registrar repositorio y servicio en las extensiones `AddApplication`/`AddInfrastructure`, y generar una migración descriptiva como `AddTaskTemplates`. No ejecutar automáticamente una actualización destructiva de una base de datos existente; revisar primero la migración y aplicar `database update` según el procedimiento operativo del proyecto.

### Frontend

Crear tipos en `frontend/src/types/taskTemplate.ts`, cliente API en `frontend/src/api/taskTemplatesApi.ts` y hooks TanStack Query en `frontend/src/hooks/useTaskTemplates.ts`. Los tipos deben reflejar los DTOs reales, usando `string | null` para fechas y `number | null` para `assignedUserId`.

Crear un componente de gestión de plantillas, recomendado `frontend/src/components/TaskTemplateManager.tsx`, integrado en `frontend/src/App.tsx`. Debe permitir listar, crear y editar plantillas, eliminar con `ConfirmDialog` y ejecutar “Usar plantilla” para refrescar la lista de tareas y mostrar un toast. Reutilizar los controles, validación y aspecto de `TaskForm` cuando sea posible, sin duplicar lógica de mapeo innecesariamente.

### Persistencia y contratos

La entidad de plantilla no debe reutilizar la tabla `Tasks`: conservar una tabla separada `TaskTemplates` evita mezclar registros reutilizables con instancias reales y permite eliminar una plantilla sin afectar tareas creadas previamente. La instanciación es una copia por valor; cambios posteriores en la plantilla no modifican tareas ya creadas.

### Skills aplicables y orden

| Posición | Skill | Motivo | Prerrequisitos | Artefacto esperado |
|---:|---|---|---|---|
| 1 | `diseño-analisis` | Actualizar la fuente de verdad con `TaskTemplate`, reglas y endpoints antes del código. | `docs/analisis-diseño.md` y contexto del proyecto. | Secciones de modelo, API y decisiones actualizadas. |
| 2 | `modelo` | Crear la entidad de dominio y sincronizar el `DbContext` relacionado. | Análisis actualizado y convenciones del repositorio. | `TaskTemplate.cs` y cambios de `TaskFlowDbContext`. |
| 3 | `dto` | Definir los contratos de entrada/salida de plantillas e instanciación. | Modelo y secciones 4/5 del análisis. | DTOs bajo `TaskFlow.Application/TaskTemplates/Dtos`. |
| 4 | `base-de-datos` | Configurar Fluent API, relación opcional con `AppUser` y migración SQLite. | Análisis y modelo disponibles. | Configuración, `DbSet`, migración revisada y comandos de aplicación. |
| 5 | `logica-negocio` | Encapsular CRUD e instanciación; en este repositorio se adapta a repositorios y servicios existentes. | Modelo, `TaskFlowDbContext` y contratos de persistencia. | Contratos/implementaciones de repositorio y reglas de existencia. |
| 6 | `validaciones` | Validar nombre, título, longitudes, prioridad, fechas y usuario asignado. | DTOs y reglas del análisis. | Validadores FluentValidation y manejo coherente de `404`/`400`. |
| 7 | `servicio` | Mapear DTOs y orquestar la copia plantilla → `TaskItem`. | DTOs, repositorios y lógica de negocio. | `ITaskTemplateService`, `TaskTemplateService` y registros DI. |
| 8 | `controlador` | Exponer el recurso por Minimal APIs, adaptando el skill a `TaskTemplateEndpoints`. | Endpoints definidos y servicio registrado. | Endpoint group `/api/task-templates` conectado en `Program.cs`. |
| 9 | `ui-ux-pro-max` | Valorar patrones de interacción y accesibilidad antes de añadir la gestión visual. | Requisitos del flujo frontend. | Criterios de UI; la ficha local es solo catálogo y no aporta plantillas ejecutables. |
| 10 | `frontend-react` | Añadir tipos, API, hooks, componente y estados de UI. | DTOs/endpoints backend definidos. | Gestión de plantillas integrada en `App.tsx`. |
| 11 | `actualizar-documentacion` | Sincronizar arquitectura, contratos y estructura tras completar la feature. | Implementación y migración terminadas. | `docs/analisis-diseño.md`, `docs/documento-funcional-arquitectura.md` y convenciones coherentes. |

## Archivos y símbolos afectados

- `docs/analisis-diseño.md`: documentar la entidad, sus reglas, endpoints y la decisión de copia por valor; debe actualizarse antes de implementar.
- `backend/src/TaskFlow.Domain/Entities/TaskTemplate.cs`: nueva entidad y operaciones de actualización/validación de dominio.
- `backend/src/TaskFlow.Domain/Entities/TaskItem.cs`: revisar el constructor y el método `Update` solo para reutilizar correctamente la creación desde plantilla; no añadir campos de recurrencia salvo decisión explícita.
- `backend/src/TaskFlow.Application/Tasks/TaskService.cs` y `ITaskService.cs`: exponer una operación interna o reutilizable para crear una tarea a partir de valores de plantilla sin duplicar reglas de usuario asignado y timestamps.
- `backend/src/TaskFlow.Application/TaskTemplates/`: crear DTOs, mapper, repositorio, servicio y validadores siguiendo la estructura existente de `Tasks`.
- `backend/src/TaskFlow.Infrastructure/Persistence/TaskFlowDbContext.cs`: añadir `DbSet<TaskTemplate>`.
- `backend/src/TaskFlow.Infrastructure/Persistence/Configurations/TaskTemplateConfiguration.cs`: nueva tabla, longitudes, índices y FK opcional a `AppUser` con `SetNull`.
- `backend/src/TaskFlow.Infrastructure/Repositories/TaskTemplateRepository.cs`: persistencia de lecturas y escrituras del nuevo recurso.
- `backend/src/TaskFlow.Infrastructure/Persistence/Migrations/`: crear la migración de `TaskTemplates` y actualizar el snapshot.
- `backend/src/TaskFlow.Application/DependencyInjection.cs` y `backend/src/TaskFlow.Infrastructure/DependencyInjection.cs`: registrar servicios y repositorios nuevos.
- `backend/src/TaskFlow.Api/TaskTemplates/TaskTemplateEndpoints.cs`, `backend/src/TaskFlow.Api/Program.cs`: definir y mapear las rutas HTTP.
- `frontend/src/types/taskTemplate.ts`, `frontend/src/api/taskTemplatesApi.ts`, `frontend/src/hooks/useTaskTemplates.ts`: contrato cliente, llamadas HTTP y caché/invalidez de consultas.
- `frontend/src/components/TaskTemplateManager.tsx`, `frontend/src/App.tsx`: UI de gestión e integración con tareas, toasts y confirmación de borrado.
- `frontend/src/schemas/`: crear o extender el schema específico de plantilla sin debilitar `taskFormSchema`.
- `backend/tests/TaskFlow.Application.Tests/TaskTemplates/` y `backend/tests/TaskFlow.Api.Tests/TaskTemplateEndpointsTests.cs`: pruebas unitarias y de integración del recurso y de instanciación.
- `frontend/src/components/TaskTemplateManager.test.tsx`, `frontend/src/api/taskTemplatesApi.test.ts` y/o tests de hooks: pruebas de formulario, estados, acciones y errores.
- `frontend/e2e/tasks.spec.ts` o un spec separado de plantillas: recorrido de crear plantilla, instanciarla y comprobar la tarea resultante, si el entorno E2E puede ejecutar el flujo sin ampliar la configuración.
- `docs/documento-funcional-arquitectura.md` y `.github/copilot-instructions.md`: actualizar el mapa de recursos, modelo y contratos una vez estabilizado el código.

## Secuencia de implementación

1. Ejecutar `diseño-analisis` para incorporar `TaskTemplate`, la tabla `TaskTemplates`, los DTOs y los seis endpoints definidos; decidir en el documento si `instantiate` copia o permite sobrescribir `DueDate`.
2. Ejecutar `modelo` para crear la entidad y actualizar el contexto/configuración prevista, manteniendo la relación opcional con `AppUser`.
3. Ejecutar `dto` y `validaciones` para fijar contratos, límites de campos, prioridades válidas y existencia de `AssignedUserId`.
4. Ejecutar `base-de-datos` para configurar EF Core y generar/revisar la migración. Verificar que añade la nueva tabla, índice de nombre si se decide unicidad, FK nullable y no altera `Tasks` salvo lo estrictamente necesario.
5. Ejecutar `logica-negocio` y `servicio`: añadir el CRUD, la consulta de plantilla, la instancia de `TaskItem`, el mapeo y las dependencias. La operación debe delegar en el servicio de tareas o en una abstracción compartida, evitando duplicar la regla de asignación de usuarios.
6. Ejecutar `controlador`, adaptándolo a Minimal APIs: mapear `TaskTemplateEndpoints`, mantener `ValidationProblem`, `NotFoundException` y los códigos de respuesta usados por `TaskEndpoints`.
7. Ejecutar `frontend-react` después de fijar el contrato HTTP: crear tipos/API/hooks, implementar `TaskTemplateManager`, integrarlo en `App.tsx` y conectar la invalidación de `task-templates` y `tasks` tras las mutaciones.
8. Añadir las pruebas backend, frontend y E2E de la sección siguiente. Corregir primero errores del slice de plantillas antes de revisar regresiones del CRUD de tareas.
9. Ejecutar `actualizar-documentacion` para sincronizar análisis, arquitectura, instrucciones y diagramas con los nombres reales.

## Pruebas y verificación

Sin iniciar servidores automáticamente, el agente implementador deberá ejecutar:

- Backend: `dotnet build backend/TaskFlow.slnx` y `dotnet test backend/TaskFlow.slnx`.
- Frontend: `npm run test` desde `frontend/` y `npx tsc -b --noEmit`.
- E2E, si el entorno está disponible: `npx playwright test` desde `frontend/`; el desarrollador iniciará manualmente API y Vite según las instrucciones del repositorio.
- Migración: revisar el diff generado y confirmar que es aditiva, que la FK usa `SET NULL` y que no elimina tareas ni usuarios.

Casos mínimos:

- Crear plantilla válida y recuperarla por listado y por id.
- Rechazar nombre o título vacío, exceder longitudes y enviar prioridad inválida.
- Actualizar todos los campos editables y comprobar que `CreatedAt` permanece estable y `UpdatedAt` cambia.
- Devolver `404` al consultar, actualizar, eliminar o instanciar una plantilla inexistente.
- Rechazar o devolver `404` al crear/actualizar una plantilla con `AssignedUserId` inexistente.
- Instanciar una plantilla y comprobar copia de campos, estado pendiente, timestamps nuevos y persistencia como `TaskItem` independiente.
- Editar o eliminar la plantilla después de instanciarla y comprobar que la tarea creada no cambia ni desaparece.
- Verificar en frontend estados de carga, error, vacío, validación, edición, confirmación de borrado, toast de éxito y refresco de tareas tras instanciar.
- Verificar responsive, navegación por teclado, etiquetas de formulario y nombres accesibles de acciones iconográficas.

## Riesgos, supuestos y decisiones pendientes

- **Supuesto principal:** “plantilla” significa una receta reutilizable de una tarea, no una vista guardada de filtros ni una plantilla de interfaz.
- **Supuesto de persistencia:** `TaskTemplate` es una entidad independiente y la instanciación realiza una copia por valor.
- **Pendiente:** confirmar si `DueDate` debe copiarse tal cual o si `instantiate` debe recibir una fecha de vencimiento opcional para evitar fechas ya vencidas. La opción conservadora inicial es copiar el valor almacenado y permitir después una ampliación explícita.
- **Pendiente:** confirmar si el nombre de plantilla debe ser único. Se recomienda no imponer unicidad en esta primera implementación para no bloquear duplicados legítimos.
- **Pendiente:** confirmar si las plantillas requieren activar/desactivar, archivar o limitar su uso. No se incluye `IsActive` sin requisito explícito.
- **Pendiente:** el laboratorio `GHCOPTL-M3.1-lab.md` menciona tareas repetitivas y `TipoRecurrencia`; esta petición solo solicita plantillas, por lo que la recurrencia automática queda separada. Si se confirma, deberá planificarse como extensión que añade campos y reglas a `TaskItem`.
- **Riesgo de duplicación:** crear tareas desde plantilla puede duplicar validaciones de `TaskService`; debe reutilizarse la lógica existente de asignación y reloj.
- **Riesgo de migración:** la base SQLite puede contener datos locales; la migración debe revisarse antes de aplicarse y no ejecutarse destructivamente.
- **Riesgo de UX:** añadir un gestor completo en la misma pantalla puede aumentar la densidad; se recomienda una sección plegable o panel secundario coherente con `UserManager`, sin ocultar el alta rápida de tareas.

## Fuera de alcance

- Recurrencia automática diaria, semanal o mensual, generación programada de tareas y cálculo de `NextDueDate`.
- Autenticación, multiusuario real, permisos o aislamiento de plantillas por usuario.
- Compartir, importar/exportar o sincronizar plantillas con servicios externos.
- Versionado, historial, favoritos, etiquetas adicionales o marketplace de plantillas.
- Reemplazar el CRUD existente de tareas o cambiar sus rutas públicas.
- Aplicar migraciones o iniciar API/Vite automáticamente durante la planificación.