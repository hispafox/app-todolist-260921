---
submódulo: M6.4
tipo: lab
tipo-lab: construcción
título: "Lab M6.4 — De albañil a encargado de obra"
base: "temario/GHCOPTL-M6.4-el-agente-desarrollador.md"
rama-referencia: "submodulo-6.4/desarrollador"
repo-ejemplos: "hispafox/AppTodoList-curso"
lab-version: 1
actualizado: 2026-07-08
---

# 🧪 Lab M6.4 — De albañil a encargado de obra

> **Lab versión 1 · Última actualización 2026-07-08 · Base:** [M6.4 — El agente `desarrollador`](../temario/GHCOPTL-M6.4-el-agente-desarrollador.md)

En el capítulo leíste la historia de un agente que adelgazó a la mitad al dejar de reinventar lo que sus skills ya sabían hacer. Aquí la revives con tus manos: montas primero la versión que lo hace todo, la ves crecer, y luego le das el mismo encargo que la dejó en la mitad. Y al final le entregas el plan del lab 6.3 para que, por fin, construya código de verdad.

---

## En este lab

- **Overview** — qué practicas
- **Punto de partida** — dónde retomas
- **Ejercicio 1** — Monta el desarrollador, y velo adelgazar
- **Ejercicio 2** — Entrégale el plan y deja que construya
- **Definition of Done**
- **Comparar con la referencia**
- **Reto opcional** — encuentra tu propia duplicación
- **Lo que has practicado + cierre de M06**

---

## Overview

Al terminar este lab sabrás **construir el tercer agente del equipo, el primero con `execute`**, y verás con tus propios ojos por qué se hizo más pequeño al dejar de saber construir para saber delegar. Después lo pondrás a trabajar de verdad: le entregas el plan de categorías que fabricaste en 6.3, y ves cómo tu proyecto pasa de tener un plan a tener código que compila.

El detalle conceptual —por qué `execute` es el poder que de verdad toca el mundo real, qué es el DRY subido un piso, por qué el desarrollador no puede rediscutir el plan— está en la base del capítulo; este lab construye y usa lo que ahí se explica.

> ⏱️ Tiempo estimado: 40-50 min.

---

## Punto de partida

**Requisitos** (los mismos de todo el curso): VS Code con la extensión de GitHub Copilot en modo agente, y tu repositorio de siempre, publicado en GitHub.

Sigues en el mismo proyecto. Del lab 6.3 te traes el agente planificador y, sobre todo, **tu `docs/plan-*.md` de categorías**, con su §10 ya rellena. Lo vas a necesitar entero en el Ejercicio 2. Todo en la misma rama de siempre: aquí tampoco creas ramas.

> 💡 **Tu red de seguridad: la demo del curso.** Cuando termines, te asomas a la rama de este capítulo en tu clon de `AppTodoList-curso` para comparar. Solo para mirar, como en cada lab.

---

## Ejercicio 1 — Monta el desarrollador y mira cómo adelgaza

*Este agente nació grande: en clase se construyó primero completo, hizo su trabajo una vez, y solo después se le pidió que delegara. Vas a recorrer las dos versiones tal como pasó, para que el «antes» le dé sentido al «después».*

### Tarea 1.1 — Encárgale el agente

1. En modo agente, pídeselo con el mismo encargo real del capítulo:

   > **«Para continuar, necesitaría implementar el agente que desarrolla, toma como referencia el documento de arquitectura de agentes.»**

   → **Qué esperar:** GitHub Copilot abre `docs/ARQUITECTURA-AGENTES.md` para ver qué le corresponde al desarrollador, y a partir de ahí redacta un primer `.agent.md` con instrucciones detalladas de cómo construir cada capa —modelo, DTO, contexto de base de datos, controlador— paso a paso, todo dentro del propio agente. Una versión grande, que sabe hacerlo todo ella sola.

   ⚠️ **Error común.** A veces, en este punto, GitHub Copilot interpreta mal el encargo y te crea el fichero con la convención de **otro asistente** —otra carpeta, otro formato—. Si te pasa, dile sin rodeos con qué trabajas:

   > **«¡Es para GitHub Copilot!»**

   → **Qué esperar:** GitHub Copilot corrige el rumbo y te deja el fichero donde toca: `.github/agents/`, con el formato `.agent.md` del resto de tu equipo.

