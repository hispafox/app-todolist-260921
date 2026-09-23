# Análisis y diseño de TaskFlow

## 1. Objetivo del proyecto

TaskFlow es una aplicación web ligera para gestionar tareas personales y profesionales de forma rápida, ordenada y responsive. Su finalidad es permitir crear, organizar, filtrar y completar tareas sin dependencias externas, manteniendo una arquitectura simple, mantenible y fácil de desplegar localmente.

La solución combina un backend en .NET 10 con ASP.NET Core Minimal APIs y SQLite, y un frontend en React + Vite + TypeScript para ofrecer una experiencia moderna de gestión de tareas con persistencia real y sin recarga de página.

## 2. Stack tecnológico

| Tecnología | Versión | Rol |
|---|---|---|
| ASP.NET Core | .NET 10 | API REST del backend |
| Entity Framework Core | 10 | ORM y acceso a datos |
| SQLite | — | Base de datos embebida |
| FluentValidation | — | Validación de DTOs de entrada |
| Swagger / Scalar | — | Documentación y pruebas de API |
| React | 19 | Frontend de la interfaz |
| Vite | 8 | Bundler y servidor de desarrollo |
| TypeScript | ~6.0.2 | Tipado estático del frontend |
| Tailwind CSS | 4 | Estilos visuales del UI |
| TanStack Query | 5 | Estado servidor y sincronización con la API |
| React Hook Form | — | Formularios y validación del cliente |
| Zod | 4 | Validación de esquemas y formularios |
| xUnit | — | Pruebas unitarias del backend |
| FluentAssertions | — | Aserciones más expresivas en tests |
| Vitest | 5 | Pruebas del frontend |
| Testing Library | 16 | Pruebas de componentes e interacción |
| Playwright | 1.63 | Pruebas end-to-end |

## 3. Arquitectura de capas

La arquitectura del proyecto sigue una separación clara por responsabilidades, con flujo unidireccional y dependencia de capas internas hacia el exterior:

```text
backend/
├── TaskFlow.Api                # Endpoints HTTP, composición, Swagger, CORS
├── TaskFlow.Application        # Casos de uso, DTOs, validación y contratos
├── TaskFlow.Domain             # Entidades, enums y reglas de negocio
├── TaskFlow.Infrastructure     # EF Core, SQLite, repositorios, persistencia
└── TaskFlow.Tests              # Pruebas de backend

frontend/
├── src                        # Componentes, páginas, formularios, hooks, schemas
├── public                     # Assets estáticos
├── tests                      # Pruebas frontend
├── e2e                        # Tests end to end con Playwright
├── vite.config.ts             # Configuración del entorno
├── package.json               # Dependencias y scripts
└── index.html                 # Punto de entrada
```

### Capa Domain

Responsable de las entidades y las reglas del negocio. Aquí vive `TaskItem`, que encapsula el estado y las operaciones sobre la tarea, como `Update`, `Complete`, `Reopen` y validación del título.

### Capa Application

Coordina los casos de uso de negocio y expone contratos para que la capa API no dependa de EF Core ni de detalles de infraestructura. Incluye DTOs (`CreateTaskRequest`, `UpdateTaskRequest`, `TaskDto`, `TaskFilterRequest`), mapper, interfaces de servicios y repositorio y la lógica de aplicación.

### Capa Infrastructure

Implementa la persistencia y el acceso a base de datos con Entity Framework Core sobre SQLite. Aquí viven el `TaskFlowDbContext`, las configuraciones de entidad, el repositorio `TaskRepository` y la inicialización de datos.

### Capa Api

Expone los endpoints mínimos con ASP.NET Core Minimal APIs. Se encarga de:

- definir rutas y verbos HTTP,
- recibir DTOs de entrada,
- ejecutar validación de FluentValidation,
- delegar la lógica en `ITaskService`,
- devolver resultados HTTP consistentes (`200`, `201`, `204`, `404`, `400/422` según el caso).

### Frontend

La interfaz React consume la API REST y ofrece interacción directa con los datos sin recarga de página. La estructura típica incluye:

- componentes de formulario y lista,
- hooks para consultar y mutar tareas,
- schemas de validación con Zod,
- filtros y búsqueda en tiempo real,
- manejo de error, cargando y estado vacío.

## 4. Modelo de datos

### Entidad principal: TaskItem

La entidad principal del sistema es `TaskItem`, con la siguiente estructura:

