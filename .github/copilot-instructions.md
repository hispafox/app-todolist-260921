# TaskFlow

## Contexto del proyecto

TaskFlow es una aplicación web ligera para gestionar tareas personales. El objetivo es ofrecer CRUD de tareas, organización por prioridad y categoría, fechas de vencimiento, búsqueda y filtros en tiempo real, sin multiusuario ni servicios externos en la versión inicial.

El documento funcional de referencia es [docs/PRD-TaskFlow-Completo.md](../docs/PRD-TaskFlow-Completo.md). Antes de implementar una funcionalidad, comprobar sus requisitos, criterios de aceptación y límites de alcance.

## Stack objetivo

- **Backend**: .NET 10, ASP.NET Core Minimal APIs, Entity Framework Core, SQLite, FluentValidation y Swagger/OpenAPI.
- **Frontend**: React, Vite, TypeScript, Tailwind CSS v4, TanStack Query, React Hook Form y Zod.
- **Pruebas**: xUnit y FluentAssertions para backend; Vitest y Testing Library para frontend; Playwright para end to end.
- **Persistencia**: SQLite. No añadir autenticación, multiusuario, integraciones externas ni notificaciones salvo que se solicite explícitamente.

## Estado actual y MVP

- `mvp/index.html` es una demo autónoma en HTML, CSS y JavaScript.
- La demo usa `localStorage` con la clave `taskflow-mvp-tasks`; no representa la persistencia productiva.
- El MVP sirve como referencia de comportamiento y UX: crear, editar, completar, reabrir y eliminar tareas; prioridad; categoría; vencimiento; búsqueda por título o descripción; filtros por estado, prioridad y categoría; contadores y diseño responsive.
- Al sustituir la demo por la aplicación real, conservar esos flujos salvo que el PRD indique lo contrario y conectar las operaciones a la API REST.

### Dirección visual de referencia

La demo del MVP define la línea visual que debe conservar la aplicación real. Antes de crear o modificar una pantalla, consultar `mvp/index.html` y mantener estos principios:

- Composición editorial y serena: cabecera amplia en verde petróleo, contenido claro sobre fondo marfil y una transición visual limpia hacia el área de trabajo.
- Jerarquía tipográfica intencionada: serif con personalidad para títulos y mensajes principales; sans-serif legible para formularios, filtros, etiquetas y datos auxiliares.
- Paleta contenida y funcional: tinta oscura para el contenido, teal para acciones y foco, menta para acciones secundarias, coral para eliminación o vencimientos y ámbar para prioridad media.
- Superficies blancas con bordes suaves, sombras discretas y radios moderados; evitar interfaces saturadas de tarjetas, gradientes decorativos o colores sin significado funcional.
- Densidad orientada al trabajo: formulario de alta visible, resumen de contadores, búsqueda y filtros en la misma vista, y tareas escaneables mediante etiquetas compactas.
- Estados claramente diferenciados: tarea completada con tachado y menor contraste, vencimiento atrasado con alerta coral, estado vacío útil y notificaciones breves para confirmar acciones.
- Responsive real: el escritorio usa formulario y lista en dos columnas; en pantallas estrechas se apilan, los controles se reorganizan y las acciones siguen siendo accesibles por teclado.
- Mantener accesibilidad y foco visible. Los botones iconográficos deben conservar nombre accesible y tooltip; no sustituir el significado por decoración.

No convertir esta guía en una plantilla rígida: conservar la intención, el contraste, la jerarquía y la ergonomía aunque cambie la tecnología de estilos.

## Arquitectura

Mantener separación clara de responsabilidades y dependencias unidireccionales:

```text
backend/
├── TaskFlow.Api              # endpoints, HTTP, OpenAPI y composición
├── TaskFlow.Application      # casos de uso, DTOs, validación y contratos
├── TaskFlow.Domain           # entidades y reglas de negocio
└── TaskFlow.Infrastructure   # EF Core, SQLite y persistencia

frontend/
├── src                      # componentes, páginas, formularios y acceso a API
├── public
└── tests
```

- Los endpoints solo coordinan la petición y la respuesta; no contienen lógica de negocio ni acceso directo a EF Core.
- La lógica de negocio vive en `Application` y `Domain`, no en los componentes React ni en la infraestructura.
- `Infrastructure` implementa contratos definidos por capas internas y no debe filtrarse al frontend.
- Usar DTOs para los contratos HTTP; no exponer entidades de EF Core directamente.
- Inyectar dependencias mediante el contenedor; no crear servicios manualmente con `new`.

## Agentes especializados

