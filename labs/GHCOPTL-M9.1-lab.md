---
submódulo: M9.1
tipo: lab
tipo-lab: construcción
título: "Lab M9.1 — Pon la documentación al día con el código"
base: "temario/GHCOPTL-M9.1-sincronizar-la-doc-con-el-codigo.md"
rama-referencia: "submodulo-9.1/actualizar-documentacion"
repo-ejemplos: "hispafox/AppTodoList-curso"
lab-version: 1
actualizado: 2026-07-09
---

# 🧪 Lab M9.1 — Pon la documentación al día con el código

> **Lab versión 1 · Última actualización 2026-07-09 · Base:** [M9.1 — Sincronizar la documentación con el código](../temario/GHCOPTL-M9.1-sincronizar-la-doc-con-el-codigo.md)

En el capítulo leíste cómo dos documentos que explican tu sistema —el de la arquitectura de agentes y el catálogo de skills— se quedaron una versión atrás del código sin que nadie lo notara, cómo corregirlos destapó un diagrama Mermaid que se negaba a renderizar, y cómo esa lección terminó empaquetada en un skill. Aquí lo haces tú: auditas tu propia documentación contra tu código real, corriges lo que ya no es verdad, domas el diagrama que rompe, y construyes el skill que te ahorrará el dolor la próxima vez.

---

## En este lab

- **Overview** — qué practicas
- **Punto de partida** — dónde retomas
- **Ejercicio 1** — Audita antes de tocar nada
- **Ejercicio 2** — Corrige el contenido por prioridad
- **Ejercicio 3** — El diagrama que no renderiza
- **Ejercicio 4** — De la lección al skill
- **Definition of Done**
- **Comparar con la referencia**
- **Reto opcional** — mete un agente nuevo y mira el desfase
- **Lo que has practicado + puente al Lab 9.2**

---

## Overview

Al terminar este lab sabrás pedirle a GitHub Copilot que audite un documento técnico contra el código que describe, corregir el desfase por prioridad (nombres primero, diagramas al final), aplicar la lista de reglas de Mermaid a un diagrama que no renderiza, y capturar todo el procedimiento en un skill reutilizable, `actualizar-documentacion`.

> ⏱️ Tiempo estimado: 40-50 min.

---

## Punto de partida

**Requisitos** (los mismos de todo el curso): VS Code con la extensión de GitHub Copilot en modo agente, y tu repositorio de siempre, publicado en GitHub.

Sigues en el mismo proyecto. Después de M04-M08 tu repositorio tiene ya un equipo de agentes en `.github/agents/`, un puñado de skills en `.github/skills/`, y dos documentos en `docs/` que cuentan cómo encaja todo: `docs/ARQUITECTURA-AGENTES.md` (el equipo de agentes y su coordinación) y `docs/skills-orquestacion.md` (el catálogo de skills que conoces desde 4.7). Cerraste 8.3 tocando a mano un nodo del diagrama de ese catálogo. En este lab no escribes código de la aplicación: trabajas sobre esos documentos. Todo en la misma rama de siempre; aquí tampoco creas ramas.

> 💡 **Tu red de seguridad: la demo del curso.** Cuando termines, te asomas a la rama de este capítulo en tu clon de `AppTodoList-curso` para comparar. Solo para mirar, como en cada lab.

---

## Ejercicio 1 — Audita antes de tocar nada

*El instinto es abrir el documento y empezar a corregir. Resiste. Antes de escribir una línea, hace falta saber con datos qué ha cambiado de verdad en el código; si no, corriges lo que ya estaba bien y dejas intacto lo que fallaba. Es la misma disciplina que aplicarías al volver a un proyecto tras meses fuera: lees lo que hay, en vez de fiarte de lo que recuerdas.*

### Tarea 1.1 — Pide analizar, no arreglar

