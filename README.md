# TaskFlow

Aplicación ligera para gestionar tareas personales. El proyecto sirve como producto de referencia y como laboratorio práctico para construir una aplicación completa con .NET 10, ASP.NET Core Minimal APIs, React, Vite, TypeScript, SQLite y Entity Framework Core.

## Estado actual

El repositorio contiene actualmente un MVP autónomo en [mvp/index.html](mvp/index.html). La demo permite:

- Crear, editar, completar, reabrir y eliminar tareas.
- Asignar prioridad, categoría y fecha de vencimiento.
- Buscar por título o descripción.
- Filtrar por estado, prioridad y categoría.
- Consultar contadores de tareas totales, pendientes y completadas.
- Usar la interfaz en escritorio y móvil.

La demo guarda los datos en `localStorage` con la clave `taskflow-mvp-tasks`. Esta persistencia solo sirve para la demostración; la versión productiva utilizará SQLite mediante la API REST definida en el PRD.

## Probar el MVP

No requiere instalación ni dependencias. Abre [mvp/index.html](mvp/index.html) directamente en un navegador moderno. Los datos se mantienen en el navegador hasta que se borra el almacenamiento local del sitio.

## Dirección visual

El MVP es la referencia visual y de experiencia de usuario para la aplicación real:

- Cabecera editorial en verde petróleo sobre un fondo marfil claro.
- Títulos con serif y controles con sans-serif para separar intención y operación.
- Paleta funcional: teal para acciones principales, menta para acciones secundarias, coral para alertas y ámbar para prioridad media.
- Superficies blancas, bordes suaves y sombras discretas, con una densidad orientada a trabajar y no a decorar.
- Formulario, contadores, búsqueda, filtros y lista de tareas en una única vista de trabajo.
- Estados vacíos, tareas completadas, vencimientos atrasados, foco visible y confirmaciones breves.

La guía completa para conservar esta línea está en [.github/copilot-instructions.md](.github/copilot-instructions.md). Antes de cambiar la interfaz, revisar también la implementación de [mvp/index.html](mvp/index.html).

## Documentación

- [PRD completo](docs/PRD-TaskFlow-Completo.md): objetivos, alcance, historias de usuario, requisitos y contrato funcional.
- [Laboratorios](labs/): ejercicios y etapas de trabajo del proyecto.
- [.github/copilot-instructions.md](.github/copilot-instructions.md): arquitectura, convenciones, pruebas y dirección visual para la implementación asistida.

## Arquitectura objetivo

```text
backend/
├── TaskFlow.Api              # endpoints, HTTP, OpenAPI y composición
├── TaskFlow.Application      # casos de uso, DTOs, validación y contratos
├── TaskFlow.Domain           # entidades y reglas de negocio
└── TaskFlow.Infrastructure   # EF Core, SQLite y persistencia

frontend/
├── src                         # componentes, páginas, formularios y acceso a API
├── public
└── tests
```

La API debe mantener estos recursos principales:

- `GET /api/tasks`
- `GET /api/tasks/{id}`
- `POST /api/tasks`
- `PUT /api/tasks/{id}`
- `PATCH /api/tasks/{id}/complete`
- `PATCH /api/tasks/{id}/reopen`
- `DELETE /api/tasks/{id}`

Los contratos HTTP y las propiedades técnicas se mantienen en inglés; la documentación y los textos visibles de la interfaz se redactan en castellano.

## Fuera de alcance inicial

No se incluyen autenticación, multiusuario, integraciones externas, notificaciones, aplicación móvil nativa ni funcionalidades avanzadas de trabajo offline salvo petición explícita.

## Licencia

Este repositorio es material de demostración y aprendizaje. No se ha definido todavía una licencia de distribución.
