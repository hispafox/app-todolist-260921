# Plan: Fecha prevista de finalización (EstimatedCompletionDate)

## Skill a usar en la implementación
Este cambio (campo nuevo en entidad existente que toca varias capas) encaja con el skill **`nueva-feature`** (`.github/skills/nueva-feature/SKILL.md`). Al ejecutar la implementación, seguir su procedimiento adaptando los nombres de carpeta a la arquitectura real de este repo (no es MVC clásico con Models/Dtos/Controllers, sino capas Domain/Application/Infrastructure/Api):

| Paso del skill | Equivalente real en TaskFlow |
|---|---|
| Paso 1 — Actualizar análisis | `docs/analisis-diseño.md` (Fase 3 de este plan) |
| Paso 2 — Modelo | `TaskFlow.Domain/Entities/TaskItem.cs` (skill `modelo`) |
| Paso 3 — DTOs | `TaskFlow.Application/Tasks/Dtos/*.cs` (skill `dto`) |
| Paso 4 — Base de datos | `TaskFlow.Infrastructure` + migración EF Core (skill `base-de-datos`) |
| Paso 5 — Lógica de negocio | No aplica como carpeta separada aquí: en TaskFlow el mapeo/orquestación vive en `TaskService.cs` (Application), no hay `LogicaNegocio/` como tal |
| Paso 6 — Validaciones | `Validators/*.cs` (FluentValidation, skill `validaciones`) — sin reglas nuevas en este caso |
| Paso 7 — Servicio | `TaskService.cs` (skill `servicio`) |
| Paso 8 — Controlador | `TaskFlow.Api/Tasks/TaskEndpoints.cs` (Minimal API, skill `controlador`) — sin cambios de código, solo pasamanos ya cubierto por el DTO |
| Paso 9 — Frontend | skill `frontend-react` (Fase 2 de este plan) |
| Paso 10 — Compilar y verificar | `dotnet build`/`dotnet test` + `npm run test`/`tsc` (sección Verificación) |
| Paso 11 — Commit | skill `commit-message` al finalizar |

Nota: el skill `nueva-feature` asume `dotnet ef database update` automático; según la memoria de seguridad operacional del usuario, generar la migración pero pedir confirmación antes de aplicar `database update` si toca la BD real con datos existentes.


## Decisiones acordadas con el usuario
- Campo NUEVO y distinto de `DueDate` (vencimiento/deadline). No lo sustituye ni lo modifica.
- Nombre de propiedad: `EstimatedCompletionDate` (backend) / `estimatedCompletionDate` (frontend).
- Sin restricciones de validación adicionales (no se compara con CreatedAt ni con DueDate).
- Sin lógica de alerta de atraso (no hay equivalente a `isOverdue`/"Vencida").
- Se muestra en el formulario de alta/edición y como etiqueta en la tarjeta de tarea.
- Etiqueta UI propuesta: "Fin previsto" (formulario y tarjeta), con estilo neutral (gris), nunca rojo.

## Plantilla de referencia
Se sigue el mismo patrón que `DueDate`, replicado en cada capa. Nuevo campo se añade SIEMPRE al final de la lista de parámetros/propiedades (después de `AssignedUserId`, antes de `now`/timestamps), igual que se hizo al añadir `AssignedUserId` tras `DueDate`.

