# 🧪 Lab M4.5 — La persistencia: la base de datos

**Lab versión 1 · Última actualización: 2026-07-06 · Base:** `temario/GHCOPTL-M4.5-la-persistencia-base-de-datos.md`

En el capítulo has visto, sobre el papel, cómo la capa de datos —el `AppDbContext` de EF Core, la migración que crea las tablas, el seeder— es la última de la cascada, la que hace que todo compile por fin. Ahora la construyes tú, y vives el momento: encargas la capa de datos a GitHub Copilot, la generas, y por primera vez desde 4.1 le das a `dotnet build` y no hay ni un solo error. Arrancas la aplicación, creas una tarea, cierras, vuelves a abrir, y ahí sigue. Los datos persisten. Este es el lab en el que la aplicación cobra vida.

---

## En este lab

- **Overview** — qué practicas
- **Punto de partida** — requisitos + tu repositorio + la demo de referencia
- **Ejercicio 1** — Genera la capa de datos con el skill `base-de-datos`
- **Ejercicio 2** — El momento: compila, arranca y persiste
- **Definition of Done**
- **Comparar con la referencia**
- **Reto opcional** — añade un campo al modelo y crea una segunda migración
- **Lo que has practicado + puente a 4.6**

---

## Overview

Al terminar este lab habrás **fabricado el skill `base-de-datos`** y lo habrás invocado para generar tu `AppDbContext` con su configuración Fluent API, la migración inicial y el seeder; habrás **afinado el skill para que ejecute las migraciones solo**; y habrás **vivido el instante** en que el proyecto compila y arranca por primera vez desde 4.1, con una tarea que creas por la API y ves persistir en el fichero SQLite. El entregable es una aplicación completa y **funcionando**, de punta a punta.

El detalle conceptual (qué es el `AppDbContext`, code-first, la frontera con las validaciones de 4.6) está en la base del capítulo; este lab es la parte práctica, y la más satisfactoria del módulo.

> ⏱️ Tiempo estimado: 30–45 min.

---

## Punto de partida

**Requisitos** (los mismos de todo el curso):

- **VS Code** con la **extensión de GitHub Copilot** y una cuenta con acceso al **modo agente**.
- **SDK de .NET 10**, **Node.js**, **Git** y la **GitHub CLI** (`gh`), ya listos de los labs anteriores.
- La herramienta de EF Core para las migraciones. Si no la tienes, se instala con `dotnet tool install --global dotnet-ef`.

**Trabajas en tu propio repositorio**, el mismo de siempre, en una sola rama. Sigues donde lo dejaste en 4.4: ya tienes tu carpeta `LogicaNegocio/` con la lógica, que inyecta un `AppDbContext` que todavía no existe —por eso el proyecto no compila—. Ese es, justo, el último hueco que hoy cierras. La sección clave del análisis es la **4**, el modelo de datos: el skill `base-de-datos` la lee para saber qué tablas crear y con qué columnas.

> 💡 **Tu red de seguridad: la demo del curso.** La solución de referencia está en la demo `AppTodoList-curso`, que clonaste al principio. Cuando termines, abres su rama de este capítulo para comparar, solo para mirar; nunca trabajas dentro de la demo.

---

## Ejercicio 1 — Genera la capa de datos con el skill `base-de-datos`

*Es la última capa, la del fondo, y por eso su skill es de los que menos piden: solo el análisis y los modelos. Primero le encargas el skill, luego lo invocas para que genere el `AppDbContext` y la migración, y de paso vives uno de los momentos más bonitos del módulo: le pides que ejecute las migraciones él solo. Prueba a tu aire distintas formas de describir el encargo.*

### Tarea 1.1 — Encárgale el skill de la base de datos

1. En el **modo agente**, encárgale el skill con el mismo patrón que ya usaste para las otras capas:

   > **«Ayúdame a crear el skill para la capa de base de datos, según lo que tienes en el readme, en el análisis y en las instrucciones. Que cree el `AppDbContext` con Entity Framework y SQLite, la configuración de las entidades con Fluent API, el registro en `Program.cs` y las migraciones. Que lea el modelo del análisis; que no ponga nombres de entidad concretos dentro del skill.»**

   - → **Qué esperar:** GitHub Copilot te propone un `SKILL.md` para `.github/skills/base-de-datos/`. Fíjate en su descripción, la más completa del módulo: crea el contexto, configura EF Core con SQLite, aplica la Fluent API, lo registra y genera las migraciones.

   🔎 **Por qué su lista de prerrequisitos es tan corta.** Pide solo el análisis y los modelos, igual que el de los DTOs. Y tiene sentido: la base de datos es la capa del fondo, no se apoya en ninguna capa de arriba —no necesita el servicio, ni la lógica, ni los DTOs para existir—.

