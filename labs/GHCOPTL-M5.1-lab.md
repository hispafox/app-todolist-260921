# 🧪 Lab M5.1 — Orquestar los skills: `nueva-feature`

**Lab versión 1 · Última actualización: 2026-07-07 · Base:** `temario/GHCOPTL-M5.1-orquestar-los-skills-nueva-feature.md`

En el capítulo has visto, sobre el papel, cómo un skill puede dar un paso arriba y **coordinar a los demás**: le describes una característica en una frase y él recorre la cadena entera, del análisis al commit, ejecutando solo las capas que toca. Ahora lo construyes tú. Fabricas el orquestador, lo pones a construir el «usuario asignado» con una sola orden, y —cuando descubras que se ha dejado algo— cierras el círculo virtuoso mejorando el skill que se quedó corto. Este es el lab en el que tu colección de skills se convierte en una cadena de montaje que arrancas con una frase.

---

## En este lab

- **Overview** — qué practicas
- **Punto de partida** — requisitos + tu repositorio + la demo de referencia
- **Ejercicio 1** — Construye el orquestador `nueva-feature`
- **Ejercicio 2** — Ponlo a construir el usuario asignado
- **Ejercicio 3** — El círculo virtuoso: mejora un skill mientras lo usas
- **Definition of Done**
- **Comparar con la referencia**
- **Reto opcional** — orquesta un campo nuevo y observa la detección de alcance
- **Lo que has practicado + puente a 5.2**

---

## Overview

Al terminar este lab habrás **fabricado el skill orquestador `nueva-feature`** —el que coordina a tus skills de dominio y los llama en orden—, lo habrás **generalizado** de «entidad nueva» a «cualquier característica», y lo habrás **invocado** para construir el «usuario asignado» entero: siete capas, coherentes, con una frase. Y, sobre todo, habrás **cerrado el círculo virtuoso**: al ver que el orquestador se olvidó de sembrar datos de ejemplo de la entidad nueva, mejorarás el skill de base de datos para que lo haga siempre. El entregable es una característica completa, integrada en tu aplicación, y un sistema de skills un poco mejor que antes de empezar.

El detalle conceptual —qué es orquestar, la detección de alcance, cómo mejorar la herramienta cuando se queda corta— está en la base del capítulo; este lab es la parte práctica.

> ⏱️ Tiempo estimado: 40–55 min.

---

## Punto de partida

**Requisitos** (los mismos de todo el curso):

- **VS Code** con la **extensión de GitHub Copilot** y una cuenta con acceso al **modo agente**.
- **SDK de .NET 10**, **Node.js**, **Git** y la **GitHub CLI** (`gh`), ya listos de los labs anteriores.

**Trabajas en tu propio repositorio**, el mismo de siempre, en una sola rama. Sigues donde lo dejaste en 4.7: tienes ocho skills de dominio, uno por capa, y el documento que dibuja cómo se orquestan. Hoy conviertes ese plano en algo ejecutable: un skill que recorre la cadena por ti.

Fíjate en dos cosas antes de empezar, porque explican el skill que vas a crear. El orquestador **no genera código él mismo**: su trabajo es decidir qué capas toca una característica y llamar, en orden, a los skills de dominio que ya tienes. Y por eso sus prerrequisitos son el **documento de análisis** y el **`copilot-instructions.md`**, la partitura y las convenciones: sin ellos no tiene con qué dirigir.

> 💡 **Tu red de seguridad: la demo del curso.** La solución de referencia está en la demo `AppTodoList-curso`, que clonaste al principio. Cuando termines, abres su rama de este capítulo para comparar, solo para mirar; nunca trabajas dentro de la demo.

---

## Ejercicio 1 — Construye el orquestador `nueva-feature`

*Este es tu primer skill de coordinación: dirige a los demás skills de dominio para construir una característica entera. Lo montas a partir de una petición concreta y, en cuanto lo tengas, lo generalizas: una lección de diseño en miniatura que viene directa de la clase. Prueba a tu aire distintas formas de describir el encargo.*

### Tarea 1.1 — Pídele el skill orquestador

1. En el **modo agente**, encárgale el orquestador tal como se pidió en clase:

   > **«Necesito un skill orquestador para, por ejemplo, si hay una entidad nueva como usuario asignado a la tarea, para que haga todo el proceso de una vez. Actualiza el diagrama si fuera necesario.»**

   - → **Qué esperar:** GitHub Copilot te propone un `SKILL.md` con un procedimiento numerado que va de la petición al commit. Fíjate en su **Paso 0**: antes de ejecutar nada, entiende la petición y **detecta el alcance** —qué tipo de cambio es y qué capas toca—. Y en los pasos siguientes, cada uno **delega** en un skill de dominio que ya tienes: el del modelo, el de los DTOs, el de la base de datos, y así hasta el commit.

   🔎 **Por qué el Paso 0 pesa tanto.** No todas las características tocan las mismas capas: una entidad nueva las toca todas, un campo nuevo solo unas pocas. El Paso 0 lee tu frase y decide **qué se ejecuta y qué se salta**. Orquestar bien es ejecutar lo que corresponde a cada caso, con criterio.

