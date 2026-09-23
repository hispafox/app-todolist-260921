---
name: tests-unitarios
description: 'Crea o actualiza las pruebas del proyecto TaskFlow (primer nivel de la pirámide de pruebas). Usa los proyectos xUnit + FluentAssertions ya existentes en backend/tests y Vitest + Testing Library en el frontend; genera tests para servicios, repositorios y endpoints con cobertura de casos normales, edge cases y manejo de errores.'
argument-hint: 'Clase, recurso o capa a testear (opcional, por defecto: genera tests para todo lo que no tenga)'
---

# Skill: Generar Pruebas (xUnit + Vitest + Playwright)

## Cuándo usar este skill

- El usuario pide "crear tests", "generar pruebas unitarias", "añadir tests"
- Se ha implementado una feature nueva y faltan sus tests
- Se quiere mejorar la cobertura de tests del proyecto
- Se ha modificado código existente y hay que actualizar los tests
- Se necesita añadir un test end to end para un recorrido de usuario

## Ámbito de este skill

**Backend (xUnit + FluentAssertions):**
- ✅ Tests de servicios de `TaskFlow.Application` con repositorios simulados (fakes/mocks)
- ✅ Tests de endpoints de `TaskFlow.Api` (`WebApplicationFactory`, ver `TaskFlowApiFactory.cs`)
- ✅ Casos normales, edge cases, validaciones y manejo de errores
- ❌ Tests de integración contra SQLite real, salvo los que ya cubre `TaskFlow.Api.Tests` a través de `WebApplicationFactory`

**Frontend (Vitest + Testing Library):**
- ✅ Tests de componentes y formularios (`*.test.tsx` junto al componente)
- ✅ Tests de hooks si tienen lógica no trivial

**End to end (Playwright):**
- ✅ Recorridos completos de usuario en `frontend/e2e/`, cuando la feature afecta a varias capas a la vez

## Procedimiento

### Paso 1 — Leer el contexto

Leer los siguientes ficheros para entender la estructura del proyecto:

- [`.github/copilot-instructions.md`](../copilot-instructions.md) — convenciones de código
- [`docs/analisis-diseño.md`](../../docs/analisis-diseño.md) — casos de uso y reglas de negocio a cubrir
- **Código a testear**: servicios y repositorios en `backend/src/TaskFlow.Application/` e `backend/src/TaskFlow.Infrastructure/`, endpoints en `backend/src/TaskFlow.Api/`, componentes en `frontend/src/components/`

### Paso 2 — Verificar el proyecto de tests correspondiente

Los proyectos de tests **ya existen** — no crear proyectos nuevos salvo que falte por completo un nivel de pruebas:

- `backend/tests/TaskFlow.Application.Tests/` — xUnit + FluentAssertions, organizado por recurso (`Tasks/`, `Users/`) con `Fakes/` para dobles de prueba de los repositorios.
- `backend/tests/TaskFlow.Api.Tests/` — xUnit + `WebApplicationFactory` (`TaskFlowApiFactory.cs`), un fichero de tests por grupo de endpoints (`TaskEndpointsTests.cs`, `UserEndpointsTests.cs`).
- `frontend/src/**/*.test.tsx` — Vitest + Testing Library, configurado en `frontend/vite.config.ts` (incluye solo `src/**/*.{test,spec}.{ts,tsx}`, excluye `e2e/**`).
- `frontend/e2e/*.spec.ts` — Playwright, configurado en `frontend/playwright.config.ts` (canal `msedge`, sin `webServer`: las apps se arrancan a mano).

Si algún proyecto faltara por completo, crearlo siguiendo la convención de nombre y ubicación de los ya existentes (`backend/tests/TaskFlow.<Capa>.Tests`), y añadirlo a `backend/TaskFlow.slnx`.

### Paso 3 — Identificar qué testear

Si el usuario especificó una clase, recurso o capa concreta (p. ej. "tests para TaskService"), testear solo eso.

Si no especificó, **analizar el código actual** y generar tests para lo que no tenga cobertura, en este orden de prioridad:
1. **Servicios** de `TaskFlow.Application` (`TaskService`, `UserService`) — reglas de negocio y orquestación
2. **Endpoints** de `TaskFlow.Api` — códigos de estado, validación, contrato de respuesta
3. **Componentes** de `frontend/src/components/` sin test
4. **End to end** para recorridos completos sin cobertura

