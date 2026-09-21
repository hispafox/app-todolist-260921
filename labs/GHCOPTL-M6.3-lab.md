---
submódulo: M6.3
tipo: lab
tipo-lab: construcción
título: "Lab M6.3 — El jefe de obra"
base: "temario/GHCOPTL-M6.3-el-agente-planificador.md"
rama-referencia: "submodulo-6.3/planificador"
repo-ejemplos: "hispafox/AppTodoList-curso"
lab-version: 1
actualizado: 2026-07-07
---

# 🧪 Lab M6.3 — El jefe de obra

> **Lab versión 1 · Última actualización 2026-07-07 · Base:** [M6.3 — El agente `planificador`](../temario/GHCOPTL-M6.3-el-agente-planificador.md)

En el capítulo leíste por qué un prompt, por bien escrito que esté, necesita alguien que lo cruce con tu proyecto real antes de construir nada. Aquí montas a ese alguien: el planificador, el primer agente de tu equipo que deja algo escrito en tu repositorio. Y en cuanto lo tengas, le entregas el prompt que fabricaste en el lab anterior y ves cómo lo convierte en un plan con diez secciones.

---

## En este lab

- **Overview** — qué practicas
- **Punto de partida** — dónde retomas
- **Ejercicio 1** — Monta el planificador
- **Ejercicio 2** — Pásale el prompt de 6.2 y lee el plan
- **Definition of Done**
- **Comparar con la referencia**
- **Reto opcional** — un plan para tu propia idea
- **Lo que has practicado + puente al Lab 6.4**

---

## Overview

Al terminar este lab sabrás **construir un agente con poder de verdad** —lee todo tu código, escribe un documento, y nada más— y **usarlo de verdad**: le entregas un prompt y recorres el plan-contrato que te devuelve, con la sección que orquesta los skills de M04 como parada obligatoria. El entregable es el `.agent.md` del planificador más el `docs/plan-*.md` que genera para tu característica de categorías.

El detalle conceptual —por qué el plan es un contrato, qué encierra el `edit` sin `execute`, cómo la §10 conecta con lo que ya montaste en M04— está en la base del capítulo; este lab construye y usa lo que ahí se explica.

> ⏱️ Tiempo estimado: 35-45 min.

---

## Punto de partida

**Requisitos** (los mismos de todo el curso): VS Code con la extensión de GitHub Copilot en modo agente, y tu repositorio de siempre, publicado en GitHub.

Sigues en el mismo proyecto. Del lab 6.2 te traes dos cosas: el agente `prompt-engineer` ya montado, y —más importante para hoy— **el prompt optimizado que te devolvió sobre el sistema de categorías**. Guárdalo a mano; lo vas a necesitar entero en el Ejercicio 2. Todo en la misma rama de siempre: aquí tampoco creas ramas.

> 💡 **Tu red de seguridad: la demo del curso.** Cuando termines, te asomas a la rama de este capítulo en tu clon de `AppTodoList-curso` para comparar. Solo para mirar, como en cada lab.

---

## Ejercicio 1 — Monta el planificador

*Este agente no nace de una vez: en clase se construyó en tres pasos —encargarlo, ampliarlo, y ponerle el nombre del proyecto—. Sigue el mismo camino. Experimenta a tu aire en la redacción de cada paso; respeta eso sí el orden de los tres.*

### Tarea 1.1 — Encárgale el agente

1. En modo agente, pídeselo con el mismo encargo real del capítulo:

   > **«Necesito implementar un agente planificador cuyo cometido es analizar la petición y generar un documento de planificación en `docs/`.»**

   → **Qué esperar:** GitHub Copilot no arranca a ciegas: primero abre `docs/ARQUITECTURA-AGENTES.md` —el mismo plano del equipo que leíste en 6.1— para ver qué rol le corresponde al planificador antes de escribir una línea. Después crea el fichero en `.github/agents/`, con `tools: [read, search, edit]`, el cuerpo que fija su cometido, y un apartado de restricciones que le prohíbe tocar código de producción y ejecutar comandos.

   🔎 **Por qué este prompt.** Fíjate en que no le explicas tú las herramientas ni las restricciones: se lo pides por su **cometido** («analizar la petición y generar un plan»), y es GitHub Copilot quien deduce, mirando el plano del equipo, que ese cometido necesita `edit` para escribir el plan pero no `execute` para tocar código. El contrato de poder nace del rol que le describes: las herramientas las deduce él solo.

