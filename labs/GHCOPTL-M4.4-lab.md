# 🧪 Lab M4.4 — Las reglas: la lógica de negocio

**Lab versión 1 · Última actualización: 2026-07-06 · Base:** `temario/GHCOPTL-M4.4-las-reglas-logica-negocio.md`

En el capítulo has visto, sobre el papel, cómo la lógica de negocio es la capa que por fin hace el trabajo de verdad: la que habla con la base de datos a través de `AppDbContext` y la que guarda la regla estrella de tu aplicación —que completar una tarea repetitiva cree sola la siguiente—. Ahora la construyes tú. Completas el sistema de skills con el de la lógica, lo invocas para generar tu capa, y abres `TodoLogica` para leer con tus propios ojos las dos cosas que se hacen aquí: el acceso a datos y la regla de la recurrencia. Y compruebas, por tercera vez en el módulo, que el proyecto sigue sin compilar: ahora falta la capa de datos.

---

## En este lab

- **Overview** — qué practicas
- **Punto de partida** — requisitos + tu repositorio + la demo de referencia
- **Ejercicio 1** — Completa el sistema: crea el skill `logica-negocio`
- **Ejercicio 2** — Genera la lógica y léela por dentro
- **Ejercicio 3** — Compila y lee el rojo: falta la capa de datos
- **Definition of Done**
- **Comparar con la referencia**
- **Reto opcional** — añade una operación con regla y regenera
- **Lo que has practicado + puente a 4.5**

---

## Overview

Al terminar este lab habrás **completado el sistema de skills** con el de la lógica de negocio, lo habrás **invocado para generar tu capa** (`LogicaNegocio/`, interfaz e implementación por recurso), y habrás **leído `TodoLogica` por dentro**: el acceso a datos con EF Core (`ToListAsync`, `FindAsync`, `SaveChangesAsync`) y, sobre todo, la regla de la recurrencia en `CompletarAsync`. El entregable es una carpeta `LogicaNegocio/` real en tu repositorio, con las reglas del dominio y el acceso a los datos en su sitio.

El detalle conceptual (por qué la lógica trabaja con entidades, la atomicidad del guardado, la frontera con las validaciones) está en la base del capítulo; este lab es la parte práctica.

> ⏱️ Tiempo estimado: 30–40 min.

---

## Punto de partida

**Requisitos** (los mismos de todo el curso):

- **VS Code** con la **extensión de GitHub Copilot** y una cuenta con acceso al **modo agente**.
- **SDK de .NET 10**, **Node.js**, **Git** y la **GitHub CLI** (`gh`), ya listos de los labs anteriores.

**Trabajas en tu propio repositorio**, el mismo de siempre, en una sola rama. Sigues donde lo dejaste en 4.3: ya tienes tu carpeta `Services/` con el servicio, que delega en un `ITodoLogica` que todavía no existe. También tienes tu `docs/analisis-diseño.md` con las siete secciones. Hoy las secciones clave son la **4** (el modelo, para trabajar con las entidades) y la **5** (las operaciones), que el skill `logica-negocio` lee para saber qué métodos crear.

> 💡 **Tu red de seguridad: la demo del curso.** La solución de referencia está en la demo `AppTodoList-curso`, que clonaste al principio. Cuando termines, abres su rama de este capítulo para comparar, solo para mirar; nunca trabajas dentro de la demo.

---

## Ejercicio 1 — Completa el sistema: crea el skill `logica-negocio`

*En 4.3 descubriste que tus skills se coordinan: el del controlador contaba con el del servicio. Pues la cadena sigue hacia abajo. Tu servicio delega en un `ITodoLogica` —lo viste en su código—, y ese `ITodoLogica` es la lógica de negocio, que todavía no tiene skill. Aquí completas el sistema creándolo. Prueba a tu aire distintas formas de describir el encargo.*

### Tarea 1.1 — Encárgale el skill de la lógica

1. En clase, esta capa salió al hablar de cómo se separan las responsabilidades. La observación fue esta, literal:

   > **«En las aplicaciones que nosotros desarrollamos solemos separar la capa de servicios, la capa de lógica de negocio y la capa de modelo.»**

   Esa es la razón de que la lógica sea su propia capa, con su propio skill. Encárgaselo a GitHub Copilot con el mismo patrón que ya usaste para el modelo, el controlador, el DTO y el servicio:

   > **«Ayúdame a crear el skill para la capa de lógica de negocio, según lo que tienes en el readme, en el análisis y en las instrucciones. Que lea el modelo y las operaciones del análisis; que no ponga nombres de recurso concretos dentro del skill.»**

   - → **Qué esperar:** GitHub Copilot te propone un `SKILL.md` para `.github/skills/logica-negocio/`. Fíjate en su descripción: habla de «las reglas de negocio y el acceso a datos, separadas de la orquestación de servicios». Ahí está la frontera con el capítulo anterior en una frase.

   🔎 **Por qué el mismo reflejo de siempre.** El skill se escribe genérico: los nombres concretos —`TodoLogica`, `CompletarAsync`— salen de leer las secciones 4 y 5 del análisis en el momento de generar, no de escribirlos dentro del skill. Es la misma lección que aprendiste con el modelo: un skill de dominio no guarda el conocimiento del proyecto, lo lee de la fuente de verdad.

