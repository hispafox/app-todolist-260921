---
submódulo: M9.2
tipo: lab
tipo-lab: construcción
título: "Lab M9.2 — El análisis, en el formato que cada uno sabe abrir"
base: "temario/GHCOPTL-M9.2-exportar-a-formatos-humanos.md"
rama-referencia: "submodulo-9.2/exportar-formatos"
repo-ejemplos: "hispafox/AppTodoList-curso"
lab-version: 1
actualizado: 2026-07-10
---

# 🧪 Lab M9.2 — El análisis, en el formato que cada uno sabe abrir

> **Lab versión 1 · Última actualización 2026-07-10 · Base:** [M9.2 — Exportar a formatos que cualquiera sabe abrir](../temario/GHCOPTL-M9.2-exportar-a-formatos-humanos.md)

En el capítulo viste cómo el documento de análisis, escrito en Markdown desde 3.1, se exportó a Word y a PDF con dos skills que GitHub Copilot ya trae instalados. Viste también cómo la receta del primero chocó con el contexto real del proyecto antes de acertar. Aquí repites el mismo recorrido con tu propio documento: pides el Word, resuelves la fricción si aparece, pides el PDF sin sobresaltos, y antes de dar nada por bueno abres el `LICENSE.txt` de cada skill que uses.

---

## En este lab

- **Overview** — qué practicas
- **Punto de partida** — dónde retomas
- **Ejercicio 1** — El Word: pide, y resuelve la fricción si aparece
- **Ejercicio 2** — El PDF: la receta que acierta a la primera
- **Ejercicio 3** — El detalle que nadie mira: el `LICENSE.txt`
- **Definition of Done**
- **Comparar con la referencia**
- **Reto opcional** — el PowerPoint por tu cuenta
- **Lo que has practicado + puente al Lab 9.3**

---

## Overview

Al terminar este lab sabrás pedirle a GitHub Copilot que exporte un documento Markdown a Word y a PDF usando los skills `docx` y `pdf`, reconocer cuándo la receta que trae el skill no encaja con tu proyecto y corregirla sin perder el resultado que pedías, y leer el `LICENSE.txt` de un skill antes de darlo por bueno.

> ⏱️ Tiempo estimado: 25–35 min.

---

## Punto de partida

**Requisitos** (los mismos de todo el curso): VS Code con la extensión de GitHub Copilot en modo agente, y tu repositorio de siempre, publicado en GitHub.

Sigues en el mismo proyecto, en tu única rama. `docs/analisis-diseño.md` es el documento que construiste en 3.1 y que 9.1 dejó sincronizado con tu código real: sigue siendo el que usas aquí. No tocas la aplicación en este lab; el resultado son dos ficheros nuevos dentro de `docs/`.

> 💡 **Tu red de seguridad: la demo del curso.** Cuando termines, te asomas a la rama de este capítulo en tu clon de `AppTodoList-curso` para comparar. Solo para mirar, como en cada lab.

---

## Ejercicio 1 — El Word: pide, y resuelve la fricción si aparece

*El primer prompt de la sesión de clase no explicaba cómo generar el documento, solo qué documento y en qué formato. Pídeselo igual de corto y deja que GitHub Copilot elija el skill.*

### Tarea 1.1 — Pide el Word sin más detalle

1. Pídeselo a GitHub Copilot con el prompt real de clase:

   > **«Me generas una versión en Word utilizando el skill que tienes del análisis.»**

   → **Qué esperar:** GitHub Copilot abre `.github/skills/docx/SKILL.md`, lee su tabla de decisión, y sigue la receta que ahí encuentra para crear un documento desde cero: la biblioteca `docx-js`, en JavaScript. Es muy probable que, al seguirla al pie de la letra, instale esa dependencia con `npm` y te deje una carpeta `node_modules` dentro de `docs/`, la misma carpeta donde guardas el resto de tu documentación.

   ⚠️ **Error común (el de clase).** Si ves aparecer `node_modules` en `docs/`, no es un fallo tuyo: es la receta del skill, pensada para un ecosistema JavaScript, aplicada sin más a un proyecto ASP.NET Core que ya tiene su propio `node_modules` legítimo en el frontend.

### Tarea 1.2 — Si aparece fricción, pide Python

2. Si `node_modules` apareció, corta la receta con el mismo prompt de clase:

   > **«¿No puedes utilizar Python? Para el Word, digo.»**

   → **Qué esperar:** GitHub Copilot reescribe el generador con `python-docx`. El resultado es el mismo `.docx` que pedías —una portada, cabeceras de tabla en color y bloques de código con fondo gris—, solo que construido con otra herramienta.

   🔎 **Por qué este prompt y no otro.** No pides «hazlo mejor» ni «arréglalo»: propones la alternativa concreta que encaja con tu proyecto. Nombrar el lenguaje es lo que le permite a GitHub Copilot cambiar de camino sin tener que adivinar qué parte de lo anterior te molestaba.

3. Mira ahora dentro de `docs/`. Es muy posible que el `node_modules` siga ahí: cambiar de lenguaje no borra lo que la receta anterior ya instaló. En clase hizo falta un tercer prompt para eso, y salió con el enfado por delante:

   > **«¡Es que me has instalado el `node_modules`!»**

   → **Qué esperar:** GitHub Copilot limpia la carpeta `node_modules` de `docs/` y los ficheros de `npm` que la acompañan.

   💡 **Pista.** Colorear el fondo de una celda de tabla no viene de fábrica en `python-docx`: si el script que genera tu documento toca el XML interno a mano (una función tipo `set_cell_bg`, con `OxmlElement`), es la señal de que GitHub Copilot ya está fuera de la API de alto nivel, tal y como el propio `SKILL.md` anticipaba.

