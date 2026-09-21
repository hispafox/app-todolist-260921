---
submódulo: M8.3
tipo: lab
tipo-lab: disección
título: "Lab M8.3 — El catálogo que confiesa su propio hueco"
base: "temario/GHCOPTL-M8.3-skills-de-terceros-ui-ux-pro-max.md"
rama-referencia: "submodulo-8.3/ui-ux-pro-max"
repo-ejemplos: "hispafox/AppTodoList-curso"
lab-version: 1
actualizado: 2026-07-08
---

# 🧪 Lab M8.3 — El catálogo que confiesa su propio hueco

> **Lab versión 1 · Última actualización 2026-07-08 · Base:** [M8.3 — Skills de terceros: ui-ux-pro-max](../temario/GHCOPTL-M8.3-skills-de-terceros-ui-ux-pro-max.md)

En el capítulo viste a GitHub Copilot pedir un skill de diseño por su nombre, casi traer uno equivocado, corregir el rumbo con la URL exacta, y abrir un `SKILL.md` que confiesa, en su propio texto, que no trae lo que su nombre promete. Aquí repites cada paso con tus manos, en tu propio proyecto: pides el skill, verificas dónde aterriza, lo lees entero y decides tú si merece confianza, y si hace falta lo cableas con una salida honesta.

---

## En este lab

- **Overview** — qué practicas
- **Punto de partida** — dónde retomas
- **Ejercicio 1** — Pide el skill por nombre, después por URL exacta
- **Ejercicio 2** — Verifica dónde aterriza
- **Ejercicio 3** — Léelo y decide si cumple lo que promete
- **Ejercicio 4** — Cabléalo con la salida honesta
- **Definition of Done**
- **Comparar con la referencia**
- **Reto opcional** — audita un skill que ya diste por bueno
- **Lo que has practicado + puente al M9**

---

## Overview

Al terminar este lab sabrás pedir un skill de terceros con el cuidado que exige un nombre parecido, comprobar dónde ha aterrizado de verdad y por qué esa ruta importa, y leer su `SKILL.md` entero, no solo el frontmatter, para decidir si cumple lo que promete. No hay entregable de código nuevo: lo que practicas es el mismo hábito de 2.2, inspeccionar antes de confiar, aplicado al momento que 2.2 no llegaba a cubrir: el que se repite cada vez que tu equipo de agentes vuelve a apoyarse en un skill que ya diste por instalado.

> ⏱️ Tiempo estimado: 30-40 min.

---

## Punto de partida

**Requisitos** (los mismos de todo el curso): VS Code con la extensión de GitHub Copilot en modo agente, Node.js instalado (lo necesita el instalador `npx skills`), y tu repositorio de siempre, publicado en GitHub.

Sigues en el mismo proyecto y en la misma rama de siempre. Tu frontend de 8.2 ya habla con tu API; en este lab no lo tocas, le añades al lado un skill de diseño de terceros.

> 💡 **Tu red de seguridad: la demo del curso.** Cuando termines, te asomas a la rama de este capítulo en tu clon de `AppTodoList-curso` para comparar. Solo para mirar, como en cada lab.

---

## Ejercicio 1 — Pide el skill por nombre, después por URL exacta

*Antes de nada, comprueba en carne propia lo que 8.3 contó sobre nombres parecidos. Experimenta a tu aire con la redacción: lo que importa es que reconozcas el patrón.*

### Tarea 1.1 — El primer intento, solo con el nombre

1. Pídeselo a tu agente orquestador con algo parecido al encargo real de clase:

   > **«Por favor, me instalas UX-UI pro max, el skill de estilos UI»**

   → **Qué esperar:** GitHub Copilot busca algo que encaje con ese nombre suelto. En clase encontró un candidato de un repositorio distinto al buscado, `olehsvyrydov/ai-development-team@ui-designer`: un proyecto real, pero no el que se buscaba. A ti puede tocarte el mismo candidato u otro cualquiera; el catálogo de skills cambia con el tiempo.

   ⚠️ **Error común.** Aceptar el primer candidato sin fijarte en el nombre completo del repositorio. Confírmalo siempre antes de dejar que el instalador siga adelante.

2. Antes de dejar que instale nada, acota el alcance con el mismo matiz de clase:

   > **«pero lo quiero instalar solo para este proyecto»**

### Tarea 1.2 — Cierra la ambigüedad con la URL exacta

