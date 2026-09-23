---
name: frontend-react
description: 'Crea o actualiza el frontend React + Vite + TypeScript de la aplicación. Úsalo cuando quieras crear el proyecto frontend, añadir una página o componente nuevo, crear el servicio de API para un recurso, o configurar el proxy Vite hacia el backend ASP.NET Core.'
argument-hint: 'Recurso o componente a generar (opcional, por defecto: scaffold completo del frontend)'
---

# Skill: Frontend React + Vite + TypeScript

## Cuándo usar este skill

- El usuario pide "crear el frontend", "generar la interfaz", "crear la página de tareas"
- Se quiere añadir un componente, hook o formulario nuevo para un recurso de la API
- Se quiere crear o actualizar el cliente de la API para un recurso
- Se necesita configurar o corregir el proxy Vite → ASP.NET Core

## Prerequisitos

Antes de generar código frontend, verificar que existe:

1. **`ui-ux-pro-max`** — **VALORAR PRIMERO:** antes de implementar componentes, páginas o flujos de usuario, consulta el skill `ui-ux-pro-max` para aplicar patrones de diseño, heurísticas de usabilidad y accesibilidad.
   > **Salida honesta:** si al abrirlo compruebas que solo trae la ficha de catálogo (sin plantillas ni datos), **no te bloquees ni finjas que lo has usado**: sigue adelante aplicando los principios básicos de siempre —claridad, respuesta visible a cada acción, consistencia y accesibilidad— y deja constancia de que el skill no aportó nada.
2. `docs/analisis-diseño.md` — para conocer los endpoints de la API
3. Los DTOs en `backend/src/TaskFlow.Application/<Recurso>/Dtos/` — son la fuente de verdad de los tipos TypeScript

## Arquitectura del frontend (ya scaffolded)

```
frontend/                        ← carpeta raíz del proyecto Vite
├── index.html
├── vite.config.ts               ← proxy hacia el backend ASP.NET Core (HTTPS)
├── tsconfig.json
├── package.json
├── playwright.config.ts
├── e2e/
│   └── tasks.spec.ts            ← tests end to end con Playwright
└── src/
    ├── main.tsx
    ├── App.tsx                  ← orquesta hooks + componentes, sin fetch directo
    ├── types/
    │   ├── task.ts              ← interfaces TypeScript (espejo de los DTOs .NET)
    │   └── user.ts
    ├── schemas/
    │   └── taskFormSchema.ts    ← esquemas Zod para formularios (React Hook Form)
    ├── api/
    │   ├── ApiError.ts          ← clase de error + tipo de problema de validación
    │   ├── tasksApi.ts          ← funciones fetch a /api/tasks
    │   └── usersApi.ts
    ├── hooks/
    │   ├── useTasks.ts          ← useQuery/useMutation de TanStack Query
    │   └── useUsers.ts
    ├── components/
    │   ├── TaskList.tsx, TaskItem.tsx, TaskForm.tsx, TaskToolbar.tsx,
    │   │   TaskStats.tsx, ConfirmDialog.tsx, Toast.tsx, AppHeader.tsx,
    │   │   UserManager.tsx
    │   └── *.test.tsx           ← tests de Vitest + Testing Library junto al componente
    ├── utils/
    └── test/                    ← configuración de Vitest (setup, mocks)
```

**Reglas de diseño:**
- Un fichero de cliente API por recurso en `api/` (`tasksApi.ts`, `usersApi.ts`), con funciones puras exportadas (no clases).
- Un fichero de hooks por recurso en `hooks/` que envuelve el cliente API con `useQuery`/`useMutation` de **TanStack Query**; invalida la query key correspondiente (`invalidateQueries`) tras cada mutación.
- Los componentes reciben datos por props — sin fetch directo en componentes; el fetching vive en los hooks.
- Los formularios usan **React Hook Form** + **Zod** (`schemas/`) para validación en cliente, alineada con las reglas de FluentValidation del backend.
- Los tests de componente (`*.test.tsx`) viven junto al componente que testean, no en una carpeta `__tests__/` separada.
- Texto de la UI en **español** (etiquetas, placeholders, mensajes de error).
- Nombres de ficheros, funciones, tipos y props en **inglés** (convenio estándar de TypeScript/React).