### Tarea 1.2 — Lee sus prerrequisitos

2. Antes de generar nada, abre el `SKILL.md` recién creado y mira sus **prerrequisitos**. Pide tres cosas: el análisis, los modelos de `Models/`, y `Data/AppDbContext.cs`, el contexto de datos.

   🔎 **El tercer prerrequisito marca el paso del capítulo.** La lógica necesita un `AppDbContext` para inyectarlo, y ese contexto todavía no existe en tu proyecto —lo construyes en 4.5—. El skill lo sabe: cuando lo invoques, generará la lógica con ese contexto ya escrito en el constructor, dejando marcado que aún falta. Igual que el servicio nombraba una lógica que no existía, la lógica nombrará una base de datos que no existe.

> 💡 **Pista.** Puede que ya tuvieras el skill `logica-negocio` de antes, creado junto a los otros cuando montaste el sistema coordinado. Si es así, sáltate esta tarea y ve directo a invocarlo. Lo importante del lab es leer lo que genera.

---

## Ejercicio 2 — Genera la lógica y léela por dentro

*Con el skill listo, generas la capa. Pero lo que de verdad importa de este lab llega justo después: abrir `TodoLogica` y leer, en tu propio código, las dos cosas que se hacen aquí —el acceso a los datos y la regla de la recurrencia—. Se ve mejor en lo tuyo que en la teoría.*

### Tarea 2.1 — Invoca el skill

1. Con el skill afinado, invócalo por su nombre:

   > **«/logica-negocio»**

   - → **Qué esperar:** GitHub Copilot lee las secciones 4 y 5 del análisis y crea, en la carpeta `LogicaNegocio/`, una interfaz y una implementación por recurso: `ITodoLogica` y `TodoLogica`, `IPlantillaLogica` y `PlantillaLogica`. Cada implementación recibe el `AppDbContext` por constructor. Y deja preparado el registro de esas clases en `Program.cs`, junto a los servicios.

   💡 **Pista.** Fíjate en la interfaz `ITodoLogica`: todos sus métodos hablan el idioma del dominio, entra y sale `TodoItem`, sin rastro de DTOs. Es la interfaz que tu servicio nombraba desde 4.3, la que faltaba.

### Tarea 2.2 — Lee el acceso a los datos

2. Abre `LogicaNegocio/TodoLogica.cs` y mira primero su cabecera y los métodos de lectura. Verás que recibe el `AppDbContext` por constructor y lo guarda en un campo, y que las lecturas son directas: pedir la lista entera con `ToListAsync`, buscar una por su clave con `FindAsync`.

   🔎 **Aquí, y solo aquí, se toca la base de datos.** No hay SQL escrito a mano: describes en C# qué quieres y Entity Framework lo traduce a la consulta. Fíjate también en el método de creación: antes de guardar, sella la fecha de creación con `DateTime.UtcNow` —la hora del servidor, en UTC—. Esa fecha la pone la lógica, no el cliente ni el servicio. Es una regla de dominio, pequeña pero regla.

### Tarea 2.3 — Lee la regla de la recurrencia

3. Ahora ve al método `CompletarAsync`, el corazón del capítulo. Léelo despacio:

   - Busca la tarea; si no está, devuelve `null`.
   - La marca como completada.
   - Y entonces, la condición que lo cambia todo: **si la tarea es repetitiva y tiene recurrencia**, calcula la próxima fecha con `CalcularProximaFecha` (diaria suma un día, semanal siete, mensual un mes) y **crea una tarea nueva** para la siguiente ocurrencia.
   - Un solo `SaveChangesAsync` al final guarda las dos a la vez.

   🔎 **Esto es exactamente lo que el servicio delegaba.** El servicio pedía «complétame la tarea»; el que sabe cómo se completa de verdad —y que eso engendra la siguiente— es esta capa. Fíjate en el `SaveChangesAsync` único: la tarea completada y la que nace se guardan juntas o no se guarda ninguna. Sin estados a medias.

> ⚠️ **Error común.** Si tu GitHub Copilot ha metido la traducción a DTOs aquí, o ha puesto lógica de negocio dentro del servicio en vez de en la lógica, eso rompe la separación de capas. La lógica trabaja **solo con entidades**; la traducción con DTOs es del servicio. Pídele que lo corrija recordándole la regla.

---

## Ejercicio 3 — Compila y lee el rojo: falta la capa de datos

