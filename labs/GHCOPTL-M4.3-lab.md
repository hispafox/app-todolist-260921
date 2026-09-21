# 🧪 Lab M4.3 — La orquestación: el servicio

**Lab versión 1 · Última actualización: 2026-07-06 · Base:** `temario/GHCOPTL-M4.3-la-orquestacion-el-servicio.md`

En el capítulo has visto, sobre el papel, quién traduce entre el DTO y la entidad, por qué esa traducción es del servicio y no de nadie más, y cómo el servicio orquesta cada operación sin ejecutarla. Ahora lo construyes tú. Arrancas de una observación real —la misma que en clase dio nombre al módulo— y descubres que tus skills se coordinan. Con eso claro, le encargas a GitHub Copilot el skill `servicio`, lo invocas para generar tu capa de orquestación, y abres `TodoService` para leer con tus ojos la traducción explícita en los dos sentidos y ver cómo delega. Y compruebas, como en 4.1 y 4.2, que el proyecto sigue sin compilar: ahora falta la lógica de negocio.

---

## En este lab

- **Overview** — qué practicas
- **Punto de partida** — requisitos + tu repositorio + la demo de referencia
- **Ejercicio 1** — El descubrimiento: el skill `servicio` que encaja con el del controlador
- **Ejercicio 2** — Genera la capa de servicios y léela por dentro
- **Ejercicio 3** — Compila y lee el rojo: falta la lógica de negocio
- **Definition of Done**
- **Comparar con la referencia**
- **Reto opcional** — cambia una operación en el análisis y regenera
- **Lo que has practicado + puente a 4.4**

---

## Overview

Al terminar este lab habrás **descubierto por qué tus skills se coordinan** —partiendo de la misma observación que surgió en clase—, **fabricado el skill `servicio`** que genera tu capa de orquestación, **generado los servicios** leyendo la sección 5 del análisis, y **leído `TodoService` por dentro** para ver la traducción explícita `new TodoItem` / `MapearADto` en los dos sentidos y la delegación en la lógica de negocio. El entregable es una carpeta `Services/` real en tu repositorio, con una interfaz y una implementación por recurso, y su registro preparado en `Program.cs`.

El detalle conceptual (por qué orquestar y no ejecutar, por qué traduce el servicio, la orquestación de skills) está en la base del capítulo; este lab es la parte práctica.

> ⏱️ Tiempo estimado: 30–40 min.

---

## Punto de partida

**Requisitos** (los mismos de todo el curso):

- **VS Code** con la **extensión de GitHub Copilot** y una cuenta con acceso al **modo agente**.
- **SDK de .NET 10**, **Node.js**, **Git** y la **GitHub CLI** (`gh`), ya listos de los labs anteriores.

**Trabajas en tu propio repositorio**, el mismo de siempre, en una sola rama. Sigues donde lo dejaste en 4.2: ya tienes tu carpeta `Dtos/` con los tres contratos por recurso, y tu controlador refactorizado para hablar DTOs. También tienes tu `docs/analisis-diseño.md` con las siete secciones. Hoy la parte clave es la **sección 5** del análisis: el skill `servicio` la lee para saber qué operaciones existen y crear un método por cada una.

> 💡 **Tu red de seguridad: la demo del curso.** La solución de referencia está en la demo `AppTodoList-curso`, que clonaste al principio. Cuando termines, abres su rama de este capítulo para comparar, solo para mirar; nunca trabajas dentro de la demo.

---

## Ejercicio 1 — El descubrimiento: el skill `servicio` que encaja con el del controlador

*El corazón de este capítulo no es un skill más: es darte cuenta de que tus skills no están sueltos. Y ese descubrimiento arranca de una observación muy concreta. Tu controlador, desde 4.1, llama a un servicio que no existe; en el readme del proyecto hay una referencia a crearlo. Antes de encargar nada, párate en ese hueco, porque es de ahí de donde sale la idea que da nombre al módulo.*

### Tarea 1.1 — Detecta el hueco: el servicio que aún no existe