- `@planificador-apptodolist` analiza peticiones de cambio y genera o actualiza `docs/plan-<slug>.md`.
- El planificador solo puede consultar el repositorio y editar el documento de planificación; no modifica código, pruebas, configuración ni bases de datos.
- Para cada petición, consulta `docs/skills-orquestacion.md` y los `SKILL.md` aplicables, y deja en el plan los skills seleccionados, sus prerrequisitos, artefactos y orden de ejecución posterior.
- El plan debe recoger requisitos, alcance por capas, archivos y símbolos reales, secuencia de implementación, verificación, riesgos, supuestos y fuera de alcance.
- El planificador valida estructura, trazabilidad, secuencia, skills y pruebas del plan antes de presentarlo como `PLAN VALIDADO`. Solo tras la aprobación explícita del usuario y su autorización para crear el issue revalida el archivo y delega la publicación.
- `creador-issue-desde-plan` es un subagente no invocable por el usuario. Recibe la ruta del `docs/plan-*.md`, el estado `PLAN VALIDADO` y la aprobación; crea un único issue de GitHub después de comprobar que no exista un duplicado.

## Modelo y contrato

La entidad `Task` mantiene estos campos: `Id`, `Title`, `Description`, `Priority`, `Category`, `IsCompleted`, `DueDate`, `AssignedUserId`, `CreatedAt` y `UpdatedAt`. `Title` es obligatorio; el resto de campos opcionales u obligatorios debe respetar el PRD.

La entidad `AppUser` (catálogo de usuarios asignables, sin autenticación ni sesiones) mantiene: `Id`, `Name`, `Email` (único) y `Color`. `AssignedUserId` en `Task` es una FK opcional hacia `AppUser`; al eliminar un usuario, sus tareas asignadas quedan sin asignar en lugar de eliminarse.

La API debe conservar estos endpoints y semántica:

- `GET /api/tasks`
- `GET /api/tasks/{id}`
- `POST /api/tasks`
- `PUT /api/tasks/{id}`
- `PATCH /api/tasks/{id}/complete`
- `PATCH /api/tasks/{id}/reopen`
- `PATCH /api/tasks/{id}/assign`
- `DELETE /api/tasks/{id}`
- `GET /api/users`
- `GET /api/users/{id}`
- `POST /api/users`
- `PUT /api/users/{id}`
- `DELETE /api/users/{id}`

Validar todas las entradas y devolver códigos HTTP coherentes y errores consistentes. Mantener nombres de propiedades y rutas en inglés para conservar el contrato del PRD y del MVP; redactar la documentación y los textos de interfaz en castellano.

Nota de alcance: el PRD excluye explícitamente el soporte multiusuario (autenticación, sesiones, roles). El catálogo de `AppUser` es un mecanismo de asignación simple, no un sistema de autenticación; no añadir login, tokens ni aislamiento de datos por usuario salvo petición explícita.

## Convenciones de implementación

- Seguir SOLID y mantener cada clase o componente con una responsabilidad clara.
- Usar `async`/`await` en operaciones de base de datos y llamadas HTTP.
- Preferir consultas proyectadas y operaciones asíncronas de EF Core; evitar cargar datos innecesarios.
- No concatenar SQL ni introducir acceso a datos fuera de `Infrastructure`.
- Mantener la búsqueda y los filtros sin recarga de página.
- Gestionar estados de carga, error, vacío y éxito en la interfaz.
- Pedir confirmación antes de eliminar una tarea.
- Mantener accesibilidad básica: etiquetas asociadas, nombres accesibles para controles iconográficos, foco visible y navegación por teclado.
- No añadir dependencias nuevas si el stack existente resuelve el problema.

## Pruebas y validación

Cada funcionalidad debe incluir pruebas junto con su implementación:

- Casos de éxito, validación y errores para los casos de uso y endpoints.
- Pruebas de componentes y formularios para los flujos del frontend.
- Pruebas end to end para los recorridos principales cuando afecten a varias capas.
- Mantener como objetivo una cobertura mínima del 80%, sin sacrificar la calidad de las aserciones.

Antes de dar una tarea por terminada, ejecutar las pruebas y la compilación o comprobación de tipos aplicable. No iniciar servidores ni aplicaciones automáticamente; dejar que el desarrollador los lance y pruebe localmente.

## Forma de trabajar

- Leer primero el PRD y el código cercano al cambio.
- Hacer cambios pequeños, localizados y compatibles con los contratos existentes.
- No modificar ni eliminar bases de datos, archivos de datos o configuración del usuario sin confirmación explícita.
- No incluir funcionalidades fuera de alcance ni cambios de estilo no relacionados.
- Actualizar la documentación cuando cambie un contrato, una decisión de arquitectura o un flujo de usuario.
- Responder y documentar el trabajo en castellano, manteniendo en inglés los identificadores técnicos y contratos de código.