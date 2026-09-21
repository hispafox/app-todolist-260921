# 🧪 Lab M4.7 — La arquitectura de los skills

**Lab versión 1 · Última actualización: 2026-07-07 · Base:** `temario/GHCOPTL-M4.7-la-arquitectura-de-los-skills.md`

En el capítulo has visto, sobre el papel, el documento que dibuja el plano de tu sistema: `docs/skills-orquestacion.md`, con el catálogo de skills, el orden obligatorio, el grafo de dependencias y el árbol de decisión, todo en diagramas Mermaid. Ahora lo generas tú, y compruebas dos cosas con tus ojos: que esos diagramas se dibujan solos al abrir el fichero, y que retratan de verdad el sistema que has construido. Este es el lab en el que tu conjunto de skills se convierte en un plano que otros —y la propia herramienta— pueden leer.

---

## En este lab

- **Overview** — qué practicas
- **Punto de partida** — requisitos + tu repositorio + la demo de referencia
- **Ejercicio 1** — Genera el documento de orquestación con Mermaid
- **Ejercicio 2** — Comprueba que el plano retrata tu sistema
- **Definition of Done**
- **Comparar con la referencia**
- **Reto opcional** — usa el documento como contexto de GitHub Copilot
- **Lo que has practicado + puente a 5.1**

---

## Overview

Al terminar este lab habrás **generado `docs/skills-orquestacion.md`** con GitHub Copilot: el catálogo de tus skills, el orden obligatorio de ejecución, las dependencias y el árbol de decisión, dibujados en Mermaid. Habrás **comprobado que los diagramas se dibujan** al abrir el fichero, y **revisado que el plano refleja tu proyecto de verdad**: el orden real, tus carpetas, tus skills. Y habrás mantenido el documento **al día** pidiéndole que lo actualice. El entregable es documentación: el plano legible de todo lo que has levantado en el módulo.

El detalle conceptual —por qué Mermaid, al ser texto, se mantiene al día, y por qué este documento es a la vez para ti y para la herramienta— está en la base del capítulo; este lab es la parte práctica.

> ⏱️ Tiempo estimado: 25–40 min.

---

## Punto de partida

**Requisitos** (los mismos de todo el curso):

- **VS Code** con la **extensión de GitHub Copilot** y una cuenta con acceso al **modo agente**.
- **SDK de .NET 10**, **Node.js**, **Git** y la **GitHub CLI** (`gh`), ya listos de los labs anteriores.

**Trabajas en tu propio repositorio**, el mismo de siempre, en una sola rama. Sigues donde lo dejaste en 4.6: tu aplicación está blindada de fuera a dentro, y tienes ocho skills de dominio construidos, uno por capa. Hoy no escribes código nuevo. Das un paso atrás y **documentas** cómo encajan todos esos skills: el plano del sistema.

> 💡 **Tu red de seguridad: la demo del curso.** La solución de referencia está en la demo `AppTodoList-curso`, que clonaste al principio. Cuando termines, abres su rama de este capítulo para comparar, solo para mirar; nunca trabajas dentro de la demo.

---

## Ejercicio 1 — Genera el documento de orquestación con Mermaid

*Este ejercicio nació de una pregunta real de clase: al ver que un skill declaraba que dependía de otro, alguien se dio cuenta de que aquello ya no eran herramientas sueltas, sino un sistema. Y a un sistema hay que dibujarlo. Le pides a GitHub Copilot que lo documente por ti, leyendo tu propio repositorio. Prueba a tu aire distintas formas de pedirlo.*

### Tarea 1.1 — Pídele que documente la orquestación

1. En el **modo agente**, con tus skills ya construidos, dale la orden tal como se dio en clase:

   > **«Documenta en un archivo .md, utilizando como recurso diagrama o diagramas Mermaid, para explicar esta orquestación de skills. Documenta todo el proceso.»**

   - → **Qué esperar:** GitHub Copilot crea `docs/skills-orquestacion.md` leyendo lo que ya existe en tu proyecto —los `SKILL.md`, sus prerrequisitos, el `readme`— y lo llena de secciones con diagramas Mermaid: un catálogo de tus skills, el orden obligatorio de ejecución, un grafo de dependencias, un árbol de decisión de «qué skill toca ahora» y las convenciones de nombres.

   🔎 **Por qué Mermaid y no una imagen.** Un diagrama Mermaid es texto dentro del `.md`. No es una imagen que se pudre en cuanto el sistema cambia y hay que volver a exportar; se dibuja solo en cualquier visor que lo entienda, y se edita como el resto del texto: cambias una flecha escribiendo una flecha. Por eso el documento se mantiene al día casi sin esfuerzo.

   ⚠️ **No lo escribiste tú.** Fíjate en que el documento retrata el sistema **leído de tu repositorio**. Tú diriges y revisas; GitHub Copilot redacta y dibuja a partir de lo que ya existe. Y como todo en el curso, no se inventa la orquestación: la deduce de tus `SKILL.md` reales.

---

## Ejercicio 2 — Comprueba que el plano retrata tu sistema

*Un plano solo sirve si retrata el edificio de verdad. Aquí abres el documento, ves los diagramas cobrar forma, y compruebas con calma que lo que retratan es tu proyecto real. Y de paso lo mantienes al día, que es la gracia de documentar en texto.*

### Tarea 2.1 — Comprueba que los diagramas se dibujan

