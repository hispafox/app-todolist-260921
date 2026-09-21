---
submódulo: M9.3
tipo: lab
tipo-lab: construcción
título: "Lab M9.3 — Un agente que documenta para quien no programa"
base: "temario/GHCOPTL-M9.3-el-agente-documentador-y-el-manual.md"
rama-referencia: "submodulo-9.3/documentador-usuario"
repo-ejemplos: "hispafox/AppTodoList-curso"
lab-version: 1
actualizado: 2026-07-10
---

# 🧪 Lab M9.3 — Un agente que documenta para quien no programa

> **Lab versión 1 · Última actualización 2026-07-10 · Base:** [M9.3 — El agente documentador y el manual de usuario](../temario/GHCOPTL-M9.3-el-agente-documentador-y-el-manual.md)

En el capítulo diseccionaste `documentador-usuario`: un agente con el contrato de poder más estrecho del curso, que pregunta antes de escribir y deja huecos etiquetados para las capturas que aún no existen. También viste que su propia ficha terminó prometiendo algo que nunca se construyó. Aquí construyes tu propia versión de ese agente, lo pones a documentar una funcionalidad real de tu proyecto, y cierras comprobando por tu cuenta si el resumen que te da coincide con lo que realmente escribió.

---

## En este lab

- **Overview** — qué practicas
- **Punto de partida** — dónde retomas
- **Ejercicio 1** — Encárgale el agente
- **Ejercicio 2** — Documenta una funcionalidad tuya
- **Ejercicio 3** — Conviértelo a Word
- **Ejercicio 4** — Cuenta los huecos a mano
- **Definition of Done**
- **Comparar con la referencia**
- **Reto opcional** — corrige la ficha del agente
- **Lo que has practicado + puente al Lab 9.4**

---

## Overview

Al terminar este lab sabrás construir un agente con permisos acotados a un único tipo de artefacto —lee todo el proyecto, escribe solo en `docs/`—, verificar que pregunta antes de asumir qué necesitas, y comprobar por ti mismo que un resumen automático no siempre dice la verdad sobre lo que produjo.

> ⏱️ Tiempo estimado: 30-40 min.

---

## Punto de partida

**Requisitos** (los mismos de todo el curso): VS Code con la extensión de GitHub Copilot en modo agente, y tu repositorio de siempre, publicado en GitHub.

Sigues en el mismo proyecto, en tu única rama. Tu aplicación ya tiene tareas, categorías, plantillas y usuarios asignados, cada una con su controlador y su página en el frontend. Ese es el material que vas a documentar aquí: no escribes código de aplicación nuevo, construyes el agente que traduce el que ya tienes.

> 💡 **Tu red de seguridad: la demo del curso.** Cuando termines, te asomas a la rama de este capítulo en tu clon de `AppTodoList-curso` para comparar. Solo para mirar, como en cada lab.

---

## Ejercicio 1 — Encárgale el agente

*Como en cada agente de este curso, no lo escribes tú a mano: se lo describes a GitHub Copilot con el mismo encargo real de clase, en dos pasos.*

### Tarea 1.1 — El encargo inicial

1. Pídeselo con el primer prompt real de la sesión:

   > **«Necesito un agente creador de documentación para el usuario, para documentar el uso de la aplicación con escritura en docx, pdf, o markdown. Debe analizar el proyecto para determinar si hay que actualizar el manual del usuario. Deja espacio para placeholder en la documentación indicando dónde poner capturas o recursos diversos (infografías, etc.) en la documentación.»**

   → **Qué esperar:** GitHub Copilot crea `.github/agents/documentador-usuario.agent.md`, con `tools: [read, search, edit, terminal]` y una sección de restricciones que limita la escritura a `docs/`, nunca a código de producción.

   🔎 **Por qué esta herramienta y no `execute`.** Fíjate en `terminal`: no la habías visto en ningún agente anterior. `execute` servía para comprobar que algo compilaba; `terminal`, aquí, sirve para lanzar un comando que produce un fichero nuevo. Confírmalo abriendo el `agent.md`: si ves `execute` en vez de `terminal`, pídele a GitHub Copilot que revise la sección de herramientas contra el objetivo del agente, generar documentos, no verificar código.

### Tarea 1.2 — Que use los skills existentes y que pregunte primero

