---
submódulo: M6.2
tipo: lab
tipo-lab: construcción
título: "Lab M6.2 — El agente sin manos"
base: "temario/GHCOPTL-M6.2-el-agente-prompt-engineer.md"
rama-referencia: "submodulo-6.2/prompt-engineer"
repo-ejemplos: "hispafox/AppTodoList-curso"
lab-version: 1
actualizado: 2026-07-07
---

# 🧪 Lab M6.2 — El agente sin manos

> **Lab versión 1 · Última actualización 2026-07-07 · Base:** [M6.2 — El agente `prompt-engineer`](../temario/GHCOPTL-M6.2-el-agente-prompt-engineer.md)

En el capítulo leíste la anatomía de un agente sin herramientas: `tools: []`, y el porqué de que aun así valga la pena. Aquí lo construyes tú, con el mismo encargo que se le dio en clase, y lo pones a trabajar con una idea a medio formar de verdad —la misma que dio origen al ejemplo del capítulo—. Al final tienes en la mano un prompt con los cuatro pilares completos, listo para el planificador de 6.3.

---

## En este lab

- **Overview** — qué practicas
- **Punto de partida** — dónde retomas
- **Ejercicio 1** — Encárgale a GitHub Copilot el agente `prompt-engineer`
- **Ejercicio 2** — Invócalo con una idea a medio formar
- **Definition of Done**
- **Comparar con la referencia**
- **Reto opcional** — tu propia idea a medias
- **Lo que has practicado + puente al Lab 6.3**

---

## Overview

Al terminar este lab sabrás **crear un agente conversacional desde cero** —el más sencillo posible, sin una sola herramienta— y **usarlo de verdad** para convertir una idea vaga en un prompt con los cuatro pilares completos. El entregable es un `.agent.md` real en tu repositorio, más el prompt optimizado que te devuelve al invocarlo.

El porqué de que, vacío de herramientas, el agente cumpla igual su trabajo —más los cuatro pilares y el proceso de preguntar hasta completarlos— lo tienes en la base del capítulo. Aquí haces la parte que te toca a ti: construirlo y ponerlo a prueba, aunque el agente en sí, irónicamente, no tenga manos para nada.

> ⏱️ Tiempo estimado: 25-35 min.

---

## Punto de partida

**Requisitos** (los mismos de todo el curso): VS Code con la extensión de GitHub Copilot en modo agente, y tu repositorio de siempre, publicado en GitHub.

Sigues en tu mismo proyecto. El capítulo anterior, el 6.1, fue de lectura pura: abriste el plano del equipo, pero no tocaste tu código. Aquí vuelves a construir, con el primer componente real de la capa de agentes. Todo en la misma rama de siempre: aquí tampoco creas ramas.

> 💡 **Tu red de seguridad: la demo del curso.** Cuando termines, te asomas a la rama de este capítulo en tu clon de `AppTodoList-curso` para comparar. Solo para mirar, como en cada lab.

---

## Ejercicio 1 — Encárgale a GitHub Copilot el agente `prompt-engineer`

*Un `.agent.md` tampoco se escribe a mano de cero: se lo encargas a GitHub Copilot, describiéndole el rol que quieres que cumpla. Aquí le pides, tal cual se pidió en clase, el agente que ayuda a construir prompts. Experimenta a tu aire con el encargo; cuanto más claro el criterio que le das, mejor sale el primer borrador.*

### Tarea 1.1 — Descríbele el agente que quieres

1. En modo agente, pídeselo con el mismo encargo real del capítulo:

   > **«Necesito un agente ayudante de creación de prompts para desarrollo, que tenga en cuenta los cuatro pilares base de un buen prompt; si el prompt que aporta el usuario no tiene esta información, pregunta hasta obtenerla. Prepara el agente con todas las buenas prácticas de creación de prompts adecuados para desarrollo de aplicaciones, y que dé una respuesta optimizada.»**

   → **Qué esperar:** GitHub Copilot no se queda en proponerlo: crea directamente el fichero en `.github/agents/prompt-engineer.agent.md`, con su frontmatter (`description`, `name: Prompt Engineer`, y la línea que vas a mirar con lupa: `tools: []`, vacía) y un cuerpo que fija el rol en una frase: eres un experto en ingeniería de prompts para desarrollo de software, y tu único objetivo es ayudar a construir el prompt más efectivo posible.

   🔎 **Por qué este prompt.** Fíjate en lo que le pides y en lo que no. Le dices **qué** hace (crear y optimizar prompts), **con qué criterio** (los cuatro pilares) y **la regla que lo gobierna** (preguntar si algo falta). No le dices una palabra de herramientas: no hace falta pedir `tools: []` a propósito, porque un agente que solo conversa no necesita ninguna para cumplir su encargo. GitHub Copilot lo deduce del rol que le describes.

### Tarea 1.2 — Mira lo que ha creado, y guárdalo

2. Ábrelo y busca la línea de las herramientas. Confirma que dice `tools: []`, los corchetes vacíos: sin `read`, sin `search`, sin `edit`, sin `execute`.

   ⚠️ **Error común.** Si GitHub Copilot te añade alguna herramienta «por si acaso» —lo más típico, `read`, para que «pueda mirar tu código»—, pídele que la quite y te explique por qué el agente no la necesita. La respuesta correcta: su trabajo termina antes de tocar tu proyecto.