4. Si el `node_modules` **no** apareció —porque GitHub Copilot ya eligió Python de entrada—, no hay nada que corregir: sigue con el Ejercicio 2.

---

## Ejercicio 2 — El PDF: la receta que acierta a la primera

*Con la lección del Word ya aprendida, pide el PDF con la herramienta puesta por delante desde el principio.*

### Tarea 2.1 — Pide el PDF con Python de entrada

1. Pídeselo con el prompt real de clase:

   > **«Ahora, con el skill de PDF, generas el PDF, con Python.»**

   → **Qué esperar:** el `SKILL.md` de `pdf` ya recomendaba, para crear un documento desde cero, la biblioteca `reportlab` en Python: aquí no hay fricción que resolver. GitHub Copilot construye el PDF con el módulo `platypus` de `reportlab`, con la misma identidad visual del Word —el mismo azul de cabecera, el mismo tratamiento de los bloques de código—.

   🔎 **Por qué no hubo fricción esta vez.** No fue suerte: el `SKILL.md` de `pdf` recomienda Python desde su propia tabla de decisión, así que la receta y el contexto del proyecto coincidían desde el principio. Cuando coinciden, seguirla al pie de la letra es lo más rápido.

2. Abre el `analisis-diseño.pdf` resultante y confirma que se ve bien: portada, tablas, bloques de código legibles.

---

## Ejercicio 3 — El detalle que nadie mira: el `LICENSE.txt`

*Ninguno de los prompts anteriores mencionó este fichero, y sin embargo rige todo lo que puedes hacer con estos skills de aquí en adelante.*

### Tarea 3.1 — Abre el LICENSE.txt de cada skill que usaste

1. Abre `.github/skills/docx/LICENSE.txt` y `.github/skills/pdf/LICENSE.txt` en tu proyecto.

   → **Qué esperar:** el mismo texto en los dos, un aviso de copyright de Anthropic que prohíbe extraer el contenido del skill o redistribuirlo fuera del servicio donde lo usas.

   🔎 **Por qué importa.** El estándar `SKILL.md` —el formato del fichero, el frontmatter, el mecanismo que activa el skill correcto— es abierto. Que el estándar sea abierto no dice nada sobre si el contenido de un skill concreto también lo es. Antes de instalar cualquier skill de terceros, la pregunta de 2.2 sigue valiendo: quién lo publica y bajo qué condiciones.

   💡 **Pista.** Puedes seguir usando estos skills como los has usado aquí, dentro de GitHub Copilot, en cuantos proyectos quieras. Lo que la licencia veta es sacar el fichero del servicio para tratarlo como si fuera tuyo.

---

## Definition of Done

Este lab no toca la aplicación: produce dos documentos nuevos a partir de uno que ya tenías. Lo has terminado cuando:

- [ ] Existe `docs/analisis-diseño.docx`, generado por el skill `docx` (en JavaScript o en Python, según lo que haya tocado resolver).
- [ ] Existe `docs/analisis-diseño.pdf`, generado por el skill `pdf` con `reportlab`.
- [ ] `docs/` **no** contiene ningún `node_modules` residual.
- [ ] Has abierto el `LICENSE.txt` de `docx` y de `pdf` y sabes qué condiciones fija cada uno.
- [ ] Tu resultado coincide con el de la rama de referencia.

---

## Comparar con la referencia

La solución de referencia está en la demo del curso, `AppTodoList-curso`, en su rama `submodulo-9.2/exportar-formatos`.

```bash
cd AppTodoList-curso
git checkout submodulo-9.2/exportar-formatos
```

Abre sus `docs/analisis-diseño.docx` y `docs/analisis-diseño.pdf` y compáralos con los tuyos: mismo contenido, mismo criterio visual (cabeceras azules, bloques de código con fondo gris). No hace falta que coincidan píxel a píxel: lo que de verdad importa es que no haya quedado ningún `node_modules` en `docs/`.

Cuando termines de mirar, vuelve a tu proyecto y sigue con lo tuyo.

---

## Reto opcional — el PowerPoint por tu cuenta

En clase, un quinto prompt («Ahora me generas el PowerPoint con el skill adecuado») cerró la sesión con el mismo patrón: el skill `pptx` recomienda JavaScript, y el resultado final salió en Python. Pruébalo tú: pide el PowerPoint del mismo documento, resuelve la fricción si aparece igual que en el Word, y abre el `SKILL.md` de `pptx` para localizar su tabla de paletas de color («Design Ideas»). Comprueba si el script que genera tu presentación usa alguna de esas paletas, y si sobrevive aunque el lenguaje cambie de JavaScript a Python.

---

## Lo que has practicado

Compruebas tú mismo que seguir un skill al pie de la letra es llegar al resultado que describe, con las herramientas que tu proyecto ya tiene a mano; el lenguaje de ejecución es lo de menos. Te llevas también el hábito, ya instalado, de mirar el `LICENSE.txt` antes de dar por bueno cualquier skill que no escribiste tú.

**Puente al Lab 9.3.** Exportar el documento de análisis a mano, prompt a prompt, resuelve una necesidad puntual. El manual de usuario es otra cosa: en el próximo lab, un agente decide él solo cuándo regenerarlo, para quien de verdad va a usar tu aplicación terminada.
