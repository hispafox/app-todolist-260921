---
name: carp-design-review
description: "Revisa y mejora el diseño visual de un artefacto aplicando los principios CARP (Contraste, Alineación, Repetición, Proximidad). Úsalo cuando el usuario pida revisar, auditar, puntuar o mejorar el diseño, la estética, la jerarquía o la legibilidad de un documento Word (.docx), un PDF, una presentación, un README/Markdown, una interfaz o un diagrama; cuando mencione CARP o CRAP; cuando pida 'darle una vuelta' al diseño; o cuando haya que comprobar contraste, alineación, repetición y proximidad. NO usar para revisar el contenido de fondo del texto, la ortografía ni la lógica de código."
argument-hint: "Indica el artefacto a revisar (ruta del .docx, PDF, presentación…) y qué te preocupa del diseño"
---

# Revisión de diseño CARP

Revisa un artefacto y mejora su diseño visual con los cuatro principios de **CARP** (también escritos como "CRAP"), de Robin Williams en *The Non-Designer's Design Book*.

## Qué es CARP

- **C — Contraste:** lo que es distinto debe verse claramente distinto, nunca "parecido". Crea jerarquía y guía la mirada.
- **A — Alineación:** cada elemento se apoya en una línea o rejilla común; nada colocado "a ojo". Da orden e intención.
- **R — Repetición:** repetir color, tipografía y motivos unifica el artefacto y lo hace reconocible.
- **P — Proximidad:** agrupar lo relacionado y separar lo que no lo está; el espacio comunica qué va junto.

> Nota de honestidad: **CARP/CRAP es el acrónimo canónico y documentado.** No inventes extensiones (p. ej. "SCARP") como si fueran estándar; si el usuario usa una variante, pídele que defina cada letra antes de aplicarla.

## Cuándo usar y cuándo no

- **Usar para:** revisar/mejorar la presentación de `.docx`, PDF, PPTX/slides, README/Markdown, UI web, diagramas o infografías.
- **No usar para:** corregir el contenido, la ortografía o la veracidad del texto; ni para lógica/arquitectura de código.

## Flujo de revisión

1. **Identifica el artefacto y su fuente.** ¿De dónde se genera? (p. ej. un `.docx` generado desde un `.md`). Trabaja siempre sobre la **fuente**, no sobre el binario derivado.
2. **Revisa cada principio** con la rúbrica de abajo y anota hallazgos concretos.
3. **Prioriza** los problemas por impacto visual (jerarquía primero, remates después).
4. **Aplica correcciones** en la fuente, regenerando el artefacto (no editando copias sueltas).
5. **Verifica con evidencia fresca** (ver sección Verificación). No des nada por bueno sin comprobarlo.
6. **Entrega el informe** con el formato de salida indicado.

## Rúbrica por principio

Para cada principio, puntúa 🔴 / 🟡 / 🟢 y justifica con una observación concreta.

### Contraste
- ¿Los niveles de título se distinguen claramente entre sí (tamaño, color, peso)?
- ¿El texto principal contrasta con el secundario y con los fondos?
- **Contraste de color (legibilidad):** mide cada par texto/fondo con WCAG (ver *Color y contraste*). Objetivo AA: ≥ 4.5:1 en texto normal y ≥ 3:1 en texto grande.
- **Señal de problema:** todos los títulos con el mismo aspecto; texto gris sobre gris; acento de color ilegible sobre el fondo.
- **Corrección típica:** escalar tamaños por nivel, reservar un color de acento para lo importante y comprobar el ratio de cada texto.

### Alineación
- ¿Todo comparte un margen o rejilla común? ¿Hay elementos "flotando"?
- ¿Las tablas/imágenes respetan el ancho de contenido?
- **Señal de problema:** sangrías irregulares, elementos centrados sin motivo.
- **Corrección típica:** alinear a la izquierda por defecto; centrar solo como excepción deliberada (p. ej. la portada).

### Repetición
- ¿Se repite un lenguaje visual coherente (color de acento, tipografía, motivos, cabeceras de tabla, pies)?
- **Señal de problema:** cada sección con su propio estilo; acentos de colores sin significado.
- **Corrección típica:** definir un color/motivo de marca y reutilizarlo en portada, títulos, tablas y bloques destacados.