### Tarea 1.2 — Generalízalo: de «entidad nueva» a «cualquier característica»

2. La primera versión sirve solo para entidades nuevas. Pero la misma coreografía vale para cualquier cambio que cruce capas —un campo, un endpoint, una relación—. Así que lo generalizas, con las órdenes exactas de la clase:

   > **«El skill orquestador sirve no solo para nuevas entidades… cambia el nombre.»**
   >
   > **«El orquestador servirá para implementar cualquier característica nueva, incluido lo de nueva entidad.»**

   - → **Qué esperar:** GitHub Copilot renombra el skill a `nueva-feature` y amplía su descripción para cubrir cualquier característica, no solo una entidad.

   🔎 **Por qué ese renombre enseña tanto.** Elegir la abstracción correcta —«una característica», no «una entidad»— multiplica el valor de la herramienta: la que servía para un caso pasa a servir para toda una familia. Y el nombre importa: `nueva-feature` te dice de un vistazo que puedes tirar de él para cualquier cosa. Nombrar bien tus herramientas es parte de construirlas.

---

## Ejercicio 2 — Ponlo a construir el usuario asignado

*Con el orquestador montado, lo pones a trabajar. Es el momento en que el sistema entero rinde: una frase en lenguaje natural, y una característica completa montada de punta a punta.*

### Tarea 2.1 — Invócalo con la característica en lenguaje natural

1. Invoca el orquestador describiendo la característica, tal cual la pensarías, con la frase real de la clase:

   > **«/nueva-feature Posibilidad de asignar usuario a tarea, establece las relaciones adecuadas en la base de datos.»**

   - → **Qué esperar:** GitHub Copilot arranca por el Paso 0 y detecta el alcance: una entidad nueva, `UsuarioAsignado`, con una relación hacia `TodoItem`; alcance, todas las capas. A partir de ahí ejecuta la cadena entera él solo: actualiza el análisis, crea el modelo y su relación, genera los DTOs, añade el `DbSet` con su migración, escribe la lógica, el servicio y el controlador, lo registra todo en `Program.cs`, y remata con un `dotnet build`.

   🔎 **Fíjate en que añade la guarda sin que se lo pidas.** Como ya aprendiste a validar en 4.6, el orquestador añade por su cuenta la comprobación de que el usuario existe antes de guardar la relación —la misma guarda de existencia que pusiste a mano, ahora dentro de la cadena—. La calidad que aprendiste a exigir a mano ya viene puesta en el proceso.

### Tarea 2.2 — Párate a apreciar lo que ha pasado

2. Comprueba lo que ha pasado: el proyecto **compila** (`dotnet build` en verde), y recorre los ficheros que el orquestador ha tocado —el modelo y su relación, los DTOs, la migración, la lógica, el servicio, el controlador—. (Arrancar y probar la aplicación con la característica nueva lo dejas para 5.2: ahí es donde vas a probarla de verdad.)

   - → **Qué esperar:** una frase, y una característica completa —siete capas, coherentes entre sí, integradas en la aplicación que ya tenías— construida de una sola pasada. Para eso sirve orquestar: que GitHub Copilot coordine el proceso entero por ti, en el orden correcto, sin ir lanzando skill a skill a mano.

---

## Ejercicio 3 — El círculo virtuoso: mejora un skill mientras lo usas

*Y aquí llega algo que no estaba en el guion. Al mirar los datos de tu aplicación, descubres un hueco. Lo interesante es lo que decides hacer con él: parchearlo a mano, o mejorar la herramienta para que no vuelva a pasar. Vas a hacer lo segundo.*

### Tarea 3.1 — Detecta el hueco

1. Abre la tabla `UsuarioAsignado` en tu base de datos, o revisa el seeder de datos de ejemplo: la entidad se ha creado, pero su tabla está vacía. El orquestador no ha sembrado ningún usuario. Pregúntaselo, como se hizo en clase:

   > **«¿Estás generando datos de ejemplo? En el skill de base de datos no se decía que hay que implementar datos de ejemplo, ¿verdad?»**

   - → **Qué esperar:** GitHub Copilot confirma el hueco: las tareas tienen sus datos de arranque, pero la entidad nueva nació con la tabla vacía, porque el skill de base de datos no siembra datos de ejemplo de las entidades que se crean.

### Tarea 3.2 — Arregla el skill, no el caso

