# 🧪 Lab M4.1 — La capa HTTP: el controlador

**Lab versión 1 · Última actualización: 2026-07-05 · Base:** `temario/GHCOPTL-M4.1-la-capa-http-el-controlador.md`

En el capítulo has visto, sobre el papel, cómo se levanta la primera capa de la API —el controlador— con un skill de dominio que lee los endpoints del análisis, y por qué su virtud es lo que **no** hace: una fachada fina que traduce HTTP y delega. Ahora lo construyes tú. Le encargas a GitHub Copilot el skill `controlador`, generas tus controladores y el fichero `.http`, y compruebas de primera mano el aviso honesto del capítulo: el proyecto todavía no compila del todo, porque el controlador llama a partes que aún no existen. Ese hueco no es un fallo: es tu lista para los capítulos siguientes.

---

## En este lab

- **Overview** — qué practicas
- **Punto de partida** — requisitos + tu repositorio + la demo de referencia
- **Ejercicio 1** — Encárgale a GitHub Copilot el skill `controlador`
- **Ejercicio 2** — Genera los controladores y el `.http`, y recórrelos por dentro
- **Ejercicio 3** — El aviso honesto: por qué aún no compila
- **Definition of Done**
- **Comparar con la referencia**
- **Reto opcional** — añade un endpoint al análisis y regenera
- **Lo que has practicado + puente a 4.2**

---

## Overview

Al terminar este lab sabrás **fabricar el skill de dominio** que genera tu capa de presentación, **generar tus controladores** leyendo la sección de endpoints del análisis, **reconocer un controlador fino** (recibe la interfaz del servicio, traduce HTTP, no lleva lógica), y **entender el aviso** de que la fachada llama a un servicio y a unos DTOs que todavía no existen: por qué el proyecto no compila aún y qué te dice eso de lo que viene. El entregable es una carpeta `Controllers/` real en tu repositorio, más el `.http` para probar la API cuando esté completa.

El detalle conceptual (la arquitectura en capas, la regla de oro del controlador fino, el mapeo de verbos y códigos) está en la base del capítulo; este lab es la parte práctica.

> ⏱️ Tiempo estimado: 35–45 min.

---

## Punto de partida

**Requisitos** (los mismos de todo el curso):

- **VS Code** con la **extensión de GitHub Copilot** y una cuenta con acceso al **modo agente**.
- **SDK de .NET 10**, **Node.js**, **Git** y la **GitHub CLI** (`gh`), ya listos de los labs anteriores.

**Trabajas en tu propio repositorio**, el mismo de los capítulos anteriores, en una sola rama. Sigues donde lo dejaste: ya tienes tu `.github/copilot-instructions.md` con las reglas de la casa (del 1.1), tu `docs/analisis-diseño.md` con las siete secciones (del 3.1) y tu carpeta `Models/` generada (del 3.2). Hoy la parte clave es la **sección 5 del análisis**, la tabla de endpoints: de ahí va a leer el skill del controlador.

> 💡 **Si no tienes la sección de endpoints a mano.** El skill `controlador` genera cada ruta a partir de la **sección 5** del análisis. Si tu `docs/analisis-diseño.md` no la tiene detallada, vuelve un momento al capítulo 3.1 y complétala con el skill `diseño-analisis`; necesitas esa tabla (para cada operación: su verbo, su ruta, qué devuelve y qué error da) antes de empezar.

> 💡 **Tu red de seguridad: la demo del curso.** La solución de referencia está en la demo `AppTodoList-curso`, que clonaste al principio. Cuando termines, abres su rama de este capítulo para comparar, solo para mirar; nunca trabajas dentro de la demo.

---

## Ejercicio 1 — Encárgale a GitHub Copilot el skill `controlador`

*Como cada capa de este proyecto, el controlador no se escribe a mano: le encargas a GitHub Copilot un skill de dominio que lo genera leyendo tu análisis. Y aquí repites el reflejo que aprendiste con el modelo, que el skill lea de la fuente de verdad en vez de copiarla, esta vez para otra capa. Prueba a tu aire distintas formas de describir el encargo.*

### Tarea 1.1 — Descríbele el skill

1. En el **modo agente**, encárgale el skill con el prompt de clase, cuidando la coletilla del final:

   > **«Ayúdame a crear el skill para crear controladores según lo que tienes especificado en el readme, en el análisis y en las instrucciones. Recuerda no poner nombres de modelo ni nombres específicos de controladores.»**

   - → **Qué esperar:** GitHub Copilot lee tu análisis, tu `copilot-instructions.md` y el modelo, y te propone un `SKILL.md` para `.github/skills/controlador/`, con su frontmatter y un procedimiento para generar los controladores a partir de los endpoints.

   🔎 **Por qué esa coletilla.** El «no pongas nombres de modelo ni de controladores» es la regla de oro convertida en encargo. Le pides que escriba el skill **genérico**: que no lleve `TareasController` ni `PlantillasController` escritos dentro, sino que los deduzca leyendo la sección 5 del análisis en el momento de generar. Es lo mismo que hiciste con el skill del modelo, ahora para la capa de arriba.