| Campo | Tipo | Descripción |
|---|---|---|
| Id | int | Identificador único de la tarea |
| Title | string | Título obligatorio, no nulo ni vacío |
| Description | string? | Descripción opcional |
| Priority | TaskPriority | Prioridad de la tarea (`Low`, `Medium`, `High`) |
| Category | string? | Categoría opcional |
| IsCompleted | bool | Estado de finalización |
| DueDate | DateTime? | Fecha de vencimiento opcional |
| CreatedAt | DateTime | Fecha de creación |
| UpdatedAt | DateTime | Última fecha de modificación |

### Enum de prioridad

```csharp
public enum TaskPriority
{
    Low = 1,
    Medium = 2,
    High = 3,
}
```

### Enum de filtro de estado

```csharp
public enum TaskStatusFilter
{
    All = 0,
    Pending = 1,
    Completed = 2,
}
```

### Reglas de negocio del modelo

- `Title` es obligatorio; si llega vacío o con espacios, se lanza una excepción de validación del dominio.
- `CreatedAt` y `UpdatedAt` se gestionan automáticamente con un valor temporal compartido cuando se crea la tarea.
- `Complete()` y `Reopen()` cambian el estado y actualizan `UpdatedAt`.
- El modelo usa setters privados para mantener integridad del dominio y permitir a EF Core la materialización de la entidad.

### Entidad de asignación: AppUser

Para poder asignar tareas a una persona se incorpora un catálogo simple de usuarios, sin autenticación ni sesiones:

| Campo | Tipo | Descripción |
|---|---|---|
| Id | int | Identificador único del usuario |
| Name | string | Nombre obligatorio, máx. 80 caracteres |
| Email | string | Email obligatorio, único, máx. 200 caracteres |
| Color | string | Color hexadecimal identificativo (ej. `#2F6F62`) |

`TaskItem` incorpora `AssignedUserId` (`int?`) como clave foránea opcional hacia `AppUser`. Si se elimina un usuario, las tareas que tenía asignadas quedan sin asignar (`ON DELETE SET NULL`); no se eliminan tareas al eliminar un usuario.

### Reglas de negocio de la asignación

- `AssignedUserId` es opcional: una tarea puede no tener usuario asignado.
- Al crear, actualizar o reasignar una tarea, si se indica `AssignedUserId`, el usuario referenciado debe existir; en caso contrario la API responde `404 Not Found`.
- El email de `AppUser` es único; intentar crear o actualizar un usuario con un email ya existente responde `409 Conflict`.
- Esta gestión de usuarios es un catálogo interno de asignación y no constituye un sistema de autenticación ni de multiusuario con sesiones.

### Entidad de plantillas: TaskTemplate

Para reutilizar combinaciones habituales de campos al crear tareas se incorpora `TaskTemplate`, un catálogo independiente sin relación de clave foránea con `TaskItem`:

| Campo | Tipo | Descripción |
|---|---|---|
| Id | int | Identificador único de la plantilla |
| Title | string | Título obligatorio, máx. 120 caracteres |
| Description | string? | Descripción opcional, máx. 500 caracteres |
| Priority | TaskPriority | Prioridad reutilizable (`Low`, `Medium`, `High`) |
| Category | string? | Categoría opcional, máx. 40 caracteres |

`TaskTemplate` no tiene campos de auditoría (`CreatedAt`/`UpdatedAt`), siguiendo el mismo criterio que `AppUser`. Crear una tarea desde una plantilla es una operación de copia de valores en el momento de la creación, no una relación persistida: no existe `TemplateId` en `TaskItem`.

### Reglas de negocio de las plantillas

- `Title` es obligatorio en `TaskTemplate`, igual que en `TaskItem` y `AppUser`: no puede estar vacío ni ser solo espacios, y se recorta (`Trim()`).
- Al crear una tarea desde una plantilla (`POST /api/templates/{id}/tasks`), la tarea resultante hereda `Title`, `Description`, `Priority` y `Category` de la plantilla, y el cliente indica `DueDate`/`AssignedUserId` en la petición.
- Si la plantilla indicada no existe, la operación responde `404 Not Found`.
- Si `AssignedUserId` no existe, la operación responde `404 Not Found`, igual que en `POST /api/tasks`.

### Contratos de entrada y salida

El backend expone DTOs separados del dominio para evitar filtrar `TaskItem` directamente a la API:

