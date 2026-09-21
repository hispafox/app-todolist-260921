# TaskFlow

Aplicación ligera para gestionar tareas personales. El proyecto sirve como producto de referencia y como laboratorio práctico para construir una aplicación completa con .NET 10, ASP.NET Core Minimal APIs, React, Vite, TypeScript, SQLite y Entity Framework Core.

## Estado actual

La aplicación real ya está implementada siguiendo el PRD y las convenciones del proyecto:

- **Backend** (`backend/`): solución .NET 10 con arquitectura por capas (Domain, Application, Infrastructure, Api), Minimal APIs, Entity Framework Core sobre SQLite, validación con FluentValidation y documentación Swagger/OpenAPI.
- **Frontend** (`frontend/`): SPA con React, Vite, TypeScript, Tailwind CSS v4, TanStack Query, React Hook Form y Zod, conectada a la API REST.
- **Pruebas**: xUnit + FluentAssertions en el backend (unitarias e integración) y Vitest + Testing Library en el frontend.

El MVP autónomo original se conserva como referencia visual en [mvp/index.html](mvp/index.html) y usa `localStorage` con la clave `taskflow-mvp-tasks`; no representa la persistencia productiva, que es SQLite mediante la API REST.

## Arrancar la aplicación

Requisitos: .NET 10 SDK y Node.js 22+.

### Backend (`backend/`)

```powershell
cd backend
dotnet restore
dotnet run --project src/TaskFlow.Api
```

La API arranca en `https://localhost:5001`. En desarrollo la documentación interactiva está disponible en dos interfaces sobre el mismo OpenAPI: **Swagger UI** en `/swagger` y **Scalar** en `/scalar`. La base de datos SQLite `taskflow.db` se crea y migra automáticamente al iniciar, con datos de ejemplo si está vacía.

### Frontend (`frontend/`)

```powershell
cd frontend
npm install
npm run dev
```

La SPA arranca en `http://localhost:5173` y usa un proxy de Vite hacia el backend HTTPS (`/api` → `https://localhost:5001`). Arranca primero el backend para que las peticiones funcionen.

### Pruebas

```powershell
# Backend
cd backend
dotnet test

# Frontend (unitarios y de componentes)
cd frontend
npm run test
```

#### Pruebas end to end (Playwright)

Los tests e2e recorren la aplicación completa contra el backend y el frontend reales, así que ambos deben estar en marcha antes de lanzarlos. Se ejecutan sobre Microsoft Edge (canal `msedge`), que ya viene con Windows, por lo que no requieren descargar ningún navegador adicional.

Con el backend (`https://localhost:5001`) y el frontend (`http://localhost:5173`) ya arrancados en otras terminales:

```powershell
cd frontend
npm run test:e2e      # ejecución headless
npm run test:e2e:ui   # modo interactivo con la UI de Playwright
```

Los tests crean tareas con títulos únicos y las eliminan al terminar, por lo que no dejan residuos en la base de datos.

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