2. Añade la segunda condición, tal como se pidió en clase:

   > **«Utiliza los skills existentes de docx y pdf para generar los manuales a petición, el tipo de documentación se pide al inicio del proceso, si no lo tienes pregunta por el formato.»**

   → **Qué esperar:** GitHub Copilot añade al `agent.md` un paso 0, antes de tocar una línea de código: dos preguntas, formato de salida (Markdown, Word o PDF) y tipo de documentación (completa, cambios o guía rápida), con un valor por defecto —completa, en Markdown— si no respondes.

   ⚠️ **Error común.** Si el agente que te devuelve GitHub Copilot se pone a escribir en cuanto lo invocas, sin preguntar nada, la condición del paso 0 no quedó bien fijada en el `agent.md`. Ábrelo, localiza esa sección y confirma que las dos preguntas están explícitas, no solo mencionadas de pasada.

3. Sube el cambio:

   > **«Sube todos los cambios a GitHub.»**

---

## Ejercicio 2 — Documenta una funcionalidad tuya

*El manual real del capítulo cubre la aplicación entera. Aquí acotas el encargo a una sola funcionalidad tuya —tareas, categorías, plantillas o usuarios asignados—, con tus propias palabras, y observas cómo responde el paso 0 que acabas de fijar.*

### Tarea 2.1 — Invócalo, acotado a una parte

1. Elige una funcionalidad de tu aplicación y pídele al agente que la documente, con una frase tuya, sin sobrecargarla de detalle —algo como «documenta el uso de categorías, en Markdown, guía rápida»—.

   → **Qué esperar:** si tu frase ya trae el formato y el tipo, el agente no pregunta: analiza `Controllers/`, `Dtos/` y la página del frontend correspondiente, y escribe el manual directamente. Si dejaste algún dato fuera, te hace la pregunta que le falta antes de escribir nada.

   💡 **Pista.** Prueba una vez completo y otra vez a medias —«documenta categorías» sin más— para ver el paso 0 en marcha en el segundo caso. Es el mismo gesto que ya conoces del `prompt-engineer` de 6.2, aplicado ahora a quién va a leer el resultado, no a qué agente lo va a usar después.

### Tarea 2.2 — Confirma el hueco a propósito

2. Abre el manual que acaba de escribir en `docs/` y busca al menos una marca `[PLACEHOLDER: ...]`.

   → **Qué esperar:** el hueco trae, debajo, un comentario HTML con lo que debería verse en esa captura —qué campos, qué botones, qué estado—, no un genérico «pon una imagen aquí».

   🔎 **Por qué importa que sea concreto.** Un hueco que solo dice «falta una imagen» no le sirve a quien venga después a rellenarlo. El comentario invisible es la parte que hace el hueco útil: describe la captura sin poder tomarla.

---

## Ejercicio 3 — Conviértelo a Word

*En clase, el primer intento de pasar el manual a Word se quedó a medio camino: el agente escribió el script de conversión, pero no llegó a ejecutarlo. La corrección estuvo en arreglar el agente para que la próxima vez lo terminara solo, en lugar de repetir el paso a mano. Y una vez resuelto, la sesión levantó un segundo generador —el mismo Word por otro runtime—, que también reconstruyes aquí.*

### Tarea 3.1 — Pide el Word

1. Pídeselo con el prompt real de aquella sesión:

   > **«Crea en formato docx el manual del usuario.»**

   → **Qué esperar:** el agente invoca el skill `docx` y genera un script de conversión. Es posible que el `.docx` no aparezca todavía en `docs/`: el script existe, pero nadie lo ha lanzado.

### Tarea 3.2 — Si se quedó a medias, corrige el agente, no el resultado

2. Si no encuentras el `.docx`, no lo generes tú a mano ni le pidas «genera tú el manual». Corrige el molde, con el prompt real de clase:

   > **«Modifica el agente para que pueda lanzar el script de generación de word y pdf.»**

   → **Qué esperar:** GitHub Copilot añade al `agent.md` el paso que faltaba: ejecutar el script con `terminal` en cuanto lo genera. Y esta vez el `.docx` sí aparece en `docs/`.

   🔎 **Por qué corregir el agente y no el resultado.** Ya viste esta disciplina en 7.3: cuando algo falla una vez, arreglas el molde que lo produjo, para que el síntoma no vuelva. Un manual corregido a mano se rompe otra vez la próxima que lo regeneres; un agente corregido aguanta.

3. Si el `.docx` apareció a la primera, no hay nada que corregir en el agente: pasa a la Tarea 3.3.

### Tarea 3.3 — El segundo camino, en Python