1. Pídeselo a GitHub Copilot con el mismo verbo con que empezó la sesión de clase —«analiza», no «corrige»—:

   > **«Analiza el contenido de arquitectura de agentes por si hay cambios con lo que tenemos actualmente.»**

   → **Qué esperar:** Copilot lista tus agentes reales (`.github/agents/*.agent.md`) y los compara contra lo que afirma `docs/ARQUITECTURA-AGENTES.md`, sin tocar todavía el documento. Fíjate en si contrasta bien las cuatro cosas que importan: los nombres coinciden, las responsabilidades son precisas, el flujo de llamadas entre agentes es correcto, y las herramientas que menciona (`read`, `search`, `edit`, `execute`) existen de verdad.

   💡 **Pista.** Fija el marco de la auditoría con una segunda frase, la misma de clase:

   > **«Ten en cuenta que estamos en GitHub Copilot.»**

   El equipo que hay que auditar es el que funciona hoy, en esta herramienta, con estos agentes concretos: nada de un equipo de agentes cualquiera, ni de la versión anterior de tu propio proyecto.

   🔎 **Por qué analizar primero.** Una auditoría que dependiera de «acordarse» de lo que cambió sería tan poco fiable como la documentación que intenta corregir. Solo merece ese nombre la que compara ficheros reales contra lo que el documento afirma.

### Tarea 1.2 — Repite la auditoría sobre el catálogo de skills

2. Ahora el segundo documento, con el mismo gesto:

   > **«Ahora revisa el de skills-orquestacion.»**

   → **Qué esperar:** Copilot lista tus skills reales (`.github/skills/*/SKILL.md`) y los compara contra `docs/skills-orquestacion.md`. Aquí es donde el desfase se ve con más nitidez, porque lo puedes contrastar tú mismo contra capítulos que ya conoces: ¿siguen documentados todos los skills, coinciden sus descripciones con el `name`/`description` del frontmatter YAML, y refleja el orden del catálogo las dependencias reales entre ellos?

   ⚠️ **Error común.** No mezcles los dos pasos en un solo prompt gigante. Auditar documento a documento te deja ver el desfase de cada uno por separado; una auditoría «de todo a la vez» te devuelve una lista larga en la que se pierde el hallazgo que importa.

---

## Ejercicio 2 — Corrige el contenido por prioridad

*La auditoría ya te dijo qué ha dejado de ser verdad. Ahora sí escribes, pero con un orden: primero los nombres y la estructura, después los flujos y las dependencias, y los diagramas al final (esos tienen su propio ejercicio). El orden no es capricho: un nombre mal puesto confunde más que un diagrama feo, y arreglar el diagrama antes de fijar los nombres es rehacer trabajo.*

### Tarea 2.1 — Confirma y deja que corrija

1. Da luz verde a la propuesta de la auditoría, como en clase:

   > **«Sí, actualiza el documento.»**

   → **Qué esperar:** Copilot corrige `ARQUITECTURA-AGENTES.md` con los ajustes de precisión que encontró —quién invoca a quién, qué herramienta usa cada agente, quién es el único que llega a tocar Git—. El documento sigue contando la misma historia que ya conoces de 6.1: cuatro papeles (orquestador, planificador, desarrollador, verificador), cada uno con su contrato de tools, y solo `@orquestador-apptodolist` cierra el ciclo con un commit.

### Tarea 2.2 — El desfase que sí puedes comprobar tú mismo

2. Pasa al catálogo y deja que lo corrija:

   > **«Actualiza el documento.»**

   → **Qué esperar:** el arreglo clave está en la fila de `nueva-feature`. El catálogo la describía como el cerebro del sistema:

   ```diff
   -| `nueva-feature` | _todas_ | **Orquestador principal.** Implementa cualquier feature nueva
   -de principio a fin. Invoca el resto de skills en orden. |
   ```

   Y queda así:

   ```diff
   +| `nueva-feature` | _todas_ | **Implementación completa end-to-end.** Detecta qué capas
   +afecta la feature y orquesta la invocación de todos los skills necesarios en orden. |
   ```

   🔎 **Por qué cambia de papel y no desaparece.** Vuelve un momento a 5.1: allí `nueva-feature` era lo más parecido a un orquestador que había, porque aún no existía ningún agente. M06 y M07 llegaron después, y con ellos `@desarrollador-apptodolist`, que lee el plan del `@planificador-apptodolist` y va invocando cada skill en el orden que fija ese plan. Desde entonces la fila dejó de ser precisa, y ahí siguió, sin que nadie la tocara, durante dos capítulos enteros del proyecto. `nueva-feature` conserva su valor, solo cambia de etiqueta: pasa de anunciarse como el cerebro del sistema a ser lo que de verdad es hoy, la vía rápida para resolver una característica completa de una sentada.

   💡 **Pista.** La corrección buena añade además una sección nueva al principio, «0. Agentes vs. Skills», con una frase que resume el ajuste: «Los skills son las herramientas. Los agentes son quienes las usan.» Si Copilot no la propone, pídesela: es lo que evita que el próximo lector vuelva a confundir una cosa con otra.

