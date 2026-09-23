# Plan de implementación: Alineación de skills con TaskFlow

Estado del plan: PLAN VALIDADO

## Contexto y objetivo

Los skills operativos aún describen la arquitectura heredada `AppTodoList`: `Models/`, `Data/`, `LogicaNegocio/`, `Services/`, `Controllers/`, `TodoItem` y `/api/tareas`. TaskFlow usa una estructura distinta y ya consolidada: entidades en `TaskFlow.Domain`, casos de uso, DTOs y validadores en `TaskFlow.Application`, EF Core y repositorios en `TaskFlow.Infrastructure`, y grupos de Minimal APIs en `TaskFlow.Api`.

El objetivo es alinear los skills y la documentación de orquestación con la implementación real para que guíen futuras features sin introducir capas, rutas, tipos, comandos o repositorios inexistentes.

## Requisitos y criterios de aceptación

- Los skills de backend describen las rutas reales bajo `backend/src/TaskFlow.*` y no proponen crear una arquitectura MVC paralela.
- Los ejemplos usan `TaskItem`, `TaskFlowDbContext`, `TaskPriority`, DTOs `*Request`/`*Dto`, rutas `/api/tasks` y Minimal APIs.
- Los prerrequisitos y artefactos de `modelo`, `dto`, `base-de-datos`, `logica-negocio`, `validaciones`, `servicio`, `controlador` y `nueva-feature` son compatibles entre sí y con las capas reales.
- Las instrucciones de EF Core generan y revisan migraciones, sin aplicar `database update`, instalar herramientas o modificar la base de datos sin autorización explícita.
- `frontend-react` refleja `frontend/src/api`, `hooks`, `types`, `components`, TanStack Query, React Hook Form y Zod ya presentes.
- `tests-unitarios` usa `backend/tests/TaskFlow.Application.Tests`, `backend/tests/TaskFlow.Api.Tests`, Vitest/Testing Library y Playwright según el tipo de prueba.
- `github-flow` descubre `owner` y `repo` desde el remoto de la ejecución, sin valores codificados de `AppTodoList`.
- `docs/skills-orquestacion.md` y `docs/ARQUITECTURA-AGENTES.md` quedan sincronizados con los skills corregidos.
- No permanecen referencias técnicas activas a `AppTodoList`, `TodoItem`, `/api/tareas`, `Models/`, `Data/AppDbContext.cs`, `LogicaNegocio/`, `Services/` ni `Controllers/` en los artefactos actualizados, salvo una excepción histórica documentada.

## Alcance técnico

### Skills de análisis y backend

Modificar `diseño-analisis`, `modelo`, `dto`, `base-de-datos`, `logica-negocio`, `validaciones`, `servicio`, `controlador` y `nueva-feature` para usar las capas Domain/Application/Infrastructure/Api. Se sustituyen rutas, namespaces, contratos y ejemplos obsoletos; no se crean ni mueven componentes de producción.

`modelo` debe señalar `TaskFlow.Domain/Entities` y `TaskFlow.Domain/Enums`. DTOs, mappers, validadores y servicios residirán por recurso en `TaskFlow.Application`; `TaskFlow.Infrastructure` contendrá `TaskFlowDbContext`, configuraciones, repositorios y migraciones; `TaskFlow.Api` expondrá endpoint groups y los registrará en `Program.cs`.

### Frontend, pruebas y flujo GitHub

Modificar `frontend-react`, `tests-unitarios`, `github-flow` y los ejemplos de `commit-message`. El primero seguirá la organización y dependencias actuales del frontend; el segundo utilizará los proyectos existentes; y `github-flow` verificará el remoto dinámicamente antes de llamar a GitHub.

### Documentación de orquestación

Modificar `docs/skills-orquestacion.md` y `docs/ARQUITECTURA-AGENTES.md` para actualizar catálogo, artefactos, tablas, ejemplos y diagramas. Los nombres de agentes se mantienen por compatibilidad de invocación; solo se corrigen las referencias técnicas antiguas.

### Skills aplicables y orden

| Posición | Skill | Motivo | Prerrequisitos | Artefacto esperado |
|---:|---|---|---|---|
| 1 | `actualizar-documentacion` | Auditar y sincronizar skills y documentación de orquestación con la estructura real. | Skills, documentación y `.github/copilot-instructions.md` existentes. | Inventario de discrepancias y documentos coherentes. |

No aplica un skill de generación de capas: la tarea modifica instrucciones operativas, no una feature del producto. Tras editar los `SKILL.md`, se ejecutará `actualizar-documentacion` para comprobar la consistencia final.

## Archivos y símbolos afectados