### Proximidad
- ¿Cada título está más cerca de su contenido que del bloque anterior?
- ¿Los elementos relacionados están agrupados y los no relacionados separados?
- **Señal de problema:** espaciado uniforme que no comunica agrupación; líneas en blanco sueltas.
- **Corrección típica:** más espacio *antes* del título que *después*; agrupar etiqueta + tabla; evitar párrafos vacíos como separador.

## Color y contraste (WCAG)

El "Contraste" de CARP es amplio (tamaño, peso y color para crear jerarquía). Pero **la legibilidad del color de un texto sobre su fondo se rige por otra norma: WCAG** (Web Content Accessibility Guidelines), mediante el *ratio de contraste* calculado con la luminancia relativa de ambos colores. Es la metodología/tecnología concreta para el contraste de color; no forma parte de CARP.

**Umbrales (WCAG 2.x):**
- **AA** — texto normal ≥ **4.5:1**; texto grande (≥ 18 pt, o ≥ 14 pt en negrita) ≥ **3:1**.
- **AAA** — texto normal ≥ **7:1**; texto grande ≥ **4.5:1**.

Mide cualquier par con la herramienta incluida:
```powershell
python .github/skills/carp-design-review/scripts/carp_docx_check.py contrast <hex_texto> <hex_fondo>
```

**Guía práctica de paleta:**
- **Paleta limitada:** un color de marca + un acento + tinta de texto + fondos claros. Nada de color sin significado funcional.
- **Regla 60-30-10:** ~60 % base/fondo, ~30 % color secundario, ~10 % acento.
- **El acento no es para texto pequeño.** Un dorado/ámbar bonito suele fallar sobre blanco (p. ej. `#B89150` sobre blanco ≈ 2.9:1). Úsalo en filetes, bordes y divisores (donde el ratio no aplica) o en texto grande; para texto pequeño usa un tono más oscuro que pase AA.
- **Cuidado con los "negros falsos":** un navy tan oscuro (p. ej. `#0C1B2C`) se lee como negro y pierde carácter. Sube a un navy con color (p. ej. `#1C3A5E`) manteniendo el texto blanco encima (≈ 11.5:1).
- **No dependas solo del color** para transmitir información: refuérzalo con peso, forma, icono o texto (daltonismo).
- **Estados (aviso/error/éxito):** distínguelos por contraste **y** por icono o etiqueta, no solo por color.

## Guía por tipo de artefacto

### Documento Word (.docx)
Genera el documento con `python-docx` desde la fuente. Técnicas validadas en este repositorio:

- **Contraste/jerarquía:** tamaños y colores distintos por nivel de encabezado (p. ej. H1 16 pt marino con filete inferior de acento, H2 13 pt azul, H3 11,5 pt tinta).
- **Repetición:** un color de acento reutilizado (filete bajo H1 = divisor de portada = etiquetas de sección); misma cabecera de tabla en todas las tablas; bloques de código como cajas con fondo suave y borde izquierdo del color de acento.
- **Alineación:** cuerpo, títulos y tablas a un margen común; tablas a ancho completo; portada centrada como única excepción. Repite la fila de cabecera al partir tablas largas con `w:tblHeader`.
- **Proximidad:** `keep_with_next` en los estilos de título (evita títulos huérfanos al pie), `widow_control` en el cuerpo, y espacio mayor antes del título que después.
- **Espacio:** márgenes holgados; no insertar un párrafo vacío por cada línea en blanco del Markdown de origen (deja que el espaciado de estilo aporte el aire).
- **Remate profesional:** pie con título a un lado y número de página con campo real `PAGE` al otro.

**Anti-patrón crítico:** nunca dupliques el `.docx` y lo renombres como "versión premium/luxury". Eso produce copias idénticas (mismo hash) que parecen distintas pero no lo son. **Regenera desde la fuente** y comprueba que el tamaño/hash cambian.

### Presentaciones (PPTX / slides)
Una idea por diapositiva (proximidad), rejilla consistente (alineación), plantilla y paleta repetidas (repetición), y jerarquía título/cuerpo marcada (contraste). Evita el "muro de viñetas".