### Tarea 1.2 — Añádele la orquestación de skills

2. El primer borrador entiende y escribe el plan, pero todavía no sabe de la cadena de skills que montaste en M04. Complétalo con el mismo encargo de aquella sesión:

   > **«Agrega al agente de planificación el uso de los skills definidos en `docs/skills-orquestacion.md`.»**

   → **Qué esperar:** GitHub Copilot abre ese documento —el catálogo de los skills de M02-M05, con su orden de dependencias— y añade al planificador una sección nueva de proceso: antes de cerrar el plan, decide cuáles de esos skills hacen falta para la característica y en qué orden, y los deja en una tabla dentro del propio documento de planificación. Es la §10, «Skills a invocar», naciendo delante de ti.

   💡 **Pista.** Si tu catálogo de skills de M04 tiene un nombre distinto en tu proyecto, dile a GitHub Copilot dónde está en vez de repetir el nombre de la demo; el resultado es el mismo.

### Tarea 1.3 — Ponle el nombre de tu proyecto

3. Como con el resto del equipo en 6.1, cierra atándolo a tu proyecto:

   > **«Cambia el nombre del agente para relacionarlo con este proyecto y no confundirme.»**

   → **Qué esperar:** GitHub Copilot renombra tanto el `name` del frontmatter como el propio fichero, atándolo al nombre de tu proyecto —en la demo se quedó en `planificador-apptodolist`—. Confirma que el fichero renombrado sigue teniendo `tools: [read, search, edit]` y su apartado de restricciones intactos; renombrar no debería tocar ni una palabra de lo que el agente puede y no puede hacer.

   ⚠️ **Error común.** Si al renombrar el fichero GitHub Copilot te deja dos copias —la vieja y la nueva—, pídele que borre la que sobra. Un agente duplicado con dos nombres confunde a GitHub Copilot tanto como a ti.

---

## Ejercicio 2 — Pásale el prompt de 6.2 y lee el plan

*El planificador solo vale si cruza tu prompt con tu código real y te devuelve algo que puedas construir sin adivinar nada. Invócalo con lo que ya tienes en la mano.*

### Tarea 2.1 — Entrégale tu prompt optimizado

1. Invoca al planificador y pégale, entero, el prompt optimizado que te devolvió el `prompt-engineer` en el lab 6.2 —el mismo que en clase se le entregó al planificador tal cual—.

   → **Qué esperar:** el planificador no responde de inmediato con el plan. Primero lee tu proyecto —el análisis, los modelos, los DTOs, el contexto de la base de datos, la lógica, los servicios y los controladores—, en ese orden, de abajo arriba. Solo cuando termina de leer, escribe `docs/plan-categorias.md` con sus diez secciones.

   ⚠️ **Error común.** Si el agente contesta que no puede escribir el fichero, o que no tiene «herramientas de edición habilitadas», mira la sesión de chat: a veces arranca sin las herramientas de edición activas, aunque el `.agent.md` ya se las tenga concedidas por diseño. Revisa el selector de herramientas del panel de chat y actívalas ahí.

### Tarea 2.2 — Recorre el plan, con la §10 como parada obligatoria

2. Abre `docs/plan-categorias.md` y recórrelo sección por sección: el resumen, los requisitos, el modelo de datos con sus tipos y restricciones, los DTOs ya en código, los endpoints con sus verbos y sus códigos de respuesta, la lógica, las capas afectadas, los tests, los criterios de aceptación.

   🔎 **Por qué merece la parada.** Comprueba en cada sección que no queda ninguna decisión a tu criterio: ¿el color de la categoría tiene su formato exacto? ¿el borrado dice qué código HTTP devuelve si la categoría tiene tareas? Si todo está cerrado, el plan hace su trabajo.

