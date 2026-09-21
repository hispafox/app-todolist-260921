# PRD - Aplicación de Gestión de Tareas (TaskFlow)

## 1. Información General

### Nombre del Proyecto

**TaskFlow**

### Versión

**1.0**

### Estado

Borrador inicial

### Objetivo

Desarrollar una aplicación web para la gestión de tareas personales utilizando .NET 10, ASP.NET Core Minimal APIs, React, Vite, TypeScript y SQLite. La aplicación permitirá crear, organizar y realizar el seguimiento de tareas de forma sencilla, rápida y eficiente.

## 2. Problema a Resolver

Las herramientas de gestión de tareas actuales suelen incorporar funcionalidades innecesarias para usuarios que únicamente necesitan organizar sus actividades diarias.

TaskFlow proporcionará una solución:

- Ligera.
- Fácil de usar.
- Rápida.
- Responsive.
- Autohospedable.
- Sin dependencias de servicios externos.

## 3. Usuarios Objetivo

### Usuario Individual

Personas que desean gestionar tareas personales o profesionales.

Necesidades:

- Crear tareas.
- Organizar tareas por categorías.
- Priorizar actividades.
- Visualizar tareas pendientes.
- Marcar tareas como completadas.

### Usuario Técnico

Desarrolladores y estudiantes que quieran desplegar o personalizar la aplicación localmente y utilizarla como referencia para aprender .NET 10, React, Vite, SQLite y Entity Framework Core.

## 4. Objetivos del Producto

### Objetivos Principales

- Permitir la gestión completa de tareas.
- Facilitar el seguimiento de actividades pendientes.
- Ofrecer una experiencia rápida y responsive.
- Mantener una arquitectura simple, desacoplada y mantenible.
- Garantizar la persistencia local de la información.

### Objetivos Secundarios

Servir como proyecto de referencia para el aprendizaje de:

- .NET 10.
- ASP.NET Core Minimal APIs.
- React.
- Vite.
- TypeScript.
- SQLite.
- Entity Framework Core.

## 5. Alcance de la Versión 1

### Funcionalidades Incluidas

#### Gestión de Tareas

- Crear tareas.
- Editar tareas.
- Eliminar tareas.
- Marcar tareas como completadas.
- Reabrir tareas completadas.

#### Organización

- Asignar prioridad baja, media o alta.
- Crear y asignar categorías personalizadas.
- Establecer una fecha de vencimiento opcional.

#### Búsqueda y Filtros

- Buscar por título y descripción.
- Filtrar por estado: todas, pendientes o completadas.
- Filtrar por prioridad.
- Filtrar por categoría.
- Actualizar los resultados inmediatamente y sin recargar la página.

#### Persistencia

- Almacenar la información en una base de datos SQLite.

### Fuera de Alcance

Las siguientes funcionalidades no forman parte de la versión inicial:

- Multiusuario.
- Autenticación o inicio de sesión.
- OAuth.
- Microsoft Entra ID.
- Notificaciones push.
- Integración con Outlook.
- Integración con Microsoft To Do.
- Aplicación móvil nativa.
- Modo offline avanzado.
- Compartición de tareas.

## 6. Historias de Usuario

### HU-001 - Crear Tarea

**Como usuario**, quiero crear una tarea para registrar una actividad pendiente.

#### Criterios de Aceptación

- El título es obligatorio.
- La tarea se almacena en SQLite.
- La tarea aparece inmediatamente en la lista.
- La creación no requiere recargar la página.

### HU-002 - Editar Tarea

**Como usuario**, quiero editar una tarea para actualizar información incorrecta o incompleta.

#### Criterios de Aceptación

- Se pueden modificar todos los campos editables.
- Los cambios se persisten en la base de datos.
- La interfaz refleja los cambios inmediatamente.

### HU-003 - Completar Tarea

**Como usuario**, quiero marcar una tarea como completada para identificar actividades finalizadas.