### Paso 4 — Generar los tests de backend

#### Estructura y convenciones (`TaskFlow.Application.Tests`)

```
backend/tests/TaskFlow.Application.Tests/
├── Fakes/                       ← dobles de prueba de I<Recurso>Repository, IDateTimeProvider
├── Tasks/
│   └── TaskServiceTests.cs
└── Users/
    └── UserServiceTests.cs
```

- **Fichero**: `{ClaseTesteada}Tests.cs`
- **Clase de tests**: `{ClaseTesteada}Tests`
- **Métodos de test**: `{MétodoTesteado}_{Escenario}_{ResultadoEsperado}`

Ejemplos:
- `GetTaskByIdAsync_CuandoExiste_DevuelveTaskDto`
- `CreateTaskAsync_ConTituloVacio_LanzaArgumentException`
- `DeleteTaskAsync_ConIdInexistente_DevuelveFalse`

#### Estructura de cada test (patrón AAA)

```csharp
[Fact]
public async Task GetTaskByIdAsync_CuandoExiste_DevuelveTaskDto()
{
    // Arrange
    var repository = new FakeTaskRepository();
    var task = new TaskItem("Test", null, TaskPriority.Medium, null, null, null, DateTime.UtcNow);
    repository.Seed(task);
    var service = new TaskService(repository, new FakeUserRepository(), new FakeDateTimeProvider());

    // Act
    var result = await service.GetTaskByIdAsync(task.Id, CancellationToken.None);

    // Assert
    result.Should().NotBeNull();
    result!.Title.Should().Be("Test");
}
```

**Mockear/simular:**
- `I<Recurso>Repository` — usar los fakes de `Fakes/` si ya existen (más simples de mantener que Moq para este proyecto); si no hay ninguno para el recurso, crear uno siguiendo el mismo patrón.
- `IDateTimeProvider` — fake con una fecha fija para aserciones deterministas.

**Verificar:**
- Mapeo correcto entidad → DTO (`ToDto()`)
- Invocación correcta de los métodos de comportamiento de la entidad (`Complete`, `Reopen`, `Update`, `AssignUser`)
- Manejo de casos `null`/no encontrado
- Propagación de `NotFoundException`/`ConflictException` cuando corresponda

#### Estructura y convenciones (`TaskFlow.Api.Tests`)

```
backend/tests/TaskFlow.Api.Tests/
├── TaskFlowApiFactory.cs        ← WebApplicationFactory<Program> compartida
├── TaskEndpointsTests.cs
└── UserEndpointsTests.cs
```

Usar `TaskFlowApiFactory` (ya existente) para levantar la API en memoria y golpear los endpoints reales con `HttpClient`, verificando código de estado HTTP y forma del cuerpo de respuesta:

```csharp
[Fact]
public async Task CreateTask_ConDatosValidos_Devuelve201()
{
    // Arrange
    var client = _factory.CreateClient();
    var request = new CreateTaskRequest("Nueva tarea", null, 2, null, null, null);

    // Act
    var response = await client.PostAsJsonAsync("/api/tasks", request);

    // Assert
    response.StatusCode.Should().Be(HttpStatusCode.Created);
}
```

#### Casos a cubrir SIEMPRE

Para **cada método público de servicio o endpoint**:

1. **Caso feliz** — entrada válida, resultado esperado
2. **Edge cases** — límites, valores extremos, colecciones vacías
3. **Validaciones** — entrada inválida, `400`/`ValidationProblem` esperado
4. **Null/no encontrado** — `404` cuando aplique
5. **Manejo de errores** — `NotFoundException`/`ConflictException` propagadas al código HTTP correcto

#### Reglas de implementación

- **Nombres de tests, variables y mensajes de assert en castellano**; los identificadores de producción que se referencian (`TaskService`, `TaskDto`…) se mantienen en inglés.
- **Async/await**: todos los tests de métodos async deben ser `async Task`.
- **FluentAssertions**: usar `.Should()` en lugar de `Assert.Equal()`.
- **Un assert por concepto**: si hay múltiples asserts, que sean del mismo concepto lógico.
- **No lógica compleja en tests**: si un test necesita un bucle o condicional, dividirlo en varios tests.