3. Dale la dirección exacta del proyecto que de verdad quieres:

   > **«El que quiero es este: [UI UX Pro Max - Design Intelligence for Claude Code](https://ui-ux-pro-max-skill.nextlevelbuilder.io/)»**

   → **Qué esperar:** GitHub Copilot vuelve a buscar con ese dato concreto y localiza el paquete correcto, listo para instalar con `npx skills add`.

   🔎 **Por qué este paso cambia todo.** Con una URL delante ya no hay nombre que interpretar: hay una dirección que se puede abrir, leer y comprobar. Es la diferencia entre pedir «algo parecido a X» y pedir exactamente X.

---

## Ejercicio 2 — Verifica dónde aterriza

*El instalador reparte el mismo skill entre todos los agentes que tengas disponibles, en una ruta universal. Para un skill que quieres que use tu equipo entero de agentes de proyecto, esa ruta no es la que corresponde.*

### Tarea 2.1 — Lee la salida del instalador

1. Tras instalar, revisa la terminal. Deberías ver algo parecido a esto:

   ```
   ●  Installing to: Antigravity, Claude Code, Cursor, Gemini CLI, GitHub Copilot

   .\.agents\skills\ui-ux-pro-max
     universal: Antigravity, Cursor, Gemini CLI, GitHub Copilot, Amp +12 more
     symlink → Claude Code
   ```

   → **Qué esperar:** una ruta universal (`.agents/skills/`), distinta de la de proyecto (`.github/skills/`) que usan tus otros skills desde 1.1.

### Tarea 2.2 — Reubícalo donde corresponde

2. Dile a tu agente, en varios mensajes seguidos si hace falta, lo mismo que se dejó claro en clase:

   > **«¡Cuidado, que estamos en GitHub Copilot!»**
   > **«¿No tiene que estar en `.github`?»**
   > **«Quiero que esté en `.github`.»**

   → **Qué esperar:** GitHub Copilot mueve el skill a `.github/skills/ui-ux-pro-max/`, junto al resto de tus skills de proyecto.

   ⚠️ **Error común.** Dejarlo en la ruta universal «porque total, funciona igual». Es una carpeta compartida entre todos los agentes que tengas instalados, no la carpeta de proyecto que sigue el resto de tus skills desde 1.1; y esa es la que corresponde cuando quieres que **todo** tu equipo de agentes se apoye en él.

3. Comprueba: `.github/skills/ui-ux-pro-max/` existe, y `SKILL.md` es su único fichero: sin `data/`, sin `scripts/`, sin plantillas.

---

## Ejercicio 3 — Léelo y decide si cumple lo que promete

*Ya lo instalaste en el sitio correcto. Ahora toca lo que en 2.2 aprendiste a hacer con cualquier skill de fuera: leerlo antes de confiar en él. Este caso trae una vuelta de tuerca: no hay nada escondido, el propio fichero se delata a sí mismo si lo lees entero.*

### Tarea 3.1 — Abre el `SKILL.md` completo

1. Abre `.github/skills/ui-ux-pro-max/SKILL.md` y lee el frontmatter: `name`, `description`, los `triggers`, el `upstream`. Hasta aquí, todo apunta a un catálogo de patrones de diseño real.

2. Sigue leyendo el cuerpo del fichero. No te quedes en el frontmatter.

   → **Qué esperar:** una sección que dice, en sustancia, que si ese `SKILL.md` es el único fichero de la carpeta, el flujo original no está disponible localmente, con una advertencia explícita al agente: no debe dar por hecho ni comunicar que el catálogo completo está activo.

   🔎 **Por qué seguir leyendo importa aquí.** En 2.2 las cuatro preguntas eran «¿casa lo que dice ser con lo que pide hacer?, ¿qué toca?, ¿huele raro?, ¿lo entiendes?». Este fichero no huele raro en ningún punto: se delata solo, en su propio texto. La única forma de enterarte es no quedarte en las seis líneas de arriba.

### Tarea 3.2 — Comprueba si la confesión es cierta

3. Mira el contenido de `.github/skills/ui-ux-pro-max/`: ¿hay una carpeta `data/`? ¿un `scripts/`? ¿plantillas?

   → **Qué esperar:** no. La condición que el propio texto pone («si soy el único fichero...») se cumple.

4. Si tu instalación generó también un `skills-lock.json`, ábrelo y localiza el campo `source`.

   → **Qué esperar:** un repositorio distinto del que pediste: en clase, `nexu-io/open-design`, no `nextlevelbuilder/ui-ux-pro-max-skill`. Ese fichero es el rastro del camino real: pasó por un catálogo intermedio que lo empaqueta antes de llegar a tu proyecto.

   💡 **Pista.** No hace falta que memorices el nombre exacto del intermediario. Lo que importa es el hábito: abrir el `skills-lock.json` cuando algo no encaja del todo con lo que pediste, en vez de asumir que llegó el paquete completo.

   > Nota: `ui-ux-pro-max` es un servicio externo real y su catálogo puede cambiar desde que se grabó la clase. Si a ti te llega algo más que un `SKILL.md` suelto, con `data/` o `scripts/` de verdad, mejor: tienes el paquete completo, y el ejercicio sigue siendo el mismo, leerlo y decidir si cumple lo que promete.

---

## Ejercicio 4 — Cabléalo con la salida honesta

*Si tu `SKILL.md` resultó ser, como el de clase, solo una ficha de catálogo, la pregunta ya no es si lo borras: es cómo evitas que tu equipo de agentes actúe como si tuviera algo que no tiene.*

### Tarea 4.1 — Pide la integración honesta

1. Pídeselo a tu agente con el mismo encargo real de clase:

   > **«Indica que siempre debería valorar el uso de este skill en el proceso de implementación de nuestro front, analiza las dependencias para agregarlo a la hora de desarrollar el front, en agentes y skills actuales»**

   → **Qué esperar:** GitHub Copilot añade una fila nueva en `copilot-instructions.md`, un prerrequisito nuevo al principio de `frontend-react`, un paso nuevo en `nueva-feature` (con su nota de qué hacer si el catálogo sigue vacío), y una mención en tus agentes `planificador-apptodolist` y `desarrollador-apptodolist`.

   🔎 **Por qué la nota de fallback importa.** En vez de exigir que el skill funcione al cien por cien, dice qué hacer cuando el catálogo solo tiene metadatos: seguir con cuatro principios básicos de experiencia de usuario (claridad, respuesta visual, consistencia, accesibilidad) en lugar de fingir que un motor de patrones inexistente acaba de validar tu diseño.

2. Comprueba: abre `nueva-feature/SKILL.md` y localiza el paso que menciona `ui-ux-pro-max`; debe traer esa nota explícita. Repasa también, si lo generó tu instalación, el diagrama `docs/skills-orquestacion.md`: el capítulo añade ahí un nodo nuevo para este skill, con su propio color en la leyenda.

### Tarea 4.2 — Confirma que el equipo entero lo sabe

3. Pregunta, como en clase:

   > **«¿está referenciado en los agentes en el lugar adecuado? ¿hace falta referenciar ui-ux-pro-max en algún agente?»**

   → **Qué esperar:** un repaso de `planificador-apptodolist` y `desarrollador-apptodolist`; si a alguno le falta la mención, la añade.

4. Sube el cambio dejando que tu skill `commit-message`, el que montaste en 2.1, genere el mensaje.

---

## Definition of Done

Este lab entrega un criterio ejercido, el de valorar un skill de terceros cada vez que tu equipo lo usa. Lo has terminado cuando:

- [ ] Has instalado `ui-ux-pro-max` reproduciendo el riesgo del nombre parecido: primero solo con el nombre, después con la URL exacta.
- [ ] El skill está en `.github/skills/ui-ux-pro-max/` de tu proyecto, no en una ruta de usuario.
- [ ] Has leído el `SKILL.md` completo (frontmatter y cuerpo) y sabes decir, con tus palabras, si cumple lo que promete su `name`/`description` o si es solo una entrada de catálogo.
- [ ] Si resultó ser una entrada de catálogo, has cableado la salida honesta en `nueva-feature`, `frontend-react`, `copilot-instructions.md`, tus agentes de frontend y el diagrama `docs/skills-orquestacion.md`.
- [ ] Sabes explicar la diferencia entre la lectura de 2.2, una vez, al instalar, y la vigilancia de este capítulo: la que se repite cada vez que el equipo lo usa.

---

## Comparar con la referencia

La solución de referencia está en la demo del curso, `AppTodoList-curso`, en su rama `submodulo-8.3/ui-ux-pro-max`.

```bash
cd AppTodoList-curso
git checkout submodulo-8.3/ui-ux-pro-max
```

Abre su `.github/skills/ui-ux-pro-max/SKILL.md` y compáralo con el tuyo: el resultado exacto puede variar si el catálogo externo cambió desde la grabación, pero la estructura (frontmatter, `triggers`, y la confesión del cuerpo si sigue siendo solo metadatos) debería sonarte. Pon al lado el `git diff` de `nueva-feature/SKILL.md`, `frontend-react/SKILL.md` y `copilot-instructions.md`: lo esencial que debe coincidir es la nota de fallback; la redacción exacta puede variar.

Cuando termines de mirar, vuelve a tu proyecto y sigue con lo tuyo.

---

## Reto opcional — audita un skill que ya diste por bueno

Vuelve al skill que instalaste en el Lab 2.2 y hazle las mismas preguntas que acabas de aplicar aquí: ¿su `SKILL.md` cumple, línea a línea, lo que promete su `description`? ¿Sigue haciendo justo lo que hacía el día que lo instalaste, o algo ha cambiado desde entonces? A veces la sorpresa te espera en un skill que llevas capítulos dando por bueno y nunca volviste a abrir.

---

## Lo que has practicado

Has pedido un skill por nombre y has visto el riesgo del parecido en carne propia; lo has reubicado donde corresponde; y has leído un `SKILL.md` completo, no solo su frontmatter, para descubrir que confesaba su propio hueco. Y cuando el catálogo resultó vacío, respondiste cableando una salida que dice la verdad. Ese hábito, preguntarte si el skill sigue cumpliendo lo que promete y no solo el día que lo instalaste, es lo que te llevas.

**Puente al M9.** Tu proyecto ha crecido capítulo a capítulo, con un `copilot-instructions.md` que acumula secciones y un diagrama de agentes que ya lleva varios nodos añadidos a mano. ¿Sigue contando ese diagrama, hoy, la verdad completa de lo que has construido? Esa pregunta abre el siguiente módulo: mantener la documentación al día con el código real.