*Como en 4.1, 4.2 y 4.3, vas a comprobar que el proyecto sigue sin compilar. Y, como entonces, ese error tiene una causa limpia: la capa que aún no has puesto debajo. Ya sabes leer ese rojo.*

### Tarea 3.1 — Compila y entiende el error

1. Compila el proyecto:

   ```bash
   dotnet build
   ```

   - → **Qué esperar:** el proyecto **sigue sin compilar**. Tu `TodoLogica` recibe un `AppDbContext` por constructor y lo usa en cada método, pero ese contexto —y su espacio de nombres, `AppTodoList.Data`— todavía no existe. El código menciona un tipo que aún no has creado.

   ⚠️ **Esto es lo esperado.** No intentes crear el `AppDbContext` a mano ahora: es materia de 4.5, con su configuración de EF Core y su migración. Dejar el proyecto en rojo aquí, esperando los cimientos, es correcto. Es el último hueco de la cascada: en cuanto pongas la capa de datos, el proyecto compila por fin.

---

## Definition of Done

Este capítulo entrega la capa de lógica de negocio —las reglas y el acceso a datos— y la deja, a propósito, a la espera de la base de datos. Lo has terminado cuando:

- [ ] Existe el fichero `.github/skills/logica-negocio/SKILL.md`, con su responsabilidad (reglas + acceso a datos) y sus prerrequisitos (análisis, modelos, `AppDbContext`).
- [ ] Existe la carpeta `LogicaNegocio/` con una **interfaz e implementación por recurso** (`ITodoLogica`/`TodoLogica`, `IPlantillaLogica`/`PlantillaLogica`), y su **registro preparado en `Program.cs`**.
- [ ] `TodoLogica` **trabaja solo con entidades** (`TodoItem`), recibe `AppDbContext` por constructor y hace el acceso a datos con EF Core (`ToListAsync`/`FindAsync`/`SaveChangesAsync`).
- [ ] `CompletarAsync` implementa la **regla de la recurrencia**: al completar una tarea repetitiva, crea su siguiente ocurrencia con `CalcularProximaFecha`, y persiste ambas con un **único `SaveChangesAsync`**.
- [ ] `dotnet build` muestra el **error esperado** (falta `AppDbContext`), y sabes explicar **por qué**: la capa de datos llega en 4.5.
- [ ] Sabes explicar, señalando `CompletarAsync`, **por qué la regla está en la lógica** y no en el servicio ni en el controlador.

---

## Comparar con la referencia

La solución de referencia de este capítulo está en la demo del curso, `AppTodoList-curso`, en su rama `submodulo-4.4/logica-negocio`. La usas solo para mirar; nunca trabajas dentro de la demo.

En tu clon de la demo (la carpeta aparte, no la de tu proyecto):

```bash
cd AppTodoList-curso
git checkout submodulo-4.4/logica-negocio
```

Abre su carpeta `LogicaNegocio/` y ponla al lado de la tuya. No busques que sean idénticas palabra por palabra, que tu encargo influye; busca que **las decisiones de fondo coincidan**: la lógica trabaja con entidades y no con DTOs, el acceso a datos se hace aquí, y la regla de la recurrencia en `CompletarAsync` crea la siguiente ocurrencia con un único guardado. Si a lo tuyo le falta algo, pídele a GitHub Copilot que lo complete recordándole la regla.

Cuando termines de mirar, vuelve a tu proyecto y sigue con lo tuyo.

---

## Reto opcional — añade una operación con regla y regenera

Abre tu `docs/analisis-diseño.md` y añade a las tareas una operación nueva con una pequeña regla —por ejemplo, «archivar» una tarea, que la marque como archivada solo si ya está completada—. Luego pídele a GitHub Copilot que regenere la lógica con el skill `logica-negocio`. Comprueba dónde pone la regla: debería estar en `TodoLogica`, tocando la entidad y guardando con `SaveChangesAsync`, no en el servicio ni en el controlador. Ese criterio —qué es una regla de negocio y dónde va— es justo lo que este capítulo te ha entrenado a decidir.

---

## Lo que has practicado

Has completado el sistema de skills con el de la lógica de negocio, has generado tu capa, y has leído en tu `TodoLogica` las dos cosas que hace esta capa: el acceso a los datos con EF Core y la regla de la recurrencia que hace especial tu aplicación. Y te has topado, por tercera vez, con un proyecto que no compila, pero ya lees ese rojo sin inmutarte: es la señal de la última capa que falta debajo.

**Puente a 4.5.** El error te lo dice: falta `AppDbContext`. Tu lógica sabe qué reglas aplicar y qué pedirle a la base de datos, pero esa base de datos todavía no existe. En el capítulo siguiente la construyes: el contexto de EF Core, la migración inicial que crea las tablas y unos datos de ejemplo para arrancar. Y ahí, por primera vez desde 4.1, el proyecto compila y arranca de verdad. Construiste la casa de arriba hacia abajo, del tejado hacia el fondo; ahora pones los cimientos.