### PDF
Revisa sobre el render final. Comprueba márgenes, jerarquía de titulares, consistencia de cabeceras/pies y agrupación de bloques. Si se genera desde otra fuente (Markdown, HTML, LaTeX), corrige en la fuente.

### Web / UI
Contraste de color accesible (WCAG), rejilla y alineación de componentes, sistema de diseño repetido (tokens, componentes), y agrupación por proximidad y espaciado. Verifica en el navegador a distintos anchos.

### Markdown / README
Jerarquía de encabezados coherente, uso repetido de bloques (badges, tablas, admoniciones), listas agrupadas por tema y separadores para proximidad. El contraste lo da la estructura, no el color.

### Diagramas
Contraste entre tipos de nodo, alineación en rejilla, formas/colores repetidos por categoría y agrupación espacial de lo relacionado.

## Verificación (obligatoria antes de dar por bueno)

No afirmes que el diseño ha mejorado sin **evidencia fresca**:

1. **Inspecciona el artefacto** para confirmar que es válido y que el estilo está dentro:
   ```powershell
   python .github/skills/carp-design-review/scripts/carp_docx_check.py inspect docs/mi-doc.docx
   ```
   Comprueba: zip válido, nº de párrafos y tablas, rellenos de color presentes, tamaño y hash **distintos** de la versión anterior.

2. **Míralo de verdad.** Exporta a PDF y rasteriza para revisión visual.
   - Exportar a PDF con Word en Windows:
     ```powershell
     $w = New-Object -ComObject Word.Application; $w.Visible=$false
     $d = $w.Documents.Open("$PWD\docs\mi-doc.docx")
     $d.SaveAs([ref]"$env:TEMP\preview.pdf", [ref]17); $d.Close(); $w.Quit()
     ```
     (Alternativa multiplataforma si está disponible: `soffice --headless --convert-to pdf mi-doc.docx`.)
   - Rasterizar páginas a una imagen para inspeccionarlas:
     ```powershell
     python .github/skills/carp-design-review/scripts/carp_docx_check.py render "$env:TEMP\preview.pdf" "$env:TEMP\preview.png" 1 2 3
     ```
   Luego abre la imagen y revísala principio por principio.

3. **Mide el contraste de color** de los pares texto/fondo dudosos (WCAG):
   ```powershell
   python .github/skills/carp-design-review/scripts/carp_docx_check.py contrast FFFFFF 1C3A5E
   ```
   Confirma que cada texto pasa al menos AA para su tamaño.

## Formato de salida del informe

Entrega la revisión así:

```text
Revisión CARP — <artefacto>

Contraste   🟢/🟡/🔴 — <observación concreta>
Alineación  🟢/🟡/🔴 — <observación concreta>
Repetición  🟢/🟡/🔴 — <observación concreta>
Proximidad  🟢/🟡/🔴 — <observación concreta>

Correcciones aplicadas (o propuestas), en orden de impacto:
1. …
2. …

Verificación: <evidencia: válido, tamaño/hash, páginas revisadas>
```

## Lecciones aprendidas (no repetir errores)

- **Verifica siempre con salida fresca**; no declares éxito de memoria.
- **Un artefacto, una fuente.** No proliferes copias con nombres parecidos; confunden y suelen ser idénticas.
- **No fabriques terminología.** Usa CARP; no inventes acrónimos ni definiciones que suenen bien pero no existan.
- **Corrige en la fuente y regenera**, no parchees el binario derivado.
- **Mide el contraste de color con WCAG**, no a ojo: un acento decorativo no sirve como texto pequeño y un navy casi negro se lee como negro.

## Herramientas incluidas

- `scripts/carp_docx_check.py` — inspecciona la estructura y el estilo de un `.docx` (`inspect`), rasteriza páginas de un PDF exportado a una imagen (`render`) y calcula el ratio de contraste WCAG entre dos colores (`contrast`).

Requisitos del script: Python con `python-docx` (inspección) y `pypdfium2` + `Pillow` (render). El modo `contrast` no requiere dependencias externas. El render parte de un PDF ya exportado (ver Verificación).