### Tarea 1.2 — Átalo al plan y a tu proyecto

2. Completa el encargo con las mismas tres correcciones reales de aquella sesión, una detrás de otra:

   > **«Cámbiale el nombre igual que hicimos con el planificador para asociarlo a este proyecto.»**
   >
   > **«El agente desarrollador parte de un plan escrito por el planificador. Cambia el nombre también al archivo.»**
   >
   > **«El agente ha de preguntar por el plan que ha de desarrollar.»**

   → **Qué esperar:** GitHub Copilot renombra el `name` y el fichero atándolo a tu proyecto, deja escrito que el desarrollador parte del plan del planificador, y añade la regla de arranque: si lo invocas sin decirle la ruta del plan, pregunta antes de hacer nada.

3. Sube este primer punto de partida:

   > **«Sube los cambios.»**

   → **Qué esperar:** GitHub Copilot hace el commit y el `push` de esta primera versión, la que todavía lo hace todo ella misma.

### Tarea 1.3 — Adelgázalo

4. Ahora el encargo que en clase lo dejó en la mitad:

   > **«El agente desarrollador ha de tener en cuenta los skills que se han mencionado en el plan para desarrollar, en el orden adecuado.»**

   → **Qué esperar:** GitHub Copilot reescribe el cuerpo del agente. Desaparecen las instrucciones de cómo construir cada capa a mano, y queda una idea sola: leer la §10 del plan y ejecutar, en orden, los skills que allí se listan. Compara el tamaño del fichero antes y después —en clase pasó de 416 a 231 líneas, casi la mitad— y confirma que lo que se fue es exactamente el saber hacer que ya tenías repartido en tus skills de M04.

   💡 **Pista.** Si tienes un plan de ejemplo a mano —el que fabricaste en el lab 6.3 sirve—, dáselo como referencia:

   > **«Hay un plan de ejemplo en `docs`.»**

   Así GitHub Copilot ajusta el agente a un caso real, con datos concretos delante.

   🔎 **Por qué este segundo encargo importa más que el primero.** Aquella primera versión te dio un agente que funciona. Esta segunda te enseña el gesto que de verdad vale para cualquier agente que montes: si ya tienes algo que hace un trabajo —un skill, un script—, deja que el agente lo invoque en vez de reimplementarlo por dentro. Un agente delgado envejece mejor que uno que sabe de todo.

---

## Ejercicio 2 — Entrégale el plan y deja que construya

*Aquí es donde tu proyecto, por fin, gana código de verdad, y lo hace el desarrollador: le encargas la tarea y él dispara los skills que ya montaste en M04.*

### Tarea 2.1 — Dale el plan

1. Invócalo con el mismo encargo real de clase:

   > **«Implementa el plan de las categorías de tareas.»**

   → **Qué esperar:** si tu desarrollador ya sabe preguntar por la ruta, te la pedirá. Confírmasela con la misma respuesta real:

   > **«Sí, ese es el plan.»**

   Entonces lee tu `docs/plan-*.md` entero, revisa el estado actual de tu proyecto —tus modelos, tus DTOs, tu `AppDbContext`— y localiza la §10.

### Tarea 2.2 — Míralo recorrer la cadena

2. Sigue la ejecución sin intervenir. El desarrollador dispara, uno tras otro y en el orden de la §10, los skills que montaste en M04: `diseño-analisis`, `modelo`, `dto`, `base-de-datos`, `logica-negocio`, `validaciones`, `servicio`, `controlador`, `commit-message`. Al terminar la cadena, lanza `dotnet build`.

   → **Qué esperar:** un parte final parecido a este, sin adornos:

   ```
   ✅ Skills ejecutados: 9/9
   ✅ Build: exitoso
   ✅ Migración creada: AgregarCategoria
   ✅ Ficheros: N creados, M modificados
   ```

   ⚠️ **Error común.** Si `dotnet build` falla, deja que el propio desarrollador lea el error y corrija: es lo que marca su procedimiento, y forma parte del ejercicio dejarle hacerlo. Si tras varios intentos sigue sin compilar, para y revisa el plan del lab 6.3 —puede que a alguna sección le falte un detalle que el desarrollador necesitaba.