1. Abre tu `Controllers/TareasController.cs` y fíjate en que menciona un `ITodoService` que todavía no has creado. Ahora, en el **modo agente**, pregúntaselo a GitHub Copilot tal cual lo pensarías —esta es, literal, la observación que surgió en clase—:

   > **«El skill de controladores no crea los servicios, ¿verdad? No debería crearlos, ¿verdad? En el readme hay una referencia a crear los servicios, eso debería ser un skill, ¿verdad? Y además estar coordinado con el skill de controladores.»**

   - → **Qué esperar:** GitHub Copilot te confirma las cuatro cosas: el skill del controlador no crea servicios (ni debe), la separación de responsabilidades es correcta, sí hace falta un skill `servicio` aparte, y sí, ese skill tiene que **encajar** con el del controlador —de hecho, el del controlador ya lo nombra—. Y, con eso claro, te propone crear el `SKILL.md` para `.github/skills/servicio/`.

   🔎 **Por qué esta pregunta vale un capítulo.** Fíjate en lo que acabas de hacer: descubrir una arquitectura, no pedir código. Hasta ahora habías hecho skills sueltos —modelo, controlador, DTO—. Aquí ves que el del controlador **cuenta con** un servicio que aún no existe, y que ese servicio merece su propio skill coordinado con él. Eso es la orquestación de skills, y la acabas de encontrar tú mirando tu propio código.

### Tarea 1.2 — Lee el skill que propone y sus prerrequisitos

2. Antes de generar nada, abre el `SKILL.md` que GitHub Copilot ha creado en `.github/skills/servicio/` y léelo con calma. Fíjate en dos cosas:

   - Su **descripción** fija la responsabilidad: crea «las interfaces e implementaciones de servicios», la capa de orquestación. Traduce y coordina; no persiste ni aplica reglas.
   - Sus **prerrequisitos** cuentan toda la historia de la coordinación: necesita el análisis, el modelo, los **DTOs** (para hablar el idioma del contrato por arriba) y la **lógica de negocio** (para delegar por abajo). El skill sabe con qué capas encaja.

   🔎 **Un prerrequisito es una frontera declarada.** Que el skill `servicio` pida los DTOs y la lógica tiene su razón: deja escrito con quién habla cada capa. Por arriba, el contrato; por abajo, el dominio. El skill lleva en sus prerrequisitos, negro sobre blanco, exactamente lo que la base te contó sobre las fronteras.

---

## Ejercicio 2 — Genera la capa de servicios y léela por dentro

*Con el skill listo, generas la capa. Pero lo que de verdad importa de este lab llega justo después de que aparezca la carpeta `Services/`: abrir el servicio y leer, en tu propio código, la traducción explícita y la delegación que la base te explicó. La lección se ve mejor en lo tuyo que en la teoría.*

### Tarea 2.1 — Invoca el skill

1. Con el skill afinado, invócalo por su nombre:

   > **«/servicio»**

   - → **Qué esperar:** GitHub Copilot lee la sección 5 del análisis y crea, en la carpeta `Services/`, una interfaz y una implementación por recurso: `ITodoService` y `TodoService`, `IPlantillaService` y `PlantillaService`. Cada implementación recibe su lógica de negocio por constructor. Y deja preparado el registro de esos servicios en `Program.cs`, para que la inyección de dependencias los encuentre.

   💡 **Pista.** Puede que ya tuvieras tu skill `servicio` de antes. Si es así, sáltate el Ejercicio 1 y ve directo a invocarlo. Lo importante del lab es lo que viene: leer la traducción y la delegación.

### Tarea 2.2 — Lee el contrato: la interfaz `ITodoService`

2. Abre `Services/ITodoService.cs` y léela entera. Fíjate en un detalle que lo dice todo:

   ```csharp
   public interface ITodoService
   {
       Task<IEnumerable<TareaDto>> ObtenerTodosAsync();
       Task<TareaDto?> ObtenerPorIdAsync(int id);
       Task<TareaDto> CrearAsync(CrearTareaDto dto);
       Task<TareaDto?> ActualizarAsync(int id, ActualizarTareaDto dto);
       Task<bool> EliminarAsync(int id);
       Task<TareaDto?> CompletarAsync(int id);
   }
   ```

   Todo lo que entra y sale son **DTOs**: recibe `CrearTareaDto`, devuelve `TareaDto`. De cara al controlador, el servicio habla solo el idioma del contrato. Y esta es, exactamente, la interfaz que tu controlador nombraba desde 4.1 y que faltaba: `ITodoService`.