---

## Ejercicio 3 — El diagrama que no renderiza

*Corregir el texto era, en teoría, la parte difícil. Resultó ser la fácil. En cuanto toca actualizar el diagrama de flujo del catálogo —el que dibuja la cadena de skills que conoces desde 4.7— algo deja de funcionar, y el texto se ve perfectamente bien en el editor. Falla la sintaxis, invisible a simple vista.*

### Tarea 3.1 — Provoca el fallo y léelo

1. Al regenerar el diagrama con el nombre corregido, es muy probable que te salte:

   > **«Hay parse error en el documento de orquestación de skills.»**

   → **Qué esperar:** el diagrama no pinta. El nodo raíz combinaba tres cosas a la vez dentro de una sola etiqueta —un emoticono, un salto de línea escrito como texto (`\n`) y una frase larga entre comillas—:

   ```
   Antes:  NF(["🚀 nueva-feature\nPetición de feature"])
   Después: DEV([desarrollador-apptodolist])
   ```

   Cualquiera de las tres, por separado, puede atascar al intérprete de Mermaid; las tres juntas, en varios nodos, lo garantizan.

### Tarea 3.2 — No lo arregles a medias

2. Si tocas solo el nodo más llamativo, te va a volver a fallar —y en clase pasó dos veces seguidas—:

   > **«Sigue con parse error !!!»**

   > **«Seguimos con parse error !!!! en el primer diagrama de orquestación de skills.»**

   ⚠️ **Error común (el de clase, literal).** El primer y el segundo intento tocaron una sola cosa cada vez y dieron por hecho que bastaba. No basta: si queda un `\n` o una tilde escondida en otro nodo, el diagrama sigue roto. Pídele a Copilot que aplique la estrategia sistemática, nodo a nodo, en este orden:

   1. Elimina los saltos de línea de las etiquetas.
   2. Quita los emoticonos de las etiquetas de nodos.
   3. Reemplaza los caracteres con tilde: `ó` → `o`, `í` → `i`.
   4. Retira las etiquetas de flecha largas.
   5. Usa formas simples, `[texto]`, en vez de formas decoradas.
   6. Si el diagrama sigue fallando, quita estilos especiales hasta que renderice.

   🔎 **Por qué el orden importa.** «Hazlo paso a paso, y si con eso no basta, sigue simplificando.» La regla que de verdad sobrevive va más allá de «evita los emoticonos»: simplifica de forma sistemática, y da el diagrama por bueno solo cuando renderiza —nunca cuando parece que debería—.

### Tarea 3.3 — Confirma que pinta

3. Previsualiza el Markdown en tu editor y comprueba que el diagrama renderiza de principio a fin. Un diagrama que no se ve deja de contar la verdad sin avisar: trátalo como el fallo de contenido que es, con la misma urgencia que un dato mal escrito.

---

## Ejercicio 4 — De la lección al skill

*Tres intentos te ha costado esta lección sobre auditar y sobre sintaxis de Mermaid. El gesto que cierra el capítulo —el mismo que viste en 7.3 con el círculo virtuoso— es no dejar que esa lección se pierda: capturarla en un artefacto que la aplique la próxima vez sin que tengas que sufrirla de nuevo.*

### Tarea 4.1 — Pide el skill

1. Con los dos documentos ya al día, haz la pregunta que cerró la sesión:

   > **«Con este conocimiento que hemos aplicado para la documentación de agentes y skills, ¿puedes hacer un skill para mantener la documentación actualizada?»**

   → **Qué esperar:** GitHub Copilot crea `.github/skills/actualizar-documentacion/SKILL.md`. Su frontmatter fija el interruptor que ya conoces desde 2.1 —la `description` que decide cuándo se activa solo— y un `argument-hint` con tres alcances con nombre (`agentes`/`skills`/`arquitectura`) o vacío para la auditoría completa. El cuerpo recoge, formalizados, los cuatro pasos que acabas de vivir: auditar, identificar discrepancias en una tabla «dice / debería decir», actualizar por prioridad, y validar.

   💡 **Pista.** Revisa que el `SKILL.md` incluya las reglas de Mermaid que sobrevivieron al fallo (la columna del sí y la del no) y la regla de fondo escrita sin rodeos: «La documentación sirve al código, no al revés: si el código y la documentación difieren, el código tiene razón.» Es el corazón del skill; si no está, pídeselo.

   🔎 **Por qué merece la pena.** El skill no repite las reglas por pedantería. La segunda frase de su cierre lo explica: «Documentación desactualizada es peor que ninguna.» Un hueco se nota a simple vista; un dato falso, con buena maquetación, pasa desapercibido —y cuanto más delegas en GitHub Copilot la lectura de tu sistema, más te juegas en que lo que lee sea verdad—.