2. Cuando el planteamiento te encaje, dale vía libre para que lo cree (en clase se tecleó, tal cual, en inglés):

   > **«Start implementation»**

   - → **Qué esperar:** GitHub Copilot crea `.github/skills/controlador/SKILL.md`. Ábrelo y míralo por partes: la `description` dice que crea los controladores «a partir de los endpoints definidos en el análisis», y el procedimiento incluye una lista de **prerequisitos** (el análisis, el modelo, los DTOs) y un aviso: si los servicios no existen todavía, los controladores se generan, pero no funcionarán hasta que estén. Guárdate ese aviso, que reaparece en el ejercicio 3.

> 💡 **Pista.** Si tu GitHub Copilot te pregunta por detalles (dónde van los controladores, qué convenciones de respuesta), respóndele con lo que ya sabes del capítulo: en `Controllers/`, un controlador por recurso, verbos y códigos según la sección 5. Cuanto más claro el encargo, más limpio el skill.

---

## Ejercicio 2 — Genera los controladores y el `.http`, y recórrelos por dentro

*El skill ya está. Ahora lo usas para lo que lo creaste: generar tu capa de presentación. Y luego abres un controlador de verdad y lo recorres, porque la lección del capítulo se ve mejor en el código que en la teoría.*

### Tarea 2.1 — Genera la capa de presentación

1. Pídele que cree los controladores, como en clase:

   > **«¿Puedes crear los controladores de la aplicación?»**

   - → **Qué esperar:** GitHub Copilot reconoce que la tarea es del skill `controlador`, lee la sección 5 del análisis, y crea un controlador por recurso en `Controllers/` (`TareasController`, `PlantillasController`). Deja además preparado el registro de servicios en `Program.cs` para cuando existan, y escribe (o actualiza) un fichero `.http` en la raíz con una petición por cada endpoint.

### Tarea 2.2 — Recorre el controlador por dentro

2. Abre `Controllers/TareasController.cs` y léelo despacio. Fíjate en tres cosas concretas:

   - La clase lleva `[ApiController]` y `[Route("api/[controller]")]`, y hereda de `ControllerBase` —no de `Controller`—, porque devuelve datos, no vistas.
   - Recibe un `ITodoService` **por el constructor** y lo guarda en un campo `readonly`. Recibe la **interfaz**, no la clase concreta: el controlador solo conoce el contrato del servicio.
   - Cada método es corto: llama al servicio, y traduce lo que vuelve a un código HTTP (`Ok`, `NotFound`, `CreatedAtAction`, `NoContent`). Ni un cálculo, ni una consulta, ni una regla de negocio.

   🔎 **Por qué esto importa.** Lo que estás viendo es la regla de oro hecha código: el controlador es una fachada fina. Todo lo que **no** contiene, la lógica, es lo que lo mantiene sano. Mira también el método `Completar`: es la operación con más miga de la API y, aun así, el controlador se limita a pedírsela al servicio y traducir el resultado.

3. Abre el fichero `.http` de la raíz. Verás una petición por endpoint, agrupadas por recurso, con el host en una variable arriba y cuerpos JSON con valores de ejemplo realistas.

   💡 **Guárdalo para más tarde.** Ese `.http` es tu contrato de prueba: cuando el proyecto compile y arranque (a partir de los próximos capítulos), abrirás este fichero y, con el botón «Send request» que VS Code pone encima de cada petición, verás la respuesta de tu API sin salir del editor. Hoy todavía no puedes lanzarlo, y enseguida ves por qué, pero ya lo tienes escrito.

---

## Ejercicio 3 — El aviso honesto: por qué aún no compila

*Aquí llega el momento que da sentido a haber empezado por arriba. Vas a compilar, verás que no compila del todo, y entenderás por qué eso era justo lo que tenía que pasar.*

### Tarea 3.1 — Compila y lee los errores

1. Compila el proyecto:

   ```bash
   dotnet build
   ```

   - → **Qué esperar:** el proyecto **no compila del todo**. El compilador se queja con un error del tipo `CS0246` («no se encuentra el tipo o el espacio de nombres») sobre `ITodoService`, la interfaz del servicio. Es lo previsto: el proyecto está justo donde tiene que estar al acabar este capítulo.

   ⚠️ **Esto es lo esperado.** El controlador que acabas de generar llama a un servicio, `ITodoService`, que **todavía no existe** en tu proyecto: lo construyes en el capítulo del servicio (4.3). El propio skill te avisó de ello al terminar, y hasta te sugirió el skill `servicio` como siguiente paso. Has levantado la fachada antes que lo que hay debajo, y por eso el compilador reclama la parte que falta.