1. Abre `docs/skills-orquestacion.md`. Míralo primero en crudo —verás los diagramas escritos como texto, con sus nodos y sus flechas—, y luego en la vista previa:

   - → **Qué esperar:** los diagramas se **dibujan solos**. En GitHub se ven bien desde hace años. En VS Code, la vista previa de Markdown los muestra en sus versiones recientes; si la tuya no lo hace, instala una extensión de Mermaid para Markdown y los verás igual.

   🔎 **Lo que acabas de conseguir.** El diagrama y su documentación son el mismo fichero de texto, versionado en tu Git. Cuando el sistema cambie, cambias el texto y el dibujo se actualiza con él, sin una imagen aparte que mantener.

### Tarea 2.2 — Revisa que el plano sea el tuyo

2. Recorre el documento con ojo crítico y contrástalo con tu proyecto real:

   - → **Qué comprobar:** que el **catálogo** liste tus skills de verdad; que el **orden obligatorio** sea el que tú has vivido —`diseño-analisis → modelo → dto → base-de-datos → logica-negocio → validaciones → servicio → controlador`—, el orden canónico que respeta todas las dependencias; y que el **árbol de decisión** te lleve al skill correcto según el estado del proyecto. Fíjate en un detalle que cuenta la forma del sistema: la mayoría de tus skills produce una carpeta, es decir, una capa, pero `commit-message` no produce ninguna; es el ayudante que remata el ciclo. Por eso, aunque el catálogo liste nueve entradas, los que construyen la aplicación son los **ocho skills de dominio**.

   💡 **Si algo no cuadra, corrígelo dirigiendo.** ¿Falta un skill, o el orden no refleja el tuyo? Pídele a GitHub Copilot que lo ajuste. El documento tiene que retratar tu sistema; si no lo hace, no sirve de plano.

### Tarea 2.3 — Mantén el documento al día

3. La prueba de fuego de documentar en texto es lo barato que sale mantenerlo. Simúlalo con la orden real de clase:

   > **«Me faltarán varios skills; revisa el readme, por ejemplo para base de datos, y actualiza todo el sistema y la documentación.»**

   - → **Qué esperar:** GitHub Copilot repasa tu proyecto, detecta lo que falte en el documento, y actualiza el catálogo y los diagramas para que vuelvan a cuadrar. El plano no se queda atrás porque mantenerlo cuesta solo una frase.

---

## Definition of Done

Este capítulo entrega documentación, no código nuevo. Lo has terminado cuando:

- [ ] Existe `docs/skills-orquestacion.md` con sus secciones: **catálogo** de skills, **orden obligatorio**, **dependencias**, **árbol de decisión** y **convenciones de nombres**.
- [ ] Los **diagramas Mermaid se dibujan** al abrir el fichero (en GitHub o en la vista previa de VS Code).
- [ ] El catálogo y el orden **reflejan tu proyecto real**: tus skills, tus carpetas, el orden que has construido.
- [ ] Sabes explicar por qué son **ocho skills de dominio** aunque el catálogo liste nueve, y por qué el orden es **obligatorio** (lo imponen las dependencias, no una preferencia).
- [ ] Sabes explicar que este documento no lo lees solo tú: es **contexto del proyecto** que GitHub Copilot puede leer cuando lo necesita, igual que el `copilot-instructions.md` que escribiste en el primer módulo.

---

## Comparar con la referencia

La solución de referencia de este capítulo está en la demo del curso, `AppTodoList-curso`, en su rama `submodulo-4.7/orquestacion-skills`. La usas solo para mirar; nunca trabajas dentro de la demo.

En tu clon de la demo (la carpeta aparte, no la de tu proyecto):

```bash
cd AppTodoList-curso
git checkout submodulo-4.7/orquestacion-skills
```

Abre su `docs/skills-orquestacion.md` y ponlo al lado del tuyo. No busques que sean idénticos —tu encargo y tus skills influyen—; busca que **las decisiones de fondo coincidan**: el catálogo completo, el orden obligatorio dibujado como flujo, las dependencias y el árbol de decisión, todo en Mermaid. Si a lo tuyo le falta una sección, pídele a GitHub Copilot que la añada.

Cuando termines de mirar, vuelve a tu proyecto y sigue con lo tuyo.

---

## Reto opcional — usa el documento como contexto de GitHub Copilot

Este documento no lo lees solo tú. Pon a prueba esa idea. Pídele a GitHub Copilot que añada una capa o un skill nuevo **respetando el orden que describe tu `skills-orquestacion.md`**, y señálale el documento como referencia. Fíjate en si lo usa para orientarse: el orden, las dependencias, las convenciones de nombres. Un documento como este lo abre la herramienta cuando lo necesita o cuando tú se lo señalas, igual que un desarrollador nuevo abre el fichero que le hace falta. GitHub Copilot tiene siempre a mano el `copilot-instructions.md`; este documento, solo cuando lo abre. En los dos casos es contexto con el que trabaja.

---

## Lo que has practicado

Ahora tienes el plano de tu sistema —el catálogo, el orden, las dependencias, el árbol de decisión— en diagramas Mermaid que se dibujan solos y que no se quedan atrás porque son texto en tu repositorio. Y te llevas una idea que vale para cualquier sistema que trabajes así: un conjunto de herramientas que se coordinan necesita su plano, y ese plano, escrito en texto y guardado con el código, es a la vez documentación para quien llega y contexto para la propia herramienta.

**Puente a 5.1.** Tienes el mapa, pero lo recorres tú, a mano, cada vez que quieres añadir algo: invocas los skills uno a uno, en el orden correcto, del análisis hasta el commit. En el capítulo siguiente das el salto de tener el mapa a recorrerlo con una sola orden: construyes un skill **orquestador**, `nueva-feature`, que ejecuta la cadena entera por ti. De dibujar el plano pasas a automatizar el recorrido.