### Tarea 4.2 — Comprueba que el skill tiene fronteras

2. Abre el `SKILL.md` y localiza sus límites: sí sincroniza nombres, corrige flujos y regenera diagramas; no crea documentación desde cero (eso es `diseño-analisis`, tu 3.1), ni genera documentación de API (para eso ya tienes Scalar, tu 8.1), ni escribe manuales de usuario (eso llega en 9.3). Un skill que lo hace todo no se dispara cuando debe; uno con fronteras claras, sí.

---

## Definition of Done

Este lab no toca la aplicación: pone su documentación al día y captura el procedimiento. Lo has terminado cuando:

- [ ] Has auditado `ARQUITECTURA-AGENTES.md` y `skills-orquestacion.md` contra el código real **antes** de corregir nada.
- [ ] La fila de `nueva-feature` en `skills-orquestacion.md` ya no dice «orquestador principal», sino que describe su papel real de implementación end-to-end.
- [ ] El catálogo tiene su sección «0. Agentes vs. Skills».
- [ ] El diagrama de flujo del catálogo **renderiza** en la previsualización, sin errores de parseo.
- [ ] Existe `.github/skills/actualizar-documentacion/SKILL.md`, con la `description` de activación, el proceso de cuatro pasos, las reglas de Mermaid y la regla de fondo.
- [ ] Tu resultado coincide con el de la rama de referencia.

---

## Comparar con la referencia

La solución de referencia está en la demo del curso, `AppTodoList-curso`, en su rama `submodulo-9.1/actualizar-documentacion`.

```bash
cd AppTodoList-curso
git checkout submodulo-9.1/actualizar-documentacion
```

Abre su `SKILL.md` de `actualizar-documentacion` y los dos documentos corregidos de `docs/`, y ponlos al lado de los tuyos. Lo esencial que debe coincidir: la fila de `nueva-feature` reescrita, la sección «0. Agentes vs. Skills», el diagrama que renderiza, y el `SKILL.md` con su proceso de cuatro pasos y las reglas de Mermaid. Fíjate menos en que cada palabra sea idéntica y más en que las decisiones sean las mismas.

Cuando termines de mirar, vuelve a tu proyecto y sigue con lo tuyo.

---

## Reto opcional — mete un agente nuevo y mira el desfase

Añade a `.github/agents/` un agente cualquiera —invéntate uno, `@revisor-textos-apptodolist`, con un par de líneas— y no toques ningún documento. Ahora ejecuta tu skill `actualizar-documentacion` sobre la carpeta de agentes. Debería detectar por sí solo que `ARQUITECTURA-AGENTES.md` y la tabla de `copilot-instructions.md` ya no listan a todo el equipo, y proponerte la corrección. Esa es la prueba de que el skill hace lo que promete: cazar el desfase en cuanto aparece, sin que tú tengas que acordarte de mirar. Cuando lo compruebes, borra el agente de prueba.

---

## Lo que has practicado

Te llevas la comprobación de que un documento se queda atrás sin que nadie haga nada malo por el camino, simplemente porque el sistema sigue moviéndose mientras la documentación se queda quieta —y la certeza, ya probada con tus manos, de que auditar contra el código real y domar la sintaxis de un diagrama es un trabajo mecánico, no un acto de fe.

**Puente al Lab 9.2.** Tu documentación técnica ya dice la verdad, pero solo la lee quien sabe interpretar Markdown y diagramas Mermaid. Un cliente, un responsable de proyecto o alguien que solo quiere entender qué se ha hecho no va a abrir tu `docs/`. En el próximo lab sacas esa misma documentación de ahí y la llevas a los formatos que de verdad circulan fuera del equipo técnico.