#### Criterios de Aceptación

- El estado cambia a completado.
- El cambio se almacena en SQLite.
- La interfaz se actualiza automáticamente.

### HU-004 - Reabrir Tarea

**Como usuario**, quiero reabrir una tarea completada para devolverla a la lista de actividades pendientes.

#### Criterios de Aceptación

- El estado cambia a pendiente.
- El cambio se almacena en SQLite.
- La interfaz se actualiza automáticamente.

### HU-005 - Eliminar Tarea

**Como usuario**, quiero eliminar una tarea para retirar actividades que ya no son necesarias.

#### Criterios de Aceptación

- El sistema solicita confirmación antes de eliminar.
- La tarea desaparece de la lista.
- La tarea se elimina de la base de datos.

### HU-006 - Filtrar Tareas

**Como usuario**, quiero filtrar tareas para encontrar información rápidamente.

#### Criterios de Aceptación

- Se puede filtrar por estado.
- Se puede filtrar por prioridad.
- Se puede filtrar por categoría.
- Los resultados aparecen inmediatamente y sin recarga.

### HU-007 - Buscar Tareas

**Como usuario**, quiero buscar tareas por texto para localizar tareas específicas.

#### Criterios de Aceptación

- La búsqueda contempla el título.
- La búsqueda contempla la descripción.
- Los resultados se actualizan instantáneamente.

## 7. Requisitos Funcionales

| Identificador | Requisito |
|---|---|
| RF-001 | El sistema deberá permitir crear tareas. |
| RF-002 | El sistema deberá permitir editar tareas existentes. |
| RF-003 | El sistema deberá permitir eliminar tareas con confirmación. |
| RF-004 | El sistema deberá permitir marcar tareas como completadas. |
| RF-005 | El sistema deberá permitir reabrir tareas completadas. |
| RF-006 | El sistema deberá permitir buscar tareas por título o descripción. |
| RF-007 | El sistema deberá permitir filtrar tareas por estado, prioridad y categoría. |
| RF-008 | El sistema deberá almacenar toda la información en SQLite. |
| RF-009 | El sistema deberá exponer una API REST para las operaciones de tareas. |
| RF-010 | El sistema deberá validar los datos de entrada. |

## 8. Modelo de Datos

### Entidad Task

| Campo | Tipo | Obligatorio |
|---|---|---|
| Id | Integer | Sí |
| Title | String | Sí |
| Description | String | No |
| Priority | Integer | Sí |
| Category | String | No |
| IsCompleted | Boolean | Sí |
| DueDate | DateTime | No |
| CreatedAt | DateTime | Sí |
| UpdatedAt | DateTime | Sí |

### Script SQL Inicial

```sql
CREATE TABLE Tasks
(
        Id INTEGER PRIMARY KEY AUTOINCREMENT,
        Title TEXT NOT NULL,
        Description TEXT,
        Priority INTEGER NOT NULL,
        Category TEXT,
        IsCompleted INTEGER NOT NULL DEFAULT 0,
        DueDate DATETIME,
        CreatedAt DATETIME NOT NULL,
        UpdatedAt DATETIME NOT NULL
);
```

## 9. Arquitectura Técnica

### Frontend

Tecnologías:

- React.
- Vite.
- TypeScript.
- Tailwind CSS v4.
- TanStack Query.
- React Hook Form.
- Zod.

Responsabilidades:

- Renderizar la interfaz.
- Gestionar formularios.
- Validar datos del formulario.
- Comunicarse con la API REST.
- Gestionar filtros y búsquedas.

### Backend

Tecnologías:

- .NET 10.
- ASP.NET Core Minimal APIs.
- Entity Framework Core.
- FluentValidation.
- Swagger / OpenAPI.

Responsabilidades:

- Gestionar las reglas de negocio.
- Validar los datos de entrada.
- Gestionar la persistencia.
- Exponer los endpoints REST.

