---
name: diseño-analisis
description: 'Genera el documento de análisis y diseño completo del proyecto. Úsalo cuando quieras crear o regenerar el análisis de la aplicación, necesites documentar la arquitectura, diseñar los endpoints de la API, definir el modelo de datos, o producir el documento de diseño inicial del proyecto.'
argument-hint: 'Nombre del fichero de salida (opcional, por defecto: docs/analisis-diseño.md)'
---

# Skill: Diseño y Análisis del Proyecto

## Cuándo usar este skill

- El usuario pide "hacer el análisis", "generar el diseño", "crear el documento de análisis"
- Se quiere documentar la arquitectura antes de empezar a codificar
- Se necesita regenerar o actualizar el documento de diseño

## Procedimiento

### Paso 1 — Leer el contexto del proyecto

Leer los siguientes ficheros para entender el proyecto antes de generar nada:

- [`README.md`](../../README.md) — objetivos y pasos del proyecto
- [`.github/copilot-instructions.md`](../copilot-instructions.md) — stack, convenciones, arquitectura por capas y contrato de la API
- [`docs/PRD-TaskFlow-Completo.md`](../../docs/PRD-TaskFlow-Completo.md) — requisitos funcionales y criterios de aceptación

### Paso 2 — Crear o actualizar el fichero de análisis

Crear o actualizar el fichero `docs/analisis-diseño.md` (crear la carpeta `docs/` si no existe).

El documento debe incluir las siguientes secciones **en este orden**:

#### 1. Objetivo del proyecto
Descripción en 2-3 frases de qué hace la aplicación y para qué sirve.

#### 2. Stack tecnológico
Tabla con cada tecnología, su versión y la razón de su elección. Reflejar el stack real: ASP.NET Core (.NET 10) con Minimal APIs, Entity Framework Core, SQLite, FluentValidation, Swagger/Scalar, React + Vite + TypeScript, Tailwind CSS, TanStack Query, React Hook Form, Zod, xUnit + FluentAssertions, Vitest + Testing Library, Playwright.

#### 3. Arquitectura de capas
Describir la separación real por proyectos, con dependencia unidireccional hacia el exterior:

```text
backend/
├── TaskFlow.Api              # endpoints Minimal API, composición (Program.cs), Swagger/CORS
├── TaskFlow.Application      # casos de uso, DTOs, validadores FluentValidation, contratos de repositorio
├── TaskFlow.Domain           # entidades con comportamiento y enums
└── TaskFlow.Infrastructure   # EF Core, SQLite, repositorios, migraciones

frontend/
├── src                       # componentes, páginas, hooks, api, types, schemas
├── public
└── tests / e2e
```

Detallar la responsabilidad de cada capa (ver secciones 2 y 3 del propio `docs/analisis-diseño.md` existente como referencia de nivel de detalle).

#### 4. Modelo de datos
Definición de cada entidad de `TaskFlow.Domain/Entities/` (por ejemplo `TaskItem`, `AppUser`) con todos sus campos, tipos y descripción, más los enums de `TaskFlow.Domain/Enums/` (`TaskPriority`, `TaskStatusFilter`). Si se identifican entidades adicionales necesarias para una feature nueva, incluirlas también aquí antes de tocar código.

#### 5. Endpoints API REST
Tabla completa de los endpoints de la API, agrupados por recurso:

| Verbo | Ruta | Descripción | Respuesta OK |
|---|---|---|---|
| GET | /api/tasks | Listar tareas (con filtros opcionales) | 200 + array |
| POST | /api/tasks | Crear una tarea | 201 + tarea creada |
| PATCH | /api/tasks/{id}/complete | Completar una tarea | 200 + tarea actualizada |
| ... | ... | ... | ... |

#### 6. Decisiones de diseño
Lista de las decisiones tomadas y su justificación. Ejemplos:
- Por qué SQLite como base de datos embebida
- Por qué Minimal APIs en vez de Controllers
- Por qué FluentValidation en vez de Data Annotations
- Por qué la entidad encapsula su propio comportamiento (`Complete`, `Reopen`, `Update`) en vez de exponer setters públicos

#### 7. Pendientes / Preguntas abiertas
Lista de aspectos no definidos aún que requerirán decisión futura. Recordar que el PRD excluye explícitamente multiusuario, autenticación y notificaciones salvo petición explícita.

### Paso 3 — Confirmar la creación

Informar al usuario de la ruta del fichero generado o actualizado y hacer un resumen de 3-4 líneas con las decisiones de diseño más relevantes.