2. Tienes dos caminos: añadir los usuarios de ejemplo a mano, o mejorar el skill para que esto no vuelva a pasar. Elige el segundo, con la instrucción de la clase:

   > **«Sí, agrégalo al diseño para que lo haga siempre para todas las entidades nuevas.»**

   - → **Qué esperar:** GitHub Copilot mejora el skill de **base de datos** para que, de ahora en adelante, siembre datos de ejemplo de cualquier entidad nueva. Mejoras la herramienta, y a partir de aquí toda característica que orquestes nacerá con sus datos.

   🔎 **Esto es el círculo virtuoso.** Detectaste que un skill se quedaba corto y lo mejoraste. Cuesta un poco más hoy, pero cada característica que orquestes a partir de ahora nace con sus datos, sin que te acuerdes. Es la diferencia entre fregar el suelo y arreglar la gotera.

---

## Definition of Done

Lo has terminado cuando:

- [ ] Existe el fichero `.github/skills/nueva-feature/SKILL.md`, **renombrado** desde su versión de «entidad nueva», con su procedimiento de pasos y su **detección de alcance** (Paso 0).
- [ ] Al invocarlo con la frase del usuario asignado, construye la característica **en todas las capas** (modelo, DTOs, base de datos con migración, lógica, servicio, controlador) y **`dotnet build` compila**.
- [ ] La característica incluye la **guarda de existencia** del usuario, sin que la pidieras a mano.
- [ ] El skill de **base de datos** está mejorado para **sembrar datos de ejemplo** de las entidades nuevas (círculo virtuoso cerrado).
- [ ] Sabes explicar por qué el orquestador **delega** en los skills de dominio y solo los coordina, y por qué el Paso 0 (detección de alcance) es lo que lo hace listo.
- [ ] Sabes explicar por qué se generalizó de «entidad» a «característica», y por qué mejorar el skill deja el sistema mejor para la próxima vez.

---

## Comparar con la referencia

La solución de referencia de este capítulo está en la demo del curso, `AppTodoList-curso`, en su rama `submodulo-5.1/nueva-feature`. La usas solo para mirar; nunca trabajas dentro de la demo.

En tu clon de la demo (la carpeta aparte, no la de tu proyecto):

```bash
cd AppTodoList-curso
git checkout submodulo-5.1/nueva-feature
```

Abre su `.github/skills/nueva-feature/SKILL.md` y los ficheros del usuario asignado (`Models/`, `Dtos/`, `Services/`…), y ponlos al lado de los tuyos. No busques que sean idénticos —tu frase y tu proyecto influyen—; busca que **las decisiones de fondo coincidan**: el procedimiento con detección de alcance, la característica construida en todas las capas, la guarda de existencia, y el skill de base de datos ya sembrando datos de ejemplo. Si a lo tuyo le falta algo, pídeselo a GitHub Copilot.

Cuando termines de mirar, vuelve a tu proyecto y sigue con lo tuyo.

---

## Reto opcional — orquesta un campo nuevo y observa la detección de alcance

Hasta ahora has orquestado una entidad nueva, que toca todas las capas. Prueba el otro extremo: pídele a `nueva-feature` que añada un **campo nuevo** a una entidad que ya existe —por ejemplo, una prioridad en la tarea—. Fíjate en lo que hace el Paso 0: el alcance se encoge. Toca el modelo, el DTO, la base de datos para la migración y el servicio, y para de contar; no vuelve a crear de cero la lógica ni el controlador, porque la tarea ya los tiene. Mismo skill, dos recorridos completamente distintos, y la diferencia la decide el Paso 0 leyendo tu frase. Ahí ves, en tu propia aplicación, cómo el orquestador ejecuta en cada caso solo lo que toca.

---

## Lo que has practicado

Ya sabes construir un skill que coordina a los demás skills de dominio, generalizarlo para que sirva a cualquier característica, y ponerlo a montar una funcionalidad entera —el usuario asignado, siete capas— con una sola orden. Y has cerrado tu primer círculo virtuoso: cuando el skill de base de datos se quedó corto, lo mejoraste para que no vuelva a pasar. Te llevas dos ideas grandes: que los skills se **componen** en jerarquía, unos coordinando a otros, y que tus herramientas **mejoran mientras las usas**.

**Puente a 5.2.** Tu orquestador te ahorra muchísimo trabajo, pero acabas de comprobar que no es infalible: se olvidó de sembrar los datos de ejemplo, y ese fallo lo cazaste tú, mirando. Los skills generan mucho código muy rápido, y una parte tiene fallos —unos que el compilador ve, y otros que no—. En el capítulo siguiente aprendes la otra mitad de dirigir a GitHub Copilot: **depurar lo que rompe**. Verás dos fallos reales que salieron al construir esta misma característica, y cómo se arreglan.