### Base de Datos

SQLite será responsable de la persistencia local y del almacenamiento de las tareas.

### Estructura Inicial del Proyecto

```text
TaskFlow
├── backend
│   ├── TaskFlow.Api
│   ├── TaskFlow.Application
│   ├── TaskFlow.Domain
│   └── TaskFlow.Infrastructure
└── frontend
        ├── src
        ├── public
        └── tests
```

## 10. API REST

### Obtener todas las tareas

```http
GET /api/tasks
```

Respuesta de ejemplo:

```json
[
    {
        "id": 1,
        "title": "Preparar formación Copilot",
        "isCompleted": false
    }
]
```

### Obtener una tarea

```http
GET /api/tasks/{id}
```

### Crear una tarea

```http
POST /api/tasks
```

Request de ejemplo:

```json
{
    "title": "Preparar formación Copilot",
    "description": "Demo de agentes",
    "priority": 3,
    "category": "Formación"
}
```

### Actualizar una tarea

```http
PUT /api/tasks/{id}
```

### Completar una tarea

```http
PATCH /api/tasks/{id}/complete
```

### Reabrir una tarea

```http
PATCH /api/tasks/{id}/reopen
```

### Eliminar una tarea

```http
DELETE /api/tasks/{id}
```

## 11. Requisitos No Funcionales

### Rendimiento

- El tiempo de respuesta de las operaciones CRUD será inferior a 500 ms en condiciones normales de desarrollo.
- La carga inicial de la aplicación será inferior a 2 segundos.

### Seguridad

- Validación de todas las entradas.
- Protección frente a SQL Injection mediante Entity Framework Core.

### Usabilidad

- Diseño responsive.
- Compatibilidad con escritorio y dispositivos móviles.
- Actualización de listas, filtros y búsquedas sin recargas innecesarias.

### Mantenibilidad

- Arquitectura desacoplada.
- Separación de responsabilidades por capas.
- Aplicación de buenas prácticas SOLID.
- Cobertura mínima de pruebas del 80%.

## 12. Estrategia de Testing

### Backend

- xUnit.
- FluentAssertions.

### Frontend

- Vitest.
- Testing Library.

### End to End

- Playwright.

## 13. Criterios de Éxito

El producto se considerará válido cuando:

- Todas las operaciones CRUD funcionen correctamente.
- Los datos persistan después de reiniciar la aplicación.
- La experiencia sea responsive en escritorio y dispositivos móviles.
- Los filtros funcionen en tiempo real.
- La búsqueda sea instantánea sobre título y descripción.
- La API esté documentada mediante OpenAPI / Swagger.
- Se alcance una cobertura mínima de pruebas del 80%.

## 14. Stack Tecnológico Definitivo

### Frontend

- React.
- Vite.
- TypeScript.
- Tailwind CSS v4.
- TanStack Query.
- React Hook Form.
- Zod.

### Backend

- .NET 10.
- ASP.NET Core Minimal APIs.
- Entity Framework Core.
- SQLite.
- FluentValidation.
- Swagger / OpenAPI.

### Testing

- xUnit.
- FluentAssertions.
- Vitest.
- Testing Library.
- Playwright.

## 15. Roadmap Futuro (V2)

Funcionalidades propuestas:

- Autenticación mediante Microsoft Entra ID.
- Soporte multiusuario.
- Etiquetas (Tags).
- Dashboard con métricas.
- Modo oscuro.
- Notificaciones.
- Docker.
- Despliegue en Azure App Service.
- Migración o integración con Azure SQL.
- Sincronización entre dispositivos.

## Anexo A. Estilos de Documentación

Los siguientes estilos se incluyen para la presentación HTML del contenido documentado:

```css
a {
        text-decoration: none;
        color: #464feb;
}

tr th,
tr td {
        border: 1px solid #e6e6e6;
}

tr th {
        background-color: #f5f5f5;
}
```