### Tarea 2.3 — Lee la implementación: recibe, traduce, delega, traduce

3. Ahora abre `Services/TodoService.cs`, el corazón del capítulo. Busca el método `CrearAsync` y léelo despacio:

   ```csharp
   public async Task<TareaDto> CrearAsync(CrearTareaDto dto)
   {
       var entidad = new TodoItem
       {
           Title = dto.Title,
           EsRepetitiva = dto.EsRepetitiva,
           Recurrencia = dto.Recurrencia,
           PlantillaId = dto.PlantillaId
       };
       var creada = await _logica.CrearAsync(entidad);
       return MapearADto(creada);
   }
   ```

   Están las tres cosas del servicio en un solo método, en orden: **traduce** el DTO a entidad con `new TodoItem`, **delega** el trabajo de verdad en `_logica.CrearAsync`, y **traduce** el resultado de vuelta con `MapearADto`. Recibe, traduce, delega, traduce.

   🔎 **Lo genuino está en `_logica.CrearAsync`.** Guardar la tarea, aplicar las reglas: eso el servicio no lo hace, se lo pide a la lógica de negocio, que es quien sabe. Ni una consulta a la base de datos, ni una regla dentro del servicio. Esa línea es la delegación de la que habla el capítulo, en tu código.

4. Sube un poco y mira el otro sentido de la traducción, el método `MapearADto`:

   ```csharp
   private static TareaDto MapearADto(TodoItem entidad) => new()
   {
       Id = entidad.Id,
       Title = entidad.Title,
       IsCompleted = entidad.IsCompleted,
       CreatedAt = entidad.CreatedAt,
       EsRepetitiva = entidad.EsRepetitiva,
       Recurrencia = entidad.Recurrencia,
       ProximaFecha = entidad.ProximaFecha,
       PlantillaId = entidad.PlantillaId
   };
   ```

   Este va al revés: coge el `TodoItem` que sale de la base de datos y lo convierte en el `TareaDto` completo que el cliente espera. Campo a campo, escrito a mano. Compáralo con el `new TodoItem` de arriba y verás la asimetría del capítulo hecha código: a la entrada solo entran los campos que el `CrearTareaDto` trae —ni `Id`, ni `CreatedAt`, ni `IsCompleted`—; a la salida se devuelve todo.

   💡 **Un método, y los entiendes todos.** Abre `ObtenerTodosAsync`: le pide la lista a la lógica y traduce cada entidad de una pasada, con `entidades.Select(MapearADto)`. Cambia la operación, pero el gesto es idéntico: pedir a la capa de abajo, traducir lo que vuelve. No hace falta que leas los seis métodos con lupa.

---

## Ejercicio 3 — Compila y lee el rojo: falta la lógica de negocio

*Como en 4.1 y en 4.2, vas a comprobar que el proyecto sigue sin compilar. Y, como entonces, ese error tiene una causa limpia: la capa que aún no has puesto debajo. Aprender a leer ese rojo es parte del capítulo.*

### Tarea 3.1 — Compila y entiende el error

1. Compila el proyecto:

   ```bash
   dotnet build
   ```

   - → **Qué esperar:** el proyecto **sigue sin compilar**, igual que en los dos capítulos anteriores. Tu `TodoService` recibe un `ITodoLogica` por constructor y llama a `_logica.CrearAsync`, pero esa interfaz —la lógica de negocio— todavía no existe. El código menciona un tipo que aún no has creado, y por eso no compila.

   ⚠️ **Esto es lo esperado.** No intentes crear la lógica a mano ahora ni meter una consulta a la base de datos dentro del servicio para que compile: eso sería justo el **servicio gordo** que el capítulo te enseña a evitar, y la lógica es materia de 4.4. Dejar el proyecto en rojo aquí, esperando a la capa de debajo, es correcto. Sigues levantando la casa por el tejado, y cada hueco te dice qué toca poner debajo.