- `CreateTaskRequest`: `Title`, `Description`, `Priority`, `Category`, `DueDate`, `AssignedUserId`
- `UpdateTaskRequest`: `Title`, `Description`, `Priority`, `Category`, `DueDate`, `AssignedUserId`
- `AssignTaskRequest`: `UserId` (nullable, para asignar o desasignar)
- `TaskDto`: respuesta serializada de la tarea con el esquema completo del modelo, incluyendo `AssignedUserId`
- `TaskFilterRequest`: `Search`, `Status`, `Priority`, `Category`
- `CreateUserRequest` / `UpdateUserRequest`: `Name`, `Email`, `Color`
- `UserDto`: `Id`, `Name`, `Email`, `Color`
- `CreateTaskTemplateRequest` / `UpdateTaskTemplateRequest`: `Title`, `Description`, `Priority`, `Category`
- `TaskTemplateDto`: `Id`, `Title`, `Description`, `Priority`, `Category`
- `CreateTaskFromTemplateRequest`: `DueDate`, `AssignedUserId` (la respuesta reutiliza `TaskDto`)

## 5. Endpoints API REST

La API sigue el recurso principal `/api/tasks` y usa verbos REST con semántica clara:

| Verbo | Ruta | Descripción | Respuesta OK |
|---|---|---|---|
| GET | /api/tasks | Obtiene todas las tareas aplicando filtros y búsqueda | 200 + array |
| GET | /api/tasks/{id} | Obtiene una tarea concreta por Id | 200 + objeto |
| POST | /api/tasks | Crea una nueva tarea | 201 + objeto creado |
| PUT | /api/tasks/{id} | Actualiza una tarea existente | 200 + objeto actualizado |
| PATCH | /api/tasks/{id}/complete | Marca la tarea como completada | 200 + objeto |
| PATCH | /api/tasks/{id}/reopen | Reabre una tarea completada | 200 + objeto |
| PATCH | /api/tasks/{id}/assign | Asigna (o desasigna, con `userId: null`) un usuario a la tarea | 200 + objeto |
| DELETE | /api/tasks/{id} | Elimina la tarea | 204 No Content |

El recurso `/api/users` gestiona el catálogo de usuarios asignables:

| Verbo | Ruta | Descripción | Respuesta OK |
|---|---|---|---|
| GET | /api/users | Obtiene todos los usuarios | 200 + array |
| GET | /api/users/{id} | Obtiene un usuario concreto por Id | 200 + objeto |
| POST | /api/users | Crea un nuevo usuario | 201 + objeto creado |
| PUT | /api/users/{id} | Actualiza un usuario existente | 200 + objeto actualizado |
| DELETE | /api/users/{id} | Elimina el usuario (las tareas asignadas quedan sin asignar) | 204 No Content |

El recurso `/api/templates` gestiona el catálogo de plantillas de tareas reutilizables:

| Verbo | Ruta | Descripción | Respuesta OK |
|---|---|---|---|
| GET | /api/templates | Obtiene todas las plantillas | 200 + array |
| GET | /api/templates/{id} | Obtiene una plantilla concreta por Id | 200 + objeto |
| POST | /api/templates | Crea una nueva plantilla | 201 + objeto creado |
| PUT | /api/templates/{id} | Actualiza una plantilla existente | 200 + objeto actualizado |
| DELETE | /api/templates/{id} | Elimina la plantilla | 204 No Content |
| POST | /api/templates/{id}/tasks | Crea una tarea nueva heredando `Title`, `Description`, `Priority`, `Category` de la plantilla | 201 + `TaskDto` |


### Filtros y búsqueda soportados

`GET /api/tasks` soporta los siguientes parámetros opcionales:

- `search`: texto libre sobre `Title` y `Description`
- `status`: `all`, `pending` o `completed`
- `priority`: valor numérico o enum asociado a la prioridad
- `category`: nombre de categoría

Estos filtros se convierten internamente en `TaskFilterRequest` y se aplican en el repositorio con consultas LINQ/EF Core.

### Semántica de resultado

- Si la tarea, el usuario o la plantilla no existen: la API devuelve `404 Not Found`.
- Si la entrada es inválida: la API responde con `400`/`ValidationProblem` según el caso.
- Si el email de un usuario ya está en uso: la API responde `409 Conflict`.
- Si la operación es exitosa: se devuelve la entidad actualizada o el código `204` del borrado.

## 6. Decisiones de diseño