3. Guarda el cambio y súbelo, tal como se cerró aquella sesión:

   > **«Sube los cambios.»**

   → **Qué esperar:** GitHub Copilot hace el commit y el `push` del nuevo agente a tu repositorio, igual que con cualquier otro fichero versionado.

---

## Ejercicio 2 — Invócalo con una idea a medio formar

*La prueba de que este agente sirve es dejar que te frene. Vas a darle la misma idea a medias que se le dio en clase, ver cómo la desmonta pilar por pilar, y completar lo que le falta hasta que suelte el prompt optimizado.*

### Tarea 2.1 — Dale la idea tal como salió, sin pulir

1. Invoca al `prompt-engineer` con el mismo encargo vago del capítulo, palabra por palabra:

   > **«Necesito ahora categorías para las tareas.»**

   → **Qué esperar:** el agente no te da nada todavía. Analiza tu frase pilar por pilar y la clasifica: la **Tarea** queda ⚠️ —parcial, «categorías» sin decir de qué tipo ni con qué alcance—; el **Rol** y el **Contexto** pueden salir ✅ si tu proyecto está abierto y el agente ve tu código; y el **Formato de salida** queda ❌, porque no se lo has dicho. Te pregunta, agrupado en un solo mensaje: qué relación tiene una tarea con sus categorías, si hace falta un CRUD completo, qué campos lleva cada una, y cómo quieres la respuesta.

   💡 **Pista.** Si arrancas de un repositorio vacío, sin ficheros que el agente pueda mirar, es normal que también te pregunte por el Rol y el Contexto. La clasificación depende de lo que ya sabe de ti; con menos alrededor, pregunta más.

### Tarea 2.2 — Completa lo que falta

2. Respóndele con las mismas aclaraciones reales de aquella sesión:

   > **«1. Una tarea pertenece a una categoría. 2. Sí, necesitamos un CRUD de categorías. 3. Los campos son id, nombre y color. 4. Necesito filtrar tareas por categoría. El formato de salida es para el agente planificador.»**

   → **Qué esperar:** con los cuatro pilares ya en ✅, el agente te entrega el prompt optimizado: un bloque con ROL, CONTEXTO, TAREA y FORMATO, con la entidad real `TodoItem` puesta por delante, la relación 1:N con `CategoriaId` nullable, y un criterio de éxito medible. Es prácticamente el mismo bloque que viste en la base, en «El prompt optimizado» —ábrela al lado y compáralo—.

   🔎 **Por qué importa que lo compares.** No busques que salga idéntico palabra por palabra: busca que **estén los cuatro pilares**, que la tarea venga descompuesta en pasos con criterio de éxito, y que el formato esté pensado para quien lo reciba después —el planificador de 6.3—, no para ti.

---

## Definition of Done

Este capítulo entrega un agente que solo conversa, no código compilable. Aquí «terminado» significa dos cosas a la vez: tienes el fichero, y tienes la conversación real que lo puso a prueba. Lo has terminado cuando:

- [ ] Existe `.github/agents/prompt-engineer.agent.md` en tu repositorio, con `tools: []` vacías y el rol de experto en ingeniería de prompts en el cuerpo.
- [ ] Lo has invocado con una idea a medias y te ha **clasificado los cuatro pilares** antes de responder, sin generar nada hasta tenerlos completos.
- [ ] Tienes en la mano un **prompt optimizado** con ROL, CONTEXTO, TAREA y FORMATO, y sabes explicar qué pilar cubre cada bloque.
- [ ] Sabes explicar por qué `tools: []` no le resta valor al agente: es, justamente, su diseño.

---

## Comparar con la referencia

La solución de referencia está en la demo del curso, `AppTodoList-curso`, en su rama `submodulo-6.2/prompt-engineer`. La usas solo para mirar.

```bash
cd AppTodoList-curso
git checkout submodulo-6.2/prompt-engineer
```

Abre su `.github/agents/prompt-engineer.agent.md` y ponlo al lado del tuyo. No tiene por qué coincidir palabra por palabra —tu redacción del encargo influye—, pero lo esencial sí debe estar: `tools: []`, el rol de experto en prompts, y la mención a los cuatro pilares con la disciplina de preguntar hasta completarlos.

Cuando termines de mirar, vuelve a tu proyecto y sigue con lo tuyo.

---

## Reto opcional — tu propia idea a medias

Piensa en algo que le hayas pedido a GitHub Copilot últimamente con una frase corta, de las que dejan huecos a propósito —«añade autenticación», «mejora el rendimiento de esto»—. Pásaselo tal cual al `prompt-engineer` y deja que te pregunte. Compara el prompt que te devuelve con el que habrías escrito tú a ojo, sin el agente de por medio. Si la diferencia se nota, ya sabes cuándo merece la pena pasar por él antes de pedir directamente.

---

## Lo que has practicado

Has construido tu primer agente conversacional, con el contrato de poder más corto que existe: vacío. Y lo has puesto a trabajar de verdad: le diste una idea a medias, te frenó hasta que la completaste, y te devolvió un encargo con los cuatro pilares en su sitio. Esa es la capa de agentes, empezando por el más desnudo de todos.

**Puente al Lab 6.3.** Ese prompt que acabas de fabricar no se queda en un cuaderno: es, literalmente, lo que le vas a entregar al siguiente agente. En el Lab 6.3 conoces al **planificador**, el primero de la serie cuyo contrato de poder deja de estar vacío —puede leer tu código y escribir un fichero—, y le pasas tu prompt optimizado para que lo convierta en un plan de trabajo real.