### Tarea 1.2 — Invoca el skill

2. Con el skill listo, invócalo por su nombre:

   > **«/base-de-datos»**

   - → **Qué esperar:** GitHub Copilot lee la sección 4 del análisis y crea la carpeta `Data/` con `AppDbContext.cs` —un `DbSet` por tabla y la configuración Fluent API en `OnModelCreating`—, registra el contexto en `Program.cs` con `AddDbContext` y `UseSqlite`, deja la cadena de conexión en `appsettings.json`, y prepara la migración inicial que crea las tablas.

   🔎 **Mira la Fluent API que ha generado.** Abre `Data/AppDbContext.cs` y fíjate en el `OnModelCreating`: el título obligatorio y de 200 caracteres, la fecha con su valor por defecto, y la relación con `OnDelete(DeleteBehavior.SetNull)`. Y fíjate en lo que **no** ha tocado: tu clase `TodoItem` en `Models/` sigue limpia, sin un solo `[Required]`. La forma de la tabla se configura aquí, en el contexto, no en el modelo.

### Tarea 1.3 — Afina el skill: que ejecute las migraciones solo

3. Aquí viene un detalle que quiero que repitas, porque es una idea grande en pequeño. La primera versión del skill se limitaba a **indicarte** los comandos de migración para que los ejecutaras tú. Pero es un paso mecánico que se puede automatizar, así que se lo pides:

   > **«Lo de ejecutar las migraciones, ¿lo puedes poner en el skill para que lo hagas tú automáticamente?»**

   - → **Qué esperar:** GitHub Copilot edita el `SKILL.md` de `base-de-datos` para que, a partir de ahora, ejecute él las migraciones en el terminal —crear la migración y aplicarla— en vez de solo sugerírtelas.

   🔎 **Por qué esto es el círculo virtuoso en pequeño.** Acabas de mejorar una herramienta que tú mismo creaste: detectaste un paso repetitivo y lo metiste dentro del skill. La próxima vez que generes una capa de datos en cualquier proyecto, el skill ya la migrará solo. Afinar tus skills a medida que los usas es una de las ideas grandes del curso; aquí la tocas por primera vez.

---

## Ejercicio 2 — El momento: compila, arranca y persiste

*Este es el ejercicio que llevas esperando cuatro capítulos. Con la capa de datos puesta, el proyecto compila por fin, arranca, y guarda datos de verdad. Tómatelo con calma y saboréalo.*

### Tarea 2.1 — Compila por primera vez

1. Compila el proyecto:

   ```bash
   dotnet build
   ```

   - → **Qué esperar:** **compila. Sin un solo error.** Por primera vez desde 4.1. El `AppDbContext` que la lógica pedía ya existe, y como existe, todo lo que escribiste esperándolo —el controlador, los DTOs, el servicio, la lógica— encaja de golpe.

   💡 **Si el skill ya ejecutó la migración** (lo afinaste en la tarea 1.3), tendrás un fichero de base de datos, `apptodolist.db`, en tu carpeta. Si no, aplícala tú con `dotnet ef migrations add CreacionInicial` y `dotnet ef database update`.

### Tarea 2.2 — Arranca y comprueba que los datos persisten

2. Arranca la aplicación y abre tu fichero `AppTodoList.http`. Crea una tarea con la petición `POST`, y luego pídelas todas con la `GET`:

   - → **Qué esperar:** la tarea que creas recorre la cadena entera —el controlador la recibe como DTO, el servicio la traduce a entidad, la lógica la guarda, y el `AppDbContext` la escribe en el fichero SQLite— y aparece en la respuesta del `GET`. Verás también las tareas de ejemplo que metió el seeder al arrancar.

   🔎 **La prueba definitiva de la persistencia.** Para la aplicación y vuelve a arrancarla. Pide otra vez las tareas con el `GET`: tu tarea sigue ahí. Los datos ya no se quedan solo en memoria; sobreviven al apagado. Eso es persistir, y es lo que acabas de conseguir.