- `.github/skills/diseño-analisis/SKILL.md`: sustituir `TodoItem` y `/api/tareas` por el modelo y contrato reales.
- `.github/skills/modelo/SKILL.md`: documentar `TaskFlow.Domain/Entities`, enums y entidades con comportamiento como `TaskItem`.
- `.github/skills/dto/SKILL.md`, `.github/skills/validaciones/SKILL.md` y `.github/skills/servicio/SKILL.md`: alinear DTOs, FluentValidation, mappers y servicios de `TaskFlow.Application`.
- `.github/skills/base-de-datos/SKILL.md` y `.github/skills/logica-negocio/SKILL.md`: usar `TaskFlowDbContext`, configuraciones EF, repositorios y migraciones en `TaskFlow.Infrastructure`; retirar actualizaciones automáticas de base de datos.
- `.github/skills/controlador/SKILL.md`: sustituir controllers por grupos de Minimal APIs siguiendo `TaskEndpoints`.
- `.github/skills/nueva-feature/SKILL.md`: recomponer el flujo transversal usando las capas y registros `AddApplication`/`AddInfrastructure` reales.
- `.github/skills/frontend-react/SKILL.md`: actualizar rutas, llamadas API, hooks y tipos según el frontend existente.
- `.github/skills/tests-unitarios/SKILL.md`: usar proyectos y comandos de pruebas reales.
- `.github/skills/github-flow/SKILL.md` y `.github/skills/commit-message/SKILL.md`: eliminar referencias fijas al repositorio y contratos obsoletos.
- `docs/skills-orquestacion.md` y `docs/ARQUITECTURA-AGENTES.md`: sincronizar el flujo, estructura y ejemplos con los skills actualizados.

## Secuencia de implementación

1. Ejecutar `actualizar-documentacion` en modo auditoría y consolidar el inventario de referencias heredadas.
2. Corregir en orden de dependencia `diseño-analisis`, `modelo`, `dto`, `base-de-datos`, `logica-negocio`, `validaciones`, `servicio` y `controlador`.
3. Actualizar `nueva-feature` para orquestar los skills corregidos, las pruebas obligatorias y la documentación posterior.
4. Actualizar `frontend-react` y `tests-unitarios` contra la estructura y herramientas reales.
5. Corregir `github-flow` y los ejemplos de `commit-message`, conservando la detección dinámica del remoto.
6. Sincronizar `docs/skills-orquestacion.md` y `docs/ARQUITECTURA-AGENTES.md`, incluidos sus diagramas y tablas.
7. Reejecutar `actualizar-documentacion`, resolver incoherencias y revalidar el plan de plantillas con los skills ya compatibles.

## Pruebas y verificación

- Verificar que las rutas, namespaces, contratos y comandos descritos por cada skill existen en `backend/` y `frontend/`.
- Buscar en los skills y documentos modificados `AppTodoList`, `TodoItem`, `/api/tareas`, `Models/`, `Data/AppDbContext.cs`, `LogicaNegocio/`, `Services/` y `Controllers/`; revisar manualmente cualquier coincidencia residual.
- Confirmar que `github-flow` no contiene owner ni repositorio fijos y que exige verificar `git remote -v` antes de llamar al MCP de GitHub.
- Confirmar que ningún skill inicia servidores, aplica migraciones, instala dependencias o altera la base de datos sin autorización expresa.
- Ejecutar `git diff --check` y previsualizar los diagramas Mermaid actualizados.
- Revalidar [docs/plan-plantillas-tareas.md](plan-plantillas-tareas.md) usando [docs/flujo-plan-aprobacion-issue.md](flujo-plan-aprobacion-issue.md); la condición de skills debe pasar.

## Riesgos, supuestos y decisiones pendientes

- **Riesgo de alcance:** la alineación debe servir a TaskFlow, no convertirse en un generador universal para otras arquitecturas.
- **Riesgo de inconsistencia:** `nueva-feature` y `docs/skills-orquestacion.md` duplican el flujo de capas; deben actualizarse en la misma entrega.
- **Riesgo de operaciones no deseadas:** las instrucciones heredadas ordenan aplicar migraciones e instalaciones automáticamente; deben quedar bajo control del desarrollador.
- **Supuesto:** TaskFlow conservará la arquitectura documentada en `.github/copilot-instructions.md` durante esta tarea.
- **Pendiente:** decidir después si se renombran agentes que contienen `apptodolist`. No se hará aquí para no romper invocaciones existentes.
- **Pendiente:** `github-flow` puede no disponer de MCP GitHub en todas las sesiones; debe informar el bloqueo sin asumir el repositorio.

## Fuera de alcance

- Implementar plantillas de tareas o modificar código, pruebas, configuración, migraciones o datos de TaskFlow.
- Crear o actualizar issues, ramas, pull requests o commits.
- Cambiar el contrato HTTP existente de tareas o usuarios.
- Renombrar agentes, carpetas de producto o proyectos de la solución.
- Instalar dependencias, iniciar servidores o aplicar migraciones.