# 🧪 Lab M4.6 — Las validaciones

**Lab versión 1 · Última actualización: 2026-07-07 · Base:** `temario/GHCOPTL-M4.6-las-validaciones.md`

En el capítulo has visto, sobre el papel, las dos murallas que le faltaban a tu API: la de fuera, las validaciones de entrada con DataAnnotations en los DTOs, que rechazan una petición mal formada con un `400` automático; y la de dentro, las reglas de guarda en la lógica de negocio, que dependen del estado —no completar dos veces, comprobar que el recurso existe—. Ahora las levantas tú, y las pruebas con tus manos: mandas una tarea con el título vacío y ves el `400`, completas dos veces la misma tarea y ves saltar la excepción de la guarda. Este es el lab en el que tu aplicación deja de creerse todo lo que le cuentan.

---

## En este lab

- **Overview** — qué practicas
- **Punto de partida** — requisitos + tu repositorio + la demo de referencia
- **Ejercicio 1** — Genera las validaciones con el skill `validaciones`
- **Ejercicio 2** — Comprueba las dos murallas con tus manos
- **Definition of Done**
- **Comparar con la referencia**
- **Reto opcional** — provoca un `404` con la comprobación de existencia
- **Lo que has practicado + puente a 4.7**

---

## Overview

Al terminar este lab habrás **fabricado el skill `validaciones`** y lo habrás invocado para que refuerce dos capas que ya tenías: recorre tus DTOs de entrada y les añade las anotaciones (`[Required]`, `[MaxLength(200)]`), y recorre tu lógica de negocio y le añade las reglas de guarda (transición de estado, comprobación de existencia). Después **comprobarás las dos murallas tú mismo**: mandarás un `POST` con el título vacío y verás el `400` con su mensaje, y completarás dos veces la misma tarea para ver saltar la excepción. El entregable es la misma aplicación de 4.5, pero **blindada de fuera a dentro**: sigue compilando y ahora, además, rechaza lo que no cumple.

El detalle conceptual —dónde va cada validación y por qué, la frontera con la Fluent API de 4.5— está en la base del capítulo; este lab es la parte práctica.

> ⏱️ Tiempo estimado: 30–45 min.

---

## Punto de partida

**Requisitos** (los mismos de todo el curso):

- **VS Code** con la **extensión de GitHub Copilot** y una cuenta con acceso al **modo agente**.
- **SDK de .NET 10**, **Node.js**, **Git** y la **GitHub CLI** (`gh`), ya listos de los labs anteriores.

**Trabajas en tu propio repositorio**, el mismo de siempre, en una sola rama. Sigues donde lo dejaste en 4.5: tu aplicación compila, arranca y guarda datos que persisten. Pero es confiada —si le mandas una tarea con el título en blanco, la acepta sin rechistar—, y ese es justo el cabo que hoy cierras.

Fíjate en una cosa antes de empezar, porque explica el skill que vas a crear: **las validaciones refuerzan dos capas que ya tienes**, los DTOs de entrada de 4.2 y la lógica de negocio de 4.4. Por eso el skill `validaciones` tiene esos dos prerrequisitos, y por eso lee dos secciones del análisis: la **sección 4**, las restricciones de cada campo, para las anotaciones de los DTOs; y la **sección 5**, las reglas de negocio por endpoint, para las guardas de la lógica.

> 💡 **Tu red de seguridad: la demo del curso.** La solución de referencia está en la demo `AppTodoList-curso`, que clonaste al principio. Cuando termines, abres su rama de este capítulo para comparar, solo para mirar; nunca trabajas dentro de la demo.

---

## Ejercicio 1 — Genera las validaciones con el skill `validaciones`

*El skill de validaciones es distinto de los que has creado hasta ahora: entra en dos capas que ya existen —los DTOs y la lógica— y las refuerza en la misma pasada. Primero le encargas el skill con el patrón de siempre, luego lo invocas y miras con calma lo que ha tocado. Prueba a tu aire distintas formas de describir el encargo.*

### Tarea 1.1 — Encárgale el skill de las validaciones

1. En el **modo agente**, encárgale el skill con el mismo patrón que ya usaste para las otras capas:

   > **«Ayúdame a crear el skill para las validaciones, según lo que tienes en el readme, en el análisis y en las instrucciones. Que recorra los DTOs de entrada y les ponga las DataAnnotations según las restricciones de la sección 4 del análisis, y que recorra la lógica de negocio y añada las reglas de guarda de la sección 5 —comprobación de existencia y transiciones de estado—. Que lea las reglas del análisis; que no se invente validaciones.»**

   - → **Qué esperar:** GitHub Copilot te propone un `SKILL.md` para `.github/skills/validaciones/`. Fíjate en sus prerrequisitos: los DTOs en `Dtos/` y la lógica en `LogicaNegocio/`. No arranca sin las dos, porque son las dos capas que va a reforzar.

   🔎 **Por qué este skill no crea ninguna carpeta.** Todos los skills anteriores generaban una capa —una carpeta nueva—. Este no: recorre `Dtos/` y `LogicaNegocio/`, que ya existen, y las modifica en la misma pasada. Ahí está la razón de que la validación sea uno de los últimos capítulos del módulo: no puedes blindar unas capas que todavía no has construido.

### Tarea 1.2 — Invoca el skill

2. Con el skill listo, invócalo por su nombre:

   > **«/validaciones»**

   - → **Qué esperar:** GitHub Copilot recorre tus DTOs de entrada y añade las anotaciones sobre los campos, y recorre tu lógica y añade las guardas. Al terminar, tu `CrearTareaDto` tendrá el título anotado así:

     ```csharp
     [Required(ErrorMessage = "El título es obligatorio")]
     [MaxLength(200, ErrorMessage = "El título no puede superar 200 caracteres")]
     public string Title { get; set; } = string.Empty;
     ```

   💡 **Lee las dos anotaciones del título.** `[Required]` frena el campo vacío. Y aquí está lo que resuelve el título en blanco de 4.5: considera inválida también la cadena vacía `""`, no solo el nulo. Y `[MaxLength(200)]` pone el mismo tope de caracteres que fijaste en la Fluent API. Fíjate en el `ErrorMessage` de cada una: es el mensaje que recibe quien manda una petición mal formada, y escribirlo claro es la diferencia entre un cliente que entiende qué corregir y uno que se queda mirando un error genérico.

   🔎 **Mira también la guarda que ha puesto en la lógica.** Abre tu `TodoLogica` y busca el método de completar. Al principio, antes de la lógica de recurrencia, tiene ahora la comprobación de estado:

     ```csharp
     if (tarea.IsCompleted)
         throw new InvalidOperationException("La tarea ya está completada");
     ```

   Esa línea es la que cierra el segundo cabo suelto, el «completar dos veces» que dejaste marcado en 4.4. Y fíjate en lo que **no** ha tocado: tu DTO de salida y tu entidad de `Models/` siguen sin una sola anotación. Las validaciones de entrada solo miran lo que llega de fuera, y por eso van solo en los DTOs de entrada.

---

## Ejercicio 2 — Comprueba las dos murallas con tus manos

*Ya tienes las validaciones puestas; ahora las haces saltar. Este es el ejercicio que convierte «lo he leído» en «lo he visto pasar». Vas a mandar peticiones que antes se colaban y ver cómo ahora rebotan, cada una en su muralla.*

### Tarea 2.1 — La muralla de fuera: el `400` del título vacío

1. Arranca la aplicación y abre tu `AppTodoList.http`. Manda un `POST` para crear una tarea, pero con el título en blanco —una cadena vacía—:

   - → **Qué esperar:** en lugar de crear la tarea, la API te devuelve un **`400 Bad Request`** con el mensaje **«El título es obligatorio»**. Y fíjate en tu `TareasController`: sigue tan fino como en 4.1, sin un solo `if` comprobando el título. El atributo `[ApiController]` valida las anotaciones **antes** de llamar a tu método, y corta ahí mismo. Tú pusiste las etiquetas; la plataforma hace el filtro.

   🔎 **Compara con 4.5.** Esta misma petición, ayer, entraba sin problema y guardaba un título vacío en tu base de datos. Hoy muere en la puerta, antes de tocar ninguna capa de dentro. Eso es la muralla de fuera.

### Tarea 2.2 — La muralla de dentro: la excepción del doble completado

2. Ahora ataca el otro frente. Crea una tarea normal, y complétala con su endpoint. Funciona. Vuelve a completar **la misma tarea**, otra vez:

   - → **Qué esperar:** la segunda vez, la lógica mira el estado real de la tarea, ve que ya estaba completada, y lanza la excepción **«La tarea ya está completada»**, que sube por el servicio y el controlador la traduce en un código de error de cara al cliente. En 4.4, sin esta guarda, la segunda llamada habría creado en silencio una ocurrencia duplicada; hoy la para en seco.

   🔎 **Por qué esta va en la lógica y no en el DTO.** «No completar una tarea ya completada» no se puede comprobar en la puerta: el portero no sabe si esa tarea estaba hecha, porque ese dato no viene en la petición, está guardado dentro. Es una regla con memoria, y por eso va en la capa que puede mirar el estado real.