---

## Procedimiento

### Paso 1 — Leer el contexto

Leer siempre antes de generar:

- [`docs/analisis-diseño.md`](../../docs/analisis-diseño.md) — sección 4 (modelo) y sección 5 (endpoints)
- Los DTOs `backend/src/TaskFlow.Application/<Recurso>/Dtos/*.cs` del recurso a implementar — para derivar los tipos TypeScript
- [`frontend/vite.config.ts`](../../frontend/vite.config.ts) — para no sobreescribir configuración manual del proxy
- Un recurso ya implementado (`api/tasksApi.ts`, `hooks/useTasks.ts`, `types/task.ts`) como plantilla de estilo

### Paso 2 — Scaffold inicial (solo si `frontend/` no existe)

`frontend/` ya existe en este repositorio con el stack completo (Vite + React 19 + TypeScript + Tailwind v4 + TanStack Query + React Hook Form + Zod). **No volver a crear el proyecto ni reinstalar dependencias** salvo que el usuario indique explícitamente que se ha perdido o se está empezando de cero.

Si excepcionalmente hubiera que scaffoldearlo desde cero, seguir el mismo stack y estructura descritos arriba en vez de la plantilla por defecto de `npm create vite@latest`.

### Paso 3 — Tipos TypeScript

Los tipos van en `frontend/src/types/<recurso>.ts`. Derivan directamente de los DTOs de `TaskFlow.Application/<Recurso>/Dtos/*.cs`:

| Contrato .NET | Tipo/Interface TypeScript |
|---|---|
| `TaskDto` | `Task` (interface) |
| `CreateTaskRequest` | `CreateTaskPayload` |
| `UpdateTaskRequest` | `UpdateTaskPayload` (a menudo `= CreateTaskPayload` si los campos coinciden) |
| `TaskFilterRequest` | `TaskFilters` |
| enum `TaskPriority` | objeto `as const` + tipo derivado (ver `TaskPriority`/`TaskPriorityValue` en `types/task.ts`) |

**Mapeo de tipos C# → TypeScript:**

| C# | TypeScript |
|---|---|
| `int` | `number` |
| `string` | `string` |
| `bool` | `boolean` |
| `DateTime` | `string` (ISO 8601) |
| `int?` | `number \| null` |
| `string?` | `string \| null` |
| `bool?` | `boolean \| null` |
| `DateTime?` | `string \| null` |
| enum numérico (`TaskPriority`) | objeto `as const` con los mismos valores numéricos + tipo `...Value` (ver `types/task.ts`) |

Seguir el patrón exacto de `types/task.ts`: exportar un objeto `as const` para el enum, un tipo `XxxValue` derivado con `(typeof Xxx)[keyof typeof Xxx]`, y las interfaces `Task`, `TaskFilters`, `CreateTaskPayload`, `UpdateTaskPayload`.

### Paso 4 — Cliente de la API (`api/`)

Crear o actualizar `frontend/src/api/<recurso>Api.ts`, siguiendo el patrón de `tasksApi.ts`: usa `fetch` nativo, construye la query string de filtros si aplica, y traduce las respuestas de error (`ValidationProblem` de FluentValidation) a `ApiError` mediante `parseError`.

```typescript
const BASE_URL = '/api/tasks'

export async function fetchTasks(filters: TaskFilters, signal?: AbortSignal): Promise<Task[]> {
  const response = await fetch(`${BASE_URL}${buildQueryString(filters)}`, { signal })
  if (!response.ok) {
    return parseError(response)
  }
  return response.json()
}

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    return parseError(response)
  }
  return response.json()
}
```