3. Para en la **§10, «Skills a invocar»**, la última. Compárala con la cadena de skills que montaste tú mismo en M04: ¿reconoces el orden? ¿ves por qué la lógica va antes que el servicio, y el servicio antes que el controlador?

   💡 **Pista.** Si algún skill de tu proyecto no hace falta para esta característica, el planificador debería marcarlo con «N/A» en vez de omitirlo sin más. Esa marca prueba que lo consideró y lo descartó a propósito.

4. Guarda el plan en su commit y súbelo, como cierre natural del ejercicio:

   > **«Sube los cambios.»**

   → **Qué esperar:** GitHub Copilot hace el commit del nuevo agente y del plan, y el `push` a tu repositorio.

---

## Definition of Done

Este capítulo entrega un agente que escribe una sola cosa: un plan. Lo has terminado cuando:

- [ ] Existe tu agente planificador en `.github/agents/`, con `tools: [read, search, edit]` —sin `execute`— y su apartado de restricciones intacto, atado al nombre de tu proyecto.
- [ ] Le has entregado tu prompt optimizado de 6.2 y ha leído tu proyecto real antes de escribir nada.
- [ ] Tienes un `docs/plan-*.md` con las diez secciones, y sabes explicar qué decisión cierra cada una.
- [ ] Has recorrido la **§10** y sabes decir por qué ese orden de skills es obligatorio: viene de las dependencias reales entre capas.
- [ ] Sabes explicar por qué el planificador tiene `edit` pero no puede tocar tu código: la frontera está en el contrato de poder, no en la buena voluntad del agente.

---

## Comparar con la referencia

La solución de referencia está en la demo del curso, `AppTodoList-curso`, en su rama `submodulo-6.3/planificador`. La usas solo para mirar.

```bash
cd AppTodoList-curso
git checkout submodulo-6.3/planificador
```

Abre su `.github/agents/planificador-apptodolist.agent.md` y su `docs/plan-categorias.md`, y ponlos al lado de los tuyos. El agente no tiene por qué coincidir palabra por palabra, pero sí en lo esencial: `tools: [read, search, edit]`, las restricciones a `docs/`, y la orquestación de skills. El plan sí te interesa que se parezca de cerca en su §10: mismos nueve skills, mismo orden. Si el tuyo trae un orden distinto, revisa si de verdad hay una dependencia distinta o si al planificador se le escapó una.

Cuando termines de mirar, vuelve a tu proyecto y sigue con lo tuyo.

---

## Reto opcional — un plan para tu propia idea

Coge una idea real de tu propio trabajo —una característica pequeña que tengas pendiente— y pásala primero por tu `prompt-engineer` para que la convierta en un prompt con los cuatro pilares, y luego por tu planificador para que la convierta en un plan. Compara el plan que te devuelve con lo que tú habrías escrito directamente en un documento de diseño. Si el plan te ahorra decisiones que se te habrían escapado, ya sabes cuánto vale este agente fuera de la lista de tareas.

---

## Lo que has practicado

Has construido el primer agente de tu equipo que deja algo escrito en el repositorio: un plan que cruza tu prompt con tu código real y cierra, sección por sección, cada decisión que de otro modo tomarías a ciegas al construir. Y has visto su frontera funcionar de verdad: solo escribe en `docs/`, y solo lee, nunca ejecuta.

**Puente al Lab 6.4.** Tienes un plan completo, con su §10 marcando el orden exacto de los skills. Y sigue siendo, de principio a fin, un documento de texto. En el Lab 6.4 conoces al **desarrollador**, el primero del equipo con `execute` en su contrato, y le entregas este mismo plan para que, por fin, lo construya.