### Tarea 2.3 — Confirma que todo sigue en pie

3. Vuelve a compilar el proyecto:

   ```bash
   dotnet build
   ```

   - → **Qué esperar:** **compila, sin errores.** No has roto nada: las validaciones se han sumado a las capas que ya tenías, sin tocar su estructura. La aplicación es la misma de 4.5, pero ahora rechaza lo que no cumple.

---

## Definition of Done

Lo has terminado cuando:

- [ ] Existe el fichero `.github/skills/validaciones/SKILL.md`, con sus prerrequisitos: los **DTOs** y la **lógica de negocio**.
- [ ] Tus DTOs de **entrada** (`CrearTareaDto`, `ActualizarTareaDto`) tienen las anotaciones (`[Required]`, `[MaxLength(200)]`) sobre el título, y tu DTO de salida y tu entidad **siguen sin anotaciones**.
- [ ] Tu lógica de negocio tiene la **guarda de transición de estado** (`if (tarea.IsCompleted) throw ...`) al principio del método de completar.
- [ ] Un `POST` con el título vacío devuelve un **`400`** con su mensaje, sin ningún `if` en el controlador.
- [ ] Completar dos veces la misma tarea lanza la **excepción de la guarda** la segunda vez.
- [ ] **`dotnet build` sigue compilando sin errores.**
- [ ] Sabes explicar la diferencia entre una validación que va en el DTO (mira un campo aislado, la aplica la plataforma) y una guarda que va en la lógica (depende del estado, la compruebas contra la base de datos), y por qué ninguna sustituye a la restricción de la tabla de 4.5.

---

## Comparar con la referencia

La solución de referencia de este capítulo está en la demo del curso, `AppTodoList-curso`, en su rama `submodulo-4.6/validaciones`. La usas solo para mirar; nunca trabajas dentro de la demo.

En tu clon de la demo (la carpeta aparte, no la de tu proyecto):

```bash
cd AppTodoList-curso
git checkout submodulo-4.6/validaciones
```

Abre su `Dtos/TareasDtos.cs` y su `LogicaNegocio/TodoLogica.cs` y ponlos al lado de los tuyos. No busques que sean idénticos palabra por palabra, que tu encargo influye; busca que **las decisiones de fondo coincidan**: `[Required]` y `[MaxLength(200)]` sobre el título de los DTOs de entrada, la entidad y el DTO de salida limpios, y la guarda `if (tarea.IsCompleted) throw` al principio de completar. Si a lo tuyo le falta algo, pídele a GitHub Copilot que lo complete.

Cuando termines de mirar, vuelve a tu proyecto y sigue con lo tuyo.

---

## Reto opcional — provoca un `404` con la comprobación de existencia

La tercera regla de la familia de guardas es la comprobación de existencia, la más común de todas: buscas por identificador y, si no hay nada, devuelves `null`, que el servicio traduce en un `404 Not Found`. Provócala: con la app arrancada, pide por su endpoint una tarea con un identificador que no existe —un número grande cualquiera—, o intenta completar esa tarea inexistente. En lugar de reventar con un error feo, la API te responde un `404` limpio. Ese patrón, buscar por `id` y devolver un `404` si no hay nada, va en **todos** los métodos que reciben un identificador; olvidarlo en uno solo es el agujero clásico por el que una petición a un recurso inexistente acaba en un error confuso en vez de un `404` honesto.

---

## Lo que has practicado

Has fabricado el skill de las validaciones, distinto de todos los anteriores porque refuerza dos capas que ya tenías, y lo has invocado para blindar tus DTOs y tu lógica en una sola pasada. Y, sobre todo, has visto las dos murallas funcionar en tu propia máquina: el `400` automático que para el título vacío en la puerta, y la excepción de la guarda que impide completar dos veces. Cierras así los dos cabos que arrastrabas desde 4.4 y 4.5, y te llevas una distinción que usarás en cada API que construyas: una regla que se ve mirando un campo aislado va en el DTO, como anotación; una regla que depende del estado va en la lógica, como guarda.

**Puente a 4.7.** Has construido ocho skills de dominio, uno por capa, y los has visto encajar como un mecanismo. Pero ese mecanismo, ahora mismo, solo existe en tu cabeza. En el capítulo siguiente das un paso atrás y documentas cómo se orquestan todos —el catálogo, el orden, las dependencias, el árbol de decisión—, con diagramas que se leen de un vistazo. Levantaste la casa entera y la aseguraste; ahora dibujas el plano de todo lo que has puesto en pie.
