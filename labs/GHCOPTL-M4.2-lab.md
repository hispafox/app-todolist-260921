# 🧪 Lab M4.2 — Los contratos: el DTO

**Lab versión 1 · Última actualización: 2026-07-06 · Base:** `temario/GHCOPTL-M4.2-los-contratos-dto.md`

En el capítulo has visto, sobre el papel, por qué tu API no debe exponer tus entidades y cómo el DTO resuelve la filtración, el acoplamiento y el over-posting, con tres formas por recurso. Ahora lo construyes tú. Le encargas a GitHub Copilot el skill `dto`, lo invocas para generar los contratos de tus recursos, las lees tú una a una —qué lleva cada forma y qué no—, y ves cómo el controlador queda refactorizado para usar el contrato. Y compruebas, como en 4.1, que el proyecto todavía no compila: falta el servicio que traduce.

---

## En este lab

- **Overview** — qué practicas
- **Punto de partida** — requisitos + tu repositorio + la demo de referencia
- **Ejercicio 1** — Encárgale a GitHub Copilot el skill `dto` y genera los contratos
- **Ejercicio 2** — Lee las tres formas y compáralas
- **Ejercicio 3** — El controlador refactorizado y por qué aún no compila
- **Definition of Done**
- **Comparar con la referencia**
- **Reto opcional** — añade un campo al análisis y regenera
- **Lo que has practicado + puente a 4.3**

---

## Overview

Al terminar este lab sabrás **fabricar el skill de dominio** que genera tus DTOs, **generar los tres contratos por recurso** leyendo las secciones 4 y 5 del análisis, **leer un DTO por lo que lleva y por lo que le falta** (crear, actualizar, responder), y **entender** por qué el controlador refactorizado a DTOs sigue sin compilar: la traducción entre el DTO y la entidad es del servicio, que llega en 4.3. El entregable es una carpeta `Dtos/` real en tu repositorio y un controlador que ya usa el contrato en vez de exponer tus entidades.

El detalle conceptual (por qué no exponer entidades, el over-posting, las reglas del contrato) está en la base del capítulo; este lab es la parte práctica.

> ⏱️ Tiempo estimado: 30–40 min.

---

## Punto de partida

**Requisitos** (los mismos de todo el curso):

- **VS Code** con la **extensión de GitHub Copilot** y una cuenta con acceso al **modo agente**.
- **SDK de .NET 10**, **Node.js**, **Git** y la **GitHub CLI** (`gh`), ya listos de los labs anteriores.

**Trabajas en tu propio repositorio**, el mismo de siempre, en una sola rama. Sigues donde lo dejaste en 4.1: ya tienes tu `docs/analisis-diseño.md` con las siete secciones, tu carpeta `Models/` y tu `Controllers/` con los controladores que devuelven `TodoItem`. Hoy la parte clave son las **secciones 4 y 5** del análisis: el skill `dto` lee de las dos para saber qué campos existen (sección 4) y qué entra y sale por cada endpoint (sección 5).

> 💡 **Tu red de seguridad: la demo del curso.** La solución de referencia está en la demo `AppTodoList-curso`, que clonaste al principio. Cuando termines, abres su rama de este capítulo para comparar, solo para mirar; nunca trabajas dentro de la demo.

---

## Ejercicio 1 — Encárgale a GitHub Copilot el skill `dto` y genera los contratos

*Como cada capa, los DTOs los genera un skill de dominio que lee de la fuente de verdad. Primero le encargas el skill —con el mismo reflejo que usaste con el modelo y el controlador—, y luego lo invocas. Prueba a tu aire distintas formas de describir el encargo.*

### Tarea 1.1 — Descríbele el skill

1. En el **modo agente**, encárgale el skill de los DTOs con el patrón que ya conoces, cuidando la recordatorio de no poner nombres concretos:

   > **«Ayúdame a crear el skill para crear los DTOs de la aplicación según lo que tienes especificado en el readme, en el análisis y en las instrucciones. Recuerda no poner nombres de recurso ni de campos específicos: que lea el modelo y los endpoints del análisis.»**

   - → **Qué esperar:** GitHub Copilot te propone un `SKILL.md` para `.github/skills/dto/`. Fíjate en dos cosas de su descripción: que habla de contratos «de entrada y salida» (la pista de que habrá más de una forma) y que separa «el modelo de dominio de lo que se expone en los endpoints». Lee también sus reglas: sin clave primaria en los DTOs de entrada, sin referencias a entidades, sin validación.

   🔎 **Por qué esa recordatorio.** Es el mismo reflejo de siempre: el skill se escribe genérico. Los nombres concretos —`CrearTareaDto`, `TareaDto`— salen de leer las secciones 4 y 5 del análisis en el momento de generar, no de escribirlos dentro del skill.

### Tarea 1.2 — Genera los DTOs

2. Con el skill listo, pídele que genere los contratos. En clase esto salió con una pregunta muy natural, que además marca el orden de construcción:

   > **«En el proyecto hemos lanzado el análisis, el modelo, y ahora tocaría el dto, ¿no?»**

   - → **Qué esperar:** GitHub Copilot reconoce que la tarea es del skill `dto`, lee las secciones 4 y 5, y crea los ficheros en `Dtos/`, un fichero por recurso: `TareasDtos.cs`, `PlantillasDtos.cs`. Cada uno con sus tres clases: la de crear, la de actualizar y la de respuesta. Y, además, **refactoriza tus controladores** para que usen los DTOs en vez de las entidades.

> 💡 **Pista.** Puede que tu skill `dto` ya exista de antes: lo creaste junto con el del controlador. Si es así, sáltate la tarea 1.1 y ve directo a invocarlo. Lo importante del lab es lo que viene: leer las tres formas y ver el controlador refactorizado.

---

## Ejercicio 2 — Lee las tres formas y compáralas

*La lección se ve mejor en tu propio código que en la teoría. Abre el fichero generado y lee las tres clases comparándolas, porque las diferencias son lo que importa.*

### Tarea 2.1 — Abre `Dtos/TareasDtos.cs`

1. Abre el fichero y ponte a leer las tres clases con ojo crítico, campo a campo:

   - **`CrearTareaDto`** (lo que mandas al crear): fíjate en lo que **no** lleva. Sin `Id` (al crear no existe todavía), sin `IsCompleted` (una tarea nueva no nace hecha), sin `CreatedAt` (esa fecha la pones tú).
   - **`ActualizarTareaDto`** (lo que mandas al modificar): este **sí** lleva `IsCompleted` —actualizar es justo donde quieres marcarla como terminada—, pero ya no lleva `PlantillaId`.
   - **`TareaDto`** (la respuesta): completo. Lleva `Id`, `CreatedAt`, `ProximaFecha`… todo lo que el cliente necesita para mostrar la tarea.

   🔎 **Lee un DTO por lo que le falta.** La forma de cada clase te cuenta, ella sola, lo que su operación permite hacer. Lo que devuelves es generoso; lo que aceptas es estricto. Esa asimetría es la esencia de un buen contrato.

> ⚠️ **Error común.** Si tu GitHub Copilot ha metido `Id` en `CrearTareaDto`, o ha dejado una propiedad de tipo `TodoItem` dentro de un DTO, eso rompe la regla del contrato: el `id` de entrada viene por la ruta, y un DTO no arrastra entidades. Pídele que lo corrija recordándole la regla; es justo el tipo de detalle que este capítulo te enseña a cazar.

---

## Ejercicio 3 — El controlador refactorizado y por qué aún no compila

*El skill no solo creó los DTOs: refactorizó tu controlador. Vas a ver ese cambio y a comprobar, como en 4.1, que el proyecto sigue en rojo, y por qué.*

### Tarea 3.1 — Mira el controlador antes y después

1. Abre `Controllers/TareasController.cs`. Compáralo con cómo estaba al terminar 4.1. Antes, `ObtenerTodos` devolvía una lista de `TodoItem` y `Crear` recibía un `TodoItem`. Ahora, `ObtenerTodos` devuelve una lista de `TareaDto`, y `Crear` recibe un `CrearTareaDto`.

   🔎 **La defensa contra el over-posting, ya en el código.** Fíjate en ese `Crear`: por mucho que un cliente intente colar un `Id` o un `IsCompleted`, el `CrearTareaDto` ni siquiera tiene esos campos. No hay por dónde meterlos. Tu entidad `TodoItem` ya no asoma por la frontera de la API.

### Tarea 3.2 — Compila y lee el error