## Fase 1 — Backend
1. `backend/src/TaskFlow.Domain/Entities/TaskItem.cs`: añadir propiedad `DateTime? EstimatedCompletionDate { get; private set; }`; añadir parámetro `estimatedCompletionDate` al constructor y a `Update()` (después de `assignedUserId`, antes de `now`).
2. `backend/src/TaskFlow.Application/Tasks/Dtos/CreateTaskRequest.cs`, `UpdateTaskRequest.cs`, `TaskDto.cs`: añadir `DateTime? EstimatedCompletionDate` al final del record (tras `AssignedUserId`).
3. `backend/src/TaskFlow.Application/Tasks/TaskMapper.cs`: incluir `task.EstimatedCompletionDate` en `ToDto()`.
4. `backend/src/TaskFlow.Application/Tasks/TaskService.cs`: pasar `request.EstimatedCompletionDate` en `CreateTaskAsync` y `UpdateTaskAsync` al construir/actualizar `TaskItem`.
5. Validadores (`CreateTaskRequestValidator.cs`, `UpdateTaskRequestValidator.cs`): sin regla nueva (nullable, libre), no requiere cambios salvo si se quiere ser explícito.
6. `backend/src/TaskFlow.Api/Tasks/TaskEndpoints.cs`: sin cambios (pasamanos vía DTO ya cubre el nuevo campo).
7. EF Core: configuración `TaskItemConfiguration` no requiere cambios explícitos (nullable por defecto). Generar migración `AgregarFechaPrevistaFinalizacionTareas` con `dotnet ef migrations add AgregarFechaPrevistaFinalizacionTareas --project src/TaskFlow.Infrastructure --startup-project src/TaskFlow.Api --output-dir Persistence/Migrations` (comando verificado en memoria de repo).
8. Tests backend (obligatorios, junto con la feature):
   - `TaskFlow.Application.Tests`: actualizar construcciones de `CreateTaskRequest`/`UpdateTaskRequest` que usan posicionales (añadir el nuevo argumento al final) y añadir un caso que verifique que `EstimatedCompletionDate` se persiste y se mapea correctamente en create/update.
   - `TaskFlow.Api.Tests`: actualizar construcciones de DTOs afectadas; añadir/ajustar aserción de `EstimatedCompletionDate` en un test de creación.
9. *depende de 1-4*: ejecutar `dotnet build` y `dotnet test` en `backend/` para validar.

## Fase 2 — Frontend (*parcialmente paralelo a Fase 1, mismo contrato de nombres*)
1. `frontend/src/types/task.ts`: añadir `estimatedCompletionDate: string | null` en `Task`, `CreateTaskPayload` y `UpdateTaskPayload` (al final, tras `assignedUserId`).
2. `frontend/src/schemas/taskFormSchema.ts`: añadir `estimatedCompletionDate: z.string().optional()`.
3. `frontend/src/utils/taskMapping.ts`:
   - `formToPayload`: convertir `values.estimatedCompletionDate` a ISO o `null` (mismo patrón que `dueDate`).
   - `taskToFormDefaults`: convertir `task?.estimatedCompletionDate` a formato `YYYY-MM-DD` o `''`.
   - Reutilizar `formatDueDate` (renombrar mentalmente a formateador genérico) o añadir alias `formatDate` si se prefiere semántica neutra — **decisión abierta, ver "Further Considerations"**.
   - NO crear ninguna función `isOverdue`-like para este campo.
4. `frontend/src/components/TaskForm.tsx`: añadir input `type="date"` con label "Fin previsto", registrado con RHF (`{...register('estimatedCompletionDate')}`), ubicado junto a "Vencimiento" (misma fila/grid o fila adicional).
5. `frontend/src/components/TaskItem.tsx`: añadir píldora condicional `{task.estimatedCompletionDate && (...)}` con estilo neutral fijo (clase gris `bg-[#f1f4f2] text-[#5d6a6f]`, sin rama de color rojo, sin prefijo "Vencida").
6. `frontend/src/api/tasksApi.ts`: sin cambios de código (el payload ya viaja completo vía `CreateTaskPayload`/`UpdateTaskPayload`), pero verificar que no hay mapeo manual campo a campo que deba tocarse.
7. Tests frontend (obligatorios):
   - `taskMapping.test.ts`: casos de conversión ida/vuelta para `estimatedCompletionDate` (análogos a los de `dueDate`, sin caso de "overdue").
   - `TaskItem.test.tsx`: mocks de `baseTask` deben incluir `estimatedCompletionDate` (null o fecha) para no romper el tipo `Task`; añadir un test que verifique que se muestra la etiqueta "Fin previsto" cuando hay valor y que NO aparece "Vencida" asociada a este campo.
   - `TaskList.test.tsx`, `TaskForm.test.tsx`: actualizar mocks de `Task`/`editingTask` para incluir el nuevo campo (evitar errores de tipo).