2. 🔎 **Fíjate en lo que te está diciendo ese error.** El tipo que el compilador no encuentra, `ITodoService`, es una entrada de tu lista de tareas para lo que viene: te pide construir el servicio (4.3). El controlador, con lo que reclama y no encuentra, te está diciendo en voz alta qué toca construir a continuación. Empezar por la capa de arriba tiene justo esa gracia: al construirla, deja marcada la forma exacta de las que van debajo.

> ⚠️ **Error común.** No caigas en la tentación de «arreglar» el error creando a mano un `ITodoService` improvisado para que compile ya. El servicio tiene su propio capítulo, con sus decisiones (qué orquesta, cómo llama a la lógica de negocio). Dejar el proyecto en rojo aquí es correcto: es el estado real al terminar este capítulo.

---

## Definition of Done

Este capítulo entrega la capa de presentación (los controladores y el skill que los genera), y la deja a propósito **a la espera de las capas de debajo**. Lo has terminado cuando:

- [ ] Existe el fichero `.github/skills/controlador/SKILL.md`, y el skill genera los controladores **leyendo la sección 5 del análisis**, sin nombres de recurso escritos dentro.
- [ ] Existe la carpeta `Controllers/` con un controlador por recurso (`TareasController`, `PlantillasController`), **finos**: reciben la interfaz del servicio por constructor, traducen HTTP y no llevan lógica de negocio.
- [ ] Existe (o se ha actualizado) el fichero `.http` con una petición por endpoint.
- [ ] `dotnet build` muestra el **error esperado** (`CS0246` sobre `ITodoService`), y sabes explicar **por qué**: falta el servicio, que construyes en 4.3.
- [ ] Sabes explicar, señalando un método del controlador, la **regla de oro**: es una fachada fina que traduce HTTP y delega, sin guardar lógica de negocio dentro.

---

## Comparar con la referencia

La solución de referencia de este capítulo está en la demo del curso, `AppTodoList-curso`, en su rama `submodulo-4.1/controlador`. La usas solo para mirar; nunca trabajas dentro de la demo.

En tu clon de la demo (la carpeta aparte, no la de tu proyecto):

```bash
cd AppTodoList-curso
git checkout submodulo-4.1/controlador
```

Abre su `.github/skills/controlador/SKILL.md`, su carpeta `Controllers/` y su `.http`, y ponlos al lado de los tuyos. No busques que sean idénticos palabra por palabra, que tu encargo influye; busca que **las decisiones de fondo coincidan**: que el skill lea los endpoints del análisis en vez de listarlos dentro, que los controladores sean finos y reciban la interfaz del servicio, que los verbos y códigos sigan la sección 5, y que el `.http` tenga su petición por endpoint. Si a lo tuyo le falta algo, pídele a GitHub Copilot que lo complete.

Cuando termines de mirar, vuelve a tu proyecto (la otra carpeta) y sigue con lo tuyo.

---

## Reto opcional — añade un endpoint al análisis y regenera

Abre tu `docs/analisis-diseño.md` y añade a la sección 5 un endpoint nuevo (por ejemplo, una operación para archivar una tarea, `POST /api/tareas/{id}/archivar`). Luego pídele a GitHub Copilot que regenere los controladores con el skill `controlador`. Comprueba que el método nuevo aparece en `TareasController`, sin que tú lo hayas escrito a mano, porque el skill relee la sección 5 cada vez. Es la misma lección del modelo, ahora en la capa HTTP: cambias el diseño en el documento, y el código lo sigue.

---

## Lo que has practicado

Has fabricado el skill de dominio de la capa de presentación, has generado tus controladores leyendo la sección de endpoints del análisis, has diseccionado un controlador fino, viendo la regla de oro hecha código, y te has topado, a propósito, con un proyecto que no compila todavía: la fachada está, falta lo de detrás. Has aprendido a leer ese estado como lo que es: la lista de lo que viene.

**Puente a 4.2.** Fíjate en lo que devuelve tu controlador: tus entidades, tus `TodoItem`, tal cual al exterior. Funciona, pero exponer al mundo las mismas clases con las que tu aplicación se organiza por dentro trae problemas. En el capítulo siguiente construyes los **DTOs**, el contrato de datos que tu API muestra al mundo —distinto de tus entidades—, y refactorizas el controlador para que hable ese contrato. Y el error de compilación que has visto, el servicio que falta, se cierra en el capítulo de después, el 4.3.