3. Repasa el proyecto: deberías tener la entidad de categoría, sus DTOs, la migración, la lógica, el servicio y el controlador con sus endpoints, y tu entidad de tarea con el campo de categoría añadido.

   🔎 **De dónde sale cada fichero.** Cada fichero que ves nuevo salió de un skill que TÚ montaste en M04: el desarrollador solo decidió cuándo llamarlo. Si algo no te encaja, corrígelo en ese skill, o en el plan que lo ordenó.

4. Cierra subiendo el resultado:

   > **«Sube los cambios.»**

---

## Definition of Done

Este capítulo entrega el primer agente que toca código de producción de verdad. Lo has terminado cuando:

- [ ] Existe tu agente desarrollador en `.github/agents/`, con `tools: [read, search, edit, execute]` y su apartado de restricciones («SOLO lo que está en el plan», «SIEMPRE compila al terminar»), atado al nombre de tu proyecto.
- [ ] Has visto el agente antes y después del segundo encargo, y sabes explicar qué se quitó al adelgazarlo.
- [ ] Le has entregado tu plan de 6.3 y ha ejecutado los nueve skills de la §10, en orden, sin que tú tocaras una línea.
- [ ] `dotnet build` compila y tienes el parte final del desarrollador con la cuenta de skills, ficheros y la migración.
- [ ] Sabes explicar por qué el desarrollador no rediscute el plan aunque vea una forma mejor de hacer las cosas.

---

## Comparar con la referencia

La solución de referencia está en la demo del curso, `AppTodoList-curso`, en su rama `submodulo-6.4/desarrollador`. La usas solo para mirar.

```bash
cd AppTodoList-curso
git checkout submodulo-6.4/desarrollador
```

Abre su `.github/agents/desarrollador-apptodolist.agent.md` y pon tu versión adelgazada al lado. Lo esencial que debe coincidir: `tools: [read, search, edit, execute]`, la regla de preguntar por el plan si falta, y el procedimiento reducido a leer la §10 y ejecutar. Si tu proyecto tiene la misma característica de categorías, compárala también con `git diff` contra esta rama: los nombres de fichero y el resultado de `dotnet build` deberían coincidir en lo esencial, aunque el código exacto varíe según cómo dirigiste a cada skill.

Cuando termines de mirar, vuelve a tu proyecto y sigue con lo tuyo.

---

## Reto opcional — encuentra tu propia duplicación

Repasa algún agente que hayas montado antes en este curso —el `prompt-engineer`, el planificador— o uno tuyo de otro proyecto. ¿Lleva dentro alguna instrucción que repite, a mano, algo que ya sabe hacer un skill, un script o un comando que tienes? Si la encuentras, pídele a GitHub Copilot que la reemplace por una llamada a ese skill, igual que hiciste aquí. Y pregúntate qué pasaría con ese agente el día que cambies de idea sobre cómo hacer esa tarea: ¿tendrías que tocarlo a él también, o le bastaría con que el skill cambiara?

---

## Lo que has practicado

Has montado el tercer y último agente constructor del equipo, el primero con permiso para ejecutar y tocar código de verdad. Viste la versión que lo hacía todo adelgazar a la mitad, al dejar de reinventar lo que tus skills ya sabían hacer, y luego la pusiste a producir código real, siguiendo un plan que tú mismo revisaste en el lab anterior.

**Cierre de M06.** Con este lab tienes ya el equipo constructor completo: uno que afina tu petición, otro que la convierte en plan, y este que lo ejecuta. Pero fíjate en lo que todavía falta. El desarrollador compila, y compilar solo dice que el código no está roto; no dice que cumpla el plan al pie de la letra. Y a los tres los has ido invocando tú, a mano, uno detrás de otro. En M07 llegan los dos papeles que cierran el sistema: el **verificador**, que juzga lo construido sin poder tocarlo, y el **orquestador**, que por fin coordina a todo el equipo sin que tengas que pasarles el testigo uno a uno.