Reutilizar `ApiError` y `parseError` de `api/ApiError.ts` — no duplicar el manejo de errores en cada fichero.

### Paso 5 — Hooks de TanStack Query (`hooks/`)

Crear o actualizar `frontend/src/hooks/use<Recurso>.ts`, siguiendo el patrón de `useTasks.ts`: un hook `use<Recurso>s(filters)` con `useQuery`, y un hook `use<Verbo><Recurso>()` por mutación (`useCreateTask`, `useUpdateTask`, `useCompleteTask`, `useReopenTask`…) que invalida la query key del recurso tras `onSuccess`.

```typescript
const TASKS_KEY = 'tasks'

export function useTasks(filters: TaskFilters) {
  return useQuery({
    queryKey: [TASKS_KEY, filters],
    queryFn: ({ signal }) => fetchTasks(filters, signal),
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateTaskPayload) => createTask(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [TASKS_KEY] }),
  })
}
```

### Paso 6 — Schema de validación (Zod) y formulario (React Hook Form)

Si el recurso tiene un formulario de creación/edición, crear o actualizar `frontend/src/schemas/<recurso>FormSchema.ts` con un esquema Zod alineado con las reglas de FluentValidation del backend (mismos límites de longitud, mismos campos obligatorios).

El componente de formulario (`components/<Recurso>Form.tsx`) usa `useForm` de React Hook Form con `zodResolver(schema)`, y su propio test `<Recurso>Form.test.tsx` junto al componente.

### Paso 7 — Componentes

- **Componente lista** (`components/<Recurso>List.tsx`): recibe los datos por props, renderiza la lista, delega acciones (completar, editar, eliminar) a callbacks recibidos por props.
- **Componente item** (`components/<Recurso>Item.tsx`): una fila/tarjeta del recurso, con sus acciones y estados visuales (completada, vencida…).
- **Componente formulario** (`components/<Recurso>Form.tsx`): usa React Hook Form + Zod, expone `onSubmit` por props.
- **`App.tsx`** orquesta: llama a los hooks, pasa datos y callbacks a los componentes. Sin `useState`/`useEffect` de fetching manual — eso ya lo resuelve TanStack Query.

Gestionar siempre los estados de carga, error y vacío que expone `useQuery` (`isLoading`, `isError`, `data`).

### Paso 8 — Configuración del proxy Vite

El proxy redirige `/api/*` al backend ASP.NET Core para evitar problemas de CORS en desarrollo. Ver [`frontend/vite.config.ts`](../../frontend/vite.config.ts).

**Regla clave:** el backend corre en HTTPS con certificado de desarrollo (`https://localhost:5001`); el proxy debe usar esa URL con `secure: false`. Si se apunta a HTTP, el backend redirige con 307 y se pierden headers (incluido `Authorization` si en el futuro hubiera auth).

### Paso 9 — Pruebas

Añadir o actualizar el test del componente (`<Componente>.test.tsx`, Vitest + Testing Library) junto al fichero del componente. Si la feature afecta a un recorrido completo (crear, completar, eliminar…), actualizar `frontend/e2e/tasks.spec.ts` o añadir un test end to end nuevo con Playwright, autocontenido (título único + limpieza al final).

---

## Convenciones de código

- Sin `useState`/`useEffect` para datos remotos — usar los hooks de TanStack Query (`hooks/`).
- Los tipos exportados en `types/<recurso>.ts` se importan con `import type { Task } from '../types/task'`.
- Los clientes de API exportan funciones, no clases: `export async function fetchTasks()`.
- Mensajes de error genéricos en español: "No se pudo cargar la lista de tareas."
- Botones y etiquetas en español: "Crear tarea", "Eliminar", "Guardar cambios".
- Pedir confirmación (`ConfirmDialog.tsx`) antes de eliminar una tarea, según las convenciones del proyecto.