8. *depende de 1-6*: ejecutar `npm run test` (Vitest) y `npx tsc -b --noEmit` en `frontend/`.
9. Opcional / bajo prioridad: no se añade cobertura e2e específica (Playwright) porque tampoco existe para `dueDate` actualmente; mantener consistencia y no ampliar alcance salvo petición explícita.

## Fase 3 — Documentación (*depende de Fases 1 y 2 completas*)
1. `docs/analisis-diseño.md`: añadir fila `EstimatedCompletionDate` en la tabla del modelo `Task` y en los DTOs `CreateTaskRequest`/`UpdateTaskRequest`.
2. `docs/documento-funcional-arquitectura.md`: añadir `datetime EstimatedCompletionDate` en el diagrama Mermaid ER de `Task`.
3. `.github/copilot-instructions.md`: actualizar la frase de campos de `Task` (sección "Modelo y contrato") para incluir `EstimatedCompletionDate`.
4. NO modificar `docs/PRD-TaskFlow-Completo.md` (documento de requisitos de referencia del stakeholder) — se documenta como extensión posterior al PRD, no como corrección del mismo.

## Relevant files
- `backend/src/TaskFlow.Domain/Entities/TaskItem.cs`
- `backend/src/TaskFlow.Application/Tasks/Dtos/CreateTaskRequest.cs`
- `backend/src/TaskFlow.Application/Tasks/Dtos/UpdateTaskRequest.cs`
- `backend/src/TaskFlow.Application/Tasks/Dtos/TaskDto.cs`
- `backend/src/TaskFlow.Application/Tasks/TaskMapper.cs`
- `backend/src/TaskFlow.Application/Tasks/TaskService.cs`
- `backend/tests/TaskFlow.Application.Tests/Tasks/CreateTaskRequestValidatorTests.cs` y `TaskServiceTests.cs`
- `backend/tests/TaskFlow.Api.Tests/TaskEndpointsTests.cs`
- `frontend/src/types/task.ts`
- `frontend/src/schemas/taskFormSchema.ts`
- `frontend/src/utils/taskMapping.ts` (+ `taskMapping.test.ts`)
- `frontend/src/components/TaskForm.tsx`
- `frontend/src/components/TaskItem.tsx` (+ `TaskItem.test.tsx`)
- `frontend/src/components/TaskList.test.tsx`, `TaskForm.test.tsx`
- `docs/analisis-diseño.md`, `docs/documento-funcional-arquitectura.md`, `.github/copilot-instructions.md`

## Verificación
1. Backend: `cd backend; dotnet build` y `dotnet test` (deben seguir en verde, con nuevos tests incluidos).
2. Frontend: `cd frontend; npm run test`, `npx tsc -b --noEmit`.
3. Migración EF generada y revisada manualmente (verificar que solo añade la columna esperada, tipo `TEXT` nullable).
4. Revisión manual: crear/editar una tarea con "Fin previsto" en el futuro y en el pasado, confirmar que NUNCA aparece en rojo ni con texto "Vencida" (a diferencia de "Vencimiento").

## Further Considerations
1. ¿Reutilizar `formatDueDate` para formatear `estimatedCompletionDate`, o crear una función `formatDate` genérica y hacer que `formatDueDate` la use internamente? Recomendado: extraer `formatDate(value: string)` genérica en `taskMapping.ts` y que `formatDueDate` sea un alias, evitando duplicar lógica de formato sin tocar el nombre público existente (usado en tests).
2. ¿Ubicación exacta del nuevo input en `TaskForm.tsx`? Recomendado: nueva fila de grid de 2 columnas junto a "Categoría" o debajo de "Vencimiento", para no romper el layout responsive de 2 columnas ya validado visualmente.