2. Compila el proyecto:

   ```bash
   dotnet build
   ```

   - → **Qué esperar:** el proyecto **sigue sin compilar del todo**, igual que en 4.1. El controlador recibe un `CrearTareaDto` y tiene que acabar guardando un `TodoItem`; devuelve un `TareaDto` que sale de un `TodoItem`. Entre el DTO y la entidad hay que traducir, en los dos sentidos, y esa traducción todavía no existe: es el trabajo del servicio (`ITodoService`), que aún no está creado.

   ⚠️ **Esto es lo esperado.** No intentes escribir la traducción a mano en el controlador para que compile: eso es materia del servicio, en 4.3, y meterlo aquí sería devolverle al controlador el trabajo que no le toca. Dejar el proyecto en rojo aquí es correcto.

---

## Definition of Done

Este capítulo entrega el contrato de datos —los DTOs y el controlador que los usa—, y lo deja, a propósito, a la espera del servicio. Lo has terminado cuando:

- [ ] Existe el fichero `.github/skills/dto/SKILL.md`, y el skill genera los DTOs **leyendo las secciones 4 y 5 del análisis**, sin nombres de recurso escritos dentro.
- [ ] Existe la carpeta `Dtos/` con `TareasDtos.cs` y `PlantillasDtos.cs`, y cada recurso tiene sus **tres formas** (crear / actualizar / responder).
- [ ] Los DTOs cumplen las reglas: **sin `Id` en los de entrada, sin referencias a entidades, sin `CreatedAt` en la entrada**.
- [ ] El `TareasController` está **refactorizado** para usar `TareaDto`/`CrearTareaDto` en vez de `TodoItem`.
- [ ] `dotnet build` muestra el **error esperado** (falta `ITodoService`), y sabes explicar **por qué**: el servicio, que traduce entre DTO y entidad, llega en 4.3.
- [ ] Sabes explicar, señalando `CrearTareaDto`, **por qué no lleva `Id` ni `IsCompleted`**.

---

## Comparar con la referencia

La solución de referencia de este capítulo está en la demo del curso, `AppTodoList-curso`, en su rama `submodulo-4.2/dto`. La usas solo para mirar; nunca trabajas dentro de la demo.

En tu clon de la demo (la carpeta aparte, no la de tu proyecto):

```bash
cd AppTodoList-curso
git checkout submodulo-4.2/dto
```

Abre su carpeta `Dtos/` y su `Controllers/TareasController.cs`, y ponlos al lado de los tuyos. No busques que sean idénticos palabra por palabra, que tu encargo influye; busca que **las decisiones de fondo coincidan**: tres DTOs por recurso, sin clave primaria en los de entrada, sin entidades dentro, y el controlador usando el contrato. Si a lo tuyo le falta algo, pídele a GitHub Copilot que lo complete.

Cuando termines de mirar, vuelve a tu proyecto y sigue con lo tuyo.

---

## Reto opcional — añade un campo al análisis y regenera

Abre tu `docs/analisis-diseño.md` y añade a una tarea un campo nuevo —por ejemplo, una prioridad—. Luego pídele a GitHub Copilot que regenere los DTOs con el skill `dto`. Comprueba dónde aparece el campo nuevo y dónde no: seguramente en `TareaDto` (la respuesta) y en los DTOs de entrada que tengan sentido, pero razona tú si debería ir en el de crear, en el de actualizar o en los dos. Ese criterio —qué campo va en qué forma— es justo lo que este capítulo te ha enseñado a decidir.

---

## Lo que has practicado

Has fabricado el skill de dominio de los DTOs, has generado los tres contratos por recurso leyendo el análisis, has aprendido a mirar un DTO y decir qué operación describe, y has visto tu controlador refactorizado para trabajar con el contrato en vez de exponer tus entidades. Y te has topado, otra vez, con un proyecto que no compila, pero ahora sabes leer ese rojo: es la señal de la capa que falta debajo.

**Puente a 4.3.** El error de compilación te lo dice: falta `ITodoService`. Tu controlador recibe un `CrearTareaDto` y tiene que guardar un `TodoItem`; devuelve un `TareaDto` que sale de un `TodoItem`. Entre una forma y otra hay que traducir, y eso es el trabajo del servicio. En el capítulo siguiente lo construyes: la capa que orquesta la operación y hace esa traducción explícita, campo a campo. Tienes el contrato; ahora toca construir a quien lo cumple.