### Paso 5 — Generar los tests de frontend (Vitest + Testing Library)

Crear o actualizar `<Componente>.test.tsx` junto al componente en `frontend/src/components/`, siguiendo el patrón de `TaskForm.test.tsx`, `TaskItem.test.tsx` o `TaskList.test.tsx`:

- Renderizar el componente con `render()` de Testing Library.
- Interactuar con `userEvent` (no `fireEvent` salvo necesidad puntual).
- Aserciones con `screen.getByRole`/`getByLabelText` — priorizar selectores accesibles sobre `data-testid`.
- Mockear los hooks de TanStack Query o las funciones de `api/` según lo que ya haga el test existente del mismo recurso.

### Paso 6 — Generar los tests end to end (Playwright)

Si la feature afecta a un recorrido completo (crear, editar, completar, eliminar…), añadir un test en `frontend/e2e/tasks.spec.ts` o un fichero `.spec.ts` nuevo si es un recurso distinto de tareas.

- Cada test debe ser **autocontenido**: generar un título único (p. ej. con timestamp) y limpiar sus propios datos al final.
- No depender de datos sembrados por otros tests ni del orden de ejecución.

### Paso 7 — Ejecutar los tests

**No arrancar servidores ni aplicaciones** — el desarrollador los lanza manualmente. Ejecutar solo los comandos de test:

```bash
# Backend
cd backend
dotnet test

# Frontend
cd frontend
npm run test
npx tsc -b --noEmit

# End to end (requiere que el desarrollador tenga backend y frontend ya corriendo)
npm run test:e2e
```

**Si fallan tests**:
1. Revisar el código de producción (puede haber un bug real)
2. Ajustar los fakes/mocks (puede que el test no refleje el comportamiento real)
3. Corregir el test (puede que la expectativa sea incorrecta)

**No dar la tarea por terminada con tests en rojo** — el build y los tests deben quedar en verde.

### Paso 8 — Reportar cobertura (opcional)

Si el usuario lo pide, usar `dotnet test /p:CollectCoverage=true` con `coverlet.collector` (ya referenciado en los proyectos de test si aplica) o `npm run test -- --coverage` en el frontend.

Informar al usuario del % de cobertura alcanzado por capa. El objetivo del proyecto es un mínimo del 80%, sin sacrificar la calidad de las aserciones.

### Paso 9 — Confirmar

Informar al usuario:
- Ficheros de tests creados con sus rutas relativas
- Número de tests añadidos por clase o componente
- Resultado de `dotnet test` / `npm run test` (todos pasan / X fallidos)
- % de cobertura si se calculó

Si algún test requiere configuración adicional (p. ej. `WebApplicationFactory` con configuración distinta, mocks de `IDateTimeProvider`), indicarlo explícitamente.

---

## Ejemplos de invocación

```
# Generar todos los tests faltantes
@tests-unitarios

# Tests solo para una clase
@tests-unitarios TaskService

# Tests de toda una capa
@tests-unitarios backend/src/TaskFlow.Application/
@tests-unitarios backend/src/TaskFlow.Infrastructure/Repositories/
```

---

## Notas importantes

- **Tests != documentación**: no escribir tests obvios solo por cobertura. Cada test debe validar un comportamiento específico.
- **Tests frágiles**: evitar dependencias del orden de ejecución, estado compartido, o fechas/horas hardcodeadas.
- **Nomenclatura consistente**: todos los tests del proyecto deben seguir el mismo patrón de nombres.
- **Mocks mínimos**: mockear solo lo necesario. Si algo es trivial (p. ej. un mapper puro), no mockearlo.

---

## Integración con otros skills

Este skill puede ser invocado:
- **Por `nueva-feature`**: al implementar una feature, invoca este skill al final (Paso 11)
- **Por el planificador**: al generar un plan de feature, puede incluir este skill en la lista
- **Manualmente**: cuando se detecta código sin tests o se quiere mejorar la cobertura