### 6.1 SQLite como base de datos local

Se elige SQLite porque la aplicación es una herramienta personal, local y sin servidores externos. Ofrece persistencia real, facilidad de despliegue y un entorno ligero ideal para desarrollo y uso doméstico.

### 6.2 Minimal APIs para la capa HTTP

ASP.NET Core Minimal APIs permite definir endpoints de forma directa y clara, reduciendo la sobrecarga de la capa API para un CRUD pequeño con pocas reglas complejas. Además, encaja bien con la estrategia de servicio y repositorio en capas.

### 6.3 Separación por capas para mantener el dominio limpio

La capa `Domain` contiene el modelo y las reglas, `Application` concentra casos de uso y DTOs, y `Infrastructure` encapsula la persistencia. Esto facilita el crecimiento del proyecto sin mezclar lógica de negocio con acceso a datos o HTTP.

### 6.4 DTOs y contratos explícitos

Se evita exponer entidades de EF Core directamente en la API. Los DTOs actúan como contrato de entrada y salida, dejando el dominio aislado de la infraestructura y del transporte HTTP.

### 6.5 Inyección de dependencias por constructor

Las dependencias del servicio y repositorio se resuelven por contenedor, favoreciendo pruebas, sustitución de implementaciones y mejor mantenibilidad.

### 6.6 Validación en la capa de aplicación y API

La validación de entrada se realiza tanto en los DTOs como en la capa API mediante `FluentValidation`, reduciendo errores de datos antes de llegar a la base de datos y devolviendo mensajes útiles al cliente.

### 6.7 Frontend reactivo y sin recarga

La interfaz de React usa consultas en tiempo real, filtros y búsqueda local/servidor para ofrecer una experiencia de usuario fluida. La idea es mantener la sensación del MVP, pero conectada a persistencia real y a la API REST.

### 6.8 Visual y UX inspirada en el MVP

Aunque la implementación real usa tecnologías modernas, la interfaz mantiene la intención del MVP: cabecera editorial, jerarquía visual clara, paleta funcional y densidad orientada a la productividad. Esto garantiza continuidad funcional y reconocimiento visual.

### 6.9 Catálogo de usuarios sin autenticación

Para permitir asignar tareas a una persona se añade `AppUser` como catálogo simple (nombre, email, color), gestionado con un CRUD propio en `/api/users`. Deliberadamente no incorpora login, sesiones, roles ni aislamiento de datos por usuario: sigue siendo una aplicación de un único usuario final que ahora puede repartir tareas entre las personas de su entorno. Un futuro sistema de autenticación/multiusuario real seguiría siendo una ampliación independiente y fuera del alcance actual.

### 6.10 Plantillas de tareas como catálogo independiente

`TaskTemplate` se modela como un catálogo propio, sin FK hacia `TaskItem`, porque crear una tarea desde una plantilla es una copia de valores en el momento de la creación y no una relación que deba persistir. La lógica de creación de tarea desde plantilla vive en `TaskService` (no en `TaskTemplateService`), porque es quien ya conoce las reglas de creación de `TaskItem`, incluida la validación de `AssignedUserId`.

## 7. Pendientes / preguntas abiertas

La versión actual cubre el MVP principal, pero quedan aspectos por definir o ampliar según el crecimiento del producto:

- Paginación y orden avanzado en listados grandes.
- Autenticación y autorización reales para múltiples usuarios (login, sesiones, roles). El catálogo de usuarios asignables introducido en esta versión no sustituye este punto.
- Soporte para tareas compartidas o colaborativas.
- Notificaciones y recordatorios de vencimiento.
- Búsqueda más avanzada con índices de texto o filtros combinados complejos.
- Persistencia de configuración de usuario o preferencias de interfaz.
- Estrategia de migraciones y versionado de esquema más formal en entornos reales.
- Mejoras de observabilidad, logging y trazabilidad operacional.
- Cobertura de pruebas más amplia en frontend y E2E para escenarios de edge.

## Resumen ejecutivo

TaskFlow está diseñado como una aplicación local de gestión de tareas con arquitectura en capas, API REST clara y frontend reactivo. Su base real es SQLite, su dominio gira en torno a `TaskItem` y sus endpoints principales cubren creación, consulta, actualización, cierre, reapertura y eliminación. La solución se mantiene fiel al PRD y al MVP visual, sin introducir complejidad innecesaria ni funcionalidades fuera de alcance.