---

## Definition of Done

Este capítulo entrega la capa de orquestación —el servicio— y la deja, a propósito, a la espera de la lógica de negocio. Lo has terminado cuando:

- [ ] Existe el fichero `.github/skills/servicio/SKILL.md`, con su responsabilidad de **orquestación** y sus prerrequisitos (análisis, modelo, DTOs, lógica de negocio).
- [ ] Existe la carpeta `Services/` con una **interfaz e implementación por recurso** (`ITodoService`/`TodoService`, `IPlantillaService`/`PlantillaService`), y su **registro preparado en `Program.cs`**.
- [ ] `ITodoService` recibe y devuelve **solo DTOs** de cara al controlador.
- [ ] `TodoService` **traduce en los dos sentidos** (`new TodoItem` a la entrada, `MapearADto` a la salida) y **delega** el trabajo en `_logica`, sin tocar la base de datos ni aplicar reglas.
- [ ] `dotnet build` muestra el **error esperado** (falta `ITodoLogica`), y sabes explicar **por qué**: la lógica de negocio, en la que el servicio delega, llega en 4.4.
- [ ] Sabes explicar, señalando `CrearAsync`, qué es **traducir**, qué es **delegar**, y por qué la traducción es trabajo del servicio y de nadie más.

---

## Comparar con la referencia

La solución de referencia de este capítulo está en la demo del curso, `AppTodoList-curso`, en su rama `submodulo-4.3/servicio`. La usas solo para mirar; nunca trabajas dentro de la demo.

En tu clon de la demo (la carpeta aparte, no la de tu proyecto):

```bash
cd AppTodoList-curso
git checkout submodulo-4.3/servicio
```

Abre su carpeta `Services/` y ponla al lado de la tuya. Fíjate en las **decisiones de fondo** más que en la literalidad —tu encargo influye—: que haya una interfaz y una implementación por recurso, que la interfaz hable solo DTOs, que la implementación traduzca en los dos sentidos y delegue en la lógica, y que no aparezca ni una consulta a la base de datos dentro del servicio. Si a lo tuyo le falta algo, pídele a GitHub Copilot que lo complete recordándole la regla que se saltó.

Cuando termines de mirar, vuelve a tu proyecto y sigue con lo tuyo.

---

## Reto opcional — cambia una operación en el análisis y regenera

Abre tu `docs/analisis-diseño.md` y añade a un recurso una operación nueva —por ejemplo, marcar una tarea como archivada—. Luego pídele a GitHub Copilot que regenere los servicios con el skill `servicio`. Comprueba que aparece un método nuevo en la interfaz y en la implementación, y fíjate en si respeta el patrón: ¿recibe y devuelve DTOs?, ¿traduce y delega?, ¿o se ha colado alguna lógica dentro del servicio? Ese ojo crítico —saber mirar un servicio y decir si sigue fino o se está poniendo gordo— es justo lo que este capítulo te ha entrenado.

---

## Lo que has practicado

Has partido de un hueco en tu propio código —un controlador que llamaba a un servicio inexistente— y de ahí has descubierto que tus skills se coordinan, la idea que vertebra el módulo. Has fabricado el skill `servicio`, has generado tu capa de orquestación, y has leído en tu `TodoService` la traducción explícita en los dos sentidos y la delegación en la lógica de negocio. Y te has topado, por tercera vez, con un proyecto que no compila, pero ahora lees ese rojo sin inmutarte: es la señal de la capa que falta debajo.

**Puente a 4.4.** El error de compilación te lo dice: falta `ITodoLogica`. Tu servicio traduce y coordina, pero el trabajo de verdad —aplicar las reglas, hablar con la base de datos— se lo pide a una capa que todavía no existe: la lógica de negocio. En el capítulo siguiente la construyes, y ahí está el trabajo de fondo que el servicio delegaba: cómo se completa una tarea repetitiva, qué se valida, cómo se accede a los datos. Pusiste el tejado y la planta de en medio; ahora bajas a los cimientos.