4. En clase, con el Word ya saliendo, la sesión pidió tener también un generador en Python, para no depender del runtime de JavaScript que el skill `docx` trae por defecto —la misma tensión que resolviste en 9.2—. Pídelo con el prompt real de aquel momento:

   > **«De todos modos, docx y pdf generan scripts, ¿verdad? Si es así, que el agente los pueda lanzar y genere el pdf o el word con esos scripts generados por los skills docx y pdf.»**

   → **Qué esperar:** el agente deja dos generadores para el mismo `.docx`, uno en JavaScript (el del paquete `docx`) y otro en Python (`python-docx`), y su `README` los describe como dos opciones que acaban en el mismo fichero. Es el patrón de los dos caminos que ya viste a mayor escala en 9.2, ahora aplicado al manual.

   💡 **Pista.** No busques que el resultado cambie: el `.docx` es el mismo por los dos caminos. Lo que ganas es no atarte a un runtime; si tu proyecto ya está en Python, tienes la opción a mano.

---

## Ejercicio 4 — Cuenta los huecos a mano

*El manual real del capítulo trae su propio resumen, y ese resumen se equivocaba en la cuenta de placeholders. Comprueba si el tuyo también.*

### Tarea 4.1 — Pide el resumen, y cuenta aparte

1. Pídele al agente que te diga cuántos `[PLACEHOLDER]` dejó en el manual que acaba de escribir.

2. Ahora cuenta tú, a mano o con una búsqueda de texto en tu editor, cuántas marcas `[PLACEHOLDER:` hay de verdad en el fichero.

   → **Qué esperar:** puede que las dos cifras coincidan, o puede que no. Lo que cuenta aquí es el hábito: no le pediste al agente que se corrigiera a sí mismo, lo comprobaste tú.

   🔎 **Por qué este ejercicio cierra el capítulo.** El manual real de este capítulo decía en su resumen que dejaba 18 capturas por rellenar, cuando el fichero traía 28. Ni el agente que documenta se libra de que su propio resumen se quede corto. La comprobación que le exiges a cualquier fichero del proyecto —abrir el artefacto real y contar, en vez de fiarte del resumen— vale igual para lo que produce el agente que acabas de construir.

---

## Definition of Done

Este lab no toca código de aplicación: construye un agente y los documentos que produce. Lo has terminado cuando:

- [ ] Existe `.github/agents/documentador-usuario.agent.md`, con `tools: [read, search, edit, terminal]` y la restricción a escribir solo en `docs/`.
- [ ] El agente pregunta formato y tipo de documentación cuando el prompt no los trae, y no pregunta cuando ya los tiene.
- [ ] Tienes un manual en `docs/` con al menos un `[PLACEHOLDER]` y su comentario HTML de qué debería mostrar.
- [ ] Tienes el `.docx` de ese manual, y si el primer intento se quedó a medias, corregiste el `agent.md` para que lo terminara, sin rehacer el `.docx` a mano.
- [ ] El agente deja dos generadores para ese `.docx`, uno en JavaScript y otro en Python, con el mismo resultado.
- [ ] Has contado los `[PLACEHOLDER]` reales del manual y los has comparado con el resumen del agente.
- [ ] Tu resultado coincide con el de la rama de referencia.

---

## Comparar con la referencia

La solución de referencia está en la demo del curso, `AppTodoList-curso`, en su rama `submodulo-9.3/documentador-usuario`.

```bash
cd AppTodoList-curso
git checkout submodulo-9.3/documentador-usuario
```

Abre su `.github/agents/documentador-usuario.agent.md` y compáralo con el tuyo: mismo contrato de poder, misma restricción a `docs/`, mismo paso 0 de preguntar antes de escribir. No hace falta que el manual que generes tú documente lo mismo que el de referencia —tú elegiste tu propia funcionalidad—, lo que importa es que el agente se comporte igual.

Cuando termines de mirar, vuelve a tu proyecto y sigue con lo tuyo.

---

## Reto opcional — corrige la ficha del agente

El capítulo te dejó un cabo suelto a propósito: el `agent.md` real, el mensaje de un commit y una tabla de arquitectura prometen los tres un camino a PDF que nunca se construyó. Abre tu propio `agent.md` y busca si tiene la misma promesa sin cumplir. Si la tiene, corrígela: bórrala, o complétala del todo generando el script de PDF que falta con el skill `pdf` del capítulo anterior. Cualquiera de las dos vale; lo que no vale es dejarla ahí, sabiendo ya que no es cierta.

---

## Lo que has practicado

Construiste un agente con permisos acotados a un solo tipo de artefacto y comprobaste que pregunta antes de asumir qué necesitas. Cuando la primera conversión a Word se quedó a medias, arreglaste el agente para que la terminara solo la próxima vez —el mismo gesto de 7.3—. Y un dato que el propio agente te había resumido lo verificaste contando por tu cuenta, en vez de darlo por bueno.

**Puente al Lab 9.4.** Tu manual quedó con huecos `[PLACEHOLDER]` bien etiquetados, pero siguen vacíos. En el próximo lab diriges a Playwright para que los rellene, y para que los vuelva a rellenar solo cuando la interfaz cambie.