> ⚠️ **Recuerda la frontera con 4.6.** Si mandas una tarea con el título vacío, ahora mismo la aplicación la acepta sin rechistar. Es lo esperado: blindar la entrada es trabajo de las validaciones, y esas llegan en 4.6. Hoy tienes la persistencia; el filtro de la puerta, en el capítulo siguiente.

---

## Definition of Done

Este capítulo cierra el módulo de código: entrega la aplicación completa y funcionando. Lo has terminado cuando:

- [ ] Existe el fichero `.github/skills/base-de-datos/SKILL.md`, y su versión afinada **ejecuta las migraciones** (no solo las sugiere).
- [ ] Existe `Data/AppDbContext.cs` con un **`DbSet` por tabla** y la **configuración Fluent API** en `OnModelCreating` (obligatorios, longitudes, valor por defecto, relación `OnDelete SetNull`).
- [ ] `Program.cs` registra el contexto con **`AddDbContext` + `UseSqlite`**, y existe la cadena de conexión en `appsettings.json`.
- [ ] Existe la carpeta `Migrations/` con la migración inicial, y el fichero `apptodolist.db` con las tablas.
- [ ] **`dotnet build` compila sin errores** —por primera vez desde 4.1—.
- [ ] Arrancas la app, **creas una tarea por la API y persiste**: la ves tras reiniciar.
- [ ] Sabes explicar por qué la configuración de las columnas va en el `AppDbContext`, con las entidades de `Models/` limpias, y en qué se diferencia de las validaciones de entrada de 4.6.

---

## Comparar con la referencia

La solución de referencia de este capítulo está en la demo del curso, `AppTodoList-curso`, en su rama `submodulo-4.5/base-de-datos`. Es la primera rama del módulo que **compila**. La usas solo para mirar; nunca trabajas dentro de la demo.

En tu clon de la demo (la carpeta aparte, no la de tu proyecto):

```bash
cd AppTodoList-curso
git checkout submodulo-4.5/base-de-datos
```

Abre su `Data/AppDbContext.cs` y su `Program.cs` y ponlos al lado de los tuyos. No busques que sean idénticos palabra por palabra, que tu encargo influye; busca que **las decisiones de fondo coincidan**: un `DbSet` por tabla, la Fluent API en el contexto, la relación con `SetNull`, y el registro con `AddDbContext`/`UseSqlite`. Si a lo tuyo le falta algo, pídele a GitHub Copilot que lo complete.

Cuando termines de mirar, vuelve a tu proyecto y sigue con lo tuyo.

---

## Reto opcional — añade un campo al modelo y crea una segunda migración

Abre tu `AppDbContext` o tu modelo y añade un campo nuevo a las tareas —por ejemplo, una prioridad—. Luego pídele a GitHub Copilot que genere una migración para ese cambio, con un nombre descriptivo. Comprueba dos cosas: que la nueva migración se apila **encima** de la inicial, sin tocarla —como un commit más sobre tu esquema—, y que dentro tiene un `Up` que solo añade la columna nueva. Ese es el valor de las migraciones: el esquema evoluciona con su historia, no a golpe de retoques a mano.

---

## Lo que has practicado

Has fabricado el skill de la capa de datos, lo has afinado para que migre solo, y has generado tu `AppDbContext` con su Fluent API y su migración. Y, sobre todo, has vivido el momento que da sentido a todo el módulo: el proyecto compila por primera vez desde 4.1, arranca, y guarda datos que sobreviven al apagado. Tienes una aplicación completa, de cero a guardar datos que persisten, construida capa a capa con skills coordinados.

**Puente a 4.6.** Tu aplicación funciona, pero es confiada: acepta una tarea con el título vacío sin rechistar. Le falta el filtro de la puerta, el que rechaza lo que no cumple las reglas **antes** de que toque la base de datos. En el capítulo siguiente lo pones: las **validaciones de entrada**, que blindan la entrada de tu API. Levantaste la casa entera y la pusiste en marcha; ahora le pones el cerrojo.
