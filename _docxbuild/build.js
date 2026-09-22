const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel, BorderStyle,
  WidthType, ShadingType, VerticalAlign, PageNumber,
} = require("docx");

// --- Paleta ---
const TEAL = "10656A";      // verde petróleo (acento principal)
const INK = "1F2933";       // tinta oscura para el texto
const MUTED = "5B6770";     // texto auxiliar
const GREEN = "2F855A";     // resultado positivo
const GREEN_BG = "E6F4EA";  // fondo verde suave
const HEAD_BG = "10656A";   // fondo cabecera de tabla
const ROW_ALT = "F2F5F5";   // fila alterna
const LINE = "CBD5D8";      // bordes suaves

const CONTENT_WIDTH = 9360;

const cellBorder = { style: BorderStyle.SINGLE, size: 1, color: LINE };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

function headCell(text, width) {
  return new TableCell({
    borders: cellBorders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill: HEAD_BG, type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, color: "FFFFFF", size: 20 })] })],
  });
}

function bodyCell(runsOrText, width, opts = {}) {
  const children = Array.isArray(runsOrText)
    ? runsOrText
    : [new TextRun({ text: String(runsOrText), size: 20, color: INK, bold: !!opts.bold })];
  return new TableCell({
    borders: cellBorders,
    width: { size: width, type: WidthType.DXA },
    shading: opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR } : undefined,
    margins: { top: 70, bottom: 70, left: 120, right: 120 },
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({ children })],
  });
}

function twoColRow(label, value, alt) {
  return new TableRow({
    children: [
      bodyCell([new TextRun({ text: label, bold: true, size: 20, color: INK })], 3120, { fill: alt ? ROW_ALT : undefined }),
      bodyCell(value, 6240, { fill: alt ? ROW_ALT : undefined }),
    ],
  });
}

function spacer(size = 120) {
  return new Paragraph({ spacing: { before: size, after: size }, children: [] });
}

function rule() {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: TEAL, space: 1 } },
    spacing: { after: 160 },
    children: [],
  });
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text, size: 22, color: INK })],
  });
}

function numbered(text) {
  return new Paragraph({
    numbering: { reference: "phases", level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text, size: 22, color: INK })],
  });
}

function body(runs, spaceAfter = 120) {
  const children = Array.isArray(runs) ? runs : [new TextRun({ text: String(runs), size: 22, color: INK })];
  return new Paragraph({ spacing: { after: spaceAfter, line: 276 }, children });
}

// --- Tabla: resumen ---
const summaryTable = new Table({
  width: { size: CONTENT_WIDTH, type: WidthType.DXA },
  columnWidths: [4680, 4680],
  rows: [
    new TableRow({ tableHeader: true, children: [headCell("Métrica", 4680), headCell("Resultado", 4680)] }),
    new TableRow({ children: [bodyCell("Findings totales", 4680), bodyCell("0", 4680, { bold: true })] }),
    new TableRow({ children: [bodyCell("Nivel de riesgo", 4680, { fill: ROW_ALT }), bodyCell([new TextRun({ text: "Limpio (Clean)", bold: true, size: 20, color: GREEN })], 4680, { fill: ROW_ALT })] }),
    new TableRow({ children: [bodyCell("Estructura del skill", 4680), bodyCell("Solo SKILL.md (sin scripts ni references)", 4680)] }),
    new TableRow({ children: [bodyCell("Solape descripción/cuerpo", 4680, { fill: ROW_ALT }), bodyCell("0.65", 4680, { fill: ROW_ALT })] }),
    new TableRow({ children: [bodyCell("Permisos declarados (allowed-tools)", 4680), bodyCell("Ninguno", 4680)] }),
    new TableRow({ children: [bodyCell("URLs / dependencias externas", 4680, { fill: ROW_ALT }), bodyCell("0 / 0", 4680, { fill: ROW_ALT })] }),
  ],
});

// --- Tabla: metadatos ---
const metaTable = new Table({
  width: { size: CONTENT_WIDTH, type: WidthType.DXA },
  columnWidths: [3120, 6240],
  rows: [
    twoColRow("Skill auditado", "mensajes-commit", false),
    twoColRow("Ruta", ".github/skills/mensajes-commit/SKILL.md", true),
    twoColRow("Fecha de auditoría", "22 de septiembre de 2026", false),
    twoColRow("Herramienta", "skill-scanner (análisis estático) + revisión manual", true),
    twoColRow("Analista", "GitHub Copilot", false),
    twoColRow("Resultado", [new TextRun({ text: "Limpio — Seguro para usar", bold: true, size: 20, color: GREEN })], true),
  ],
});

// --- Tabla: análisis por fase ---
function phaseRow(fase, resultado, detalle, alt) {
  return new TableRow({
    children: [
      bodyCell([new TextRun({ text: fase, bold: true, size: 20, color: INK })], 2500, { fill: alt ? ROW_ALT : undefined }),
      bodyCell([new TextRun({ text: resultado, bold: true, size: 20, color: GREEN })], 1600, { fill: alt ? ROW_ALT : undefined }),
      bodyCell([new TextRun({ text: detalle, size: 20, color: INK })], 5260, { fill: alt ? ROW_ALT : undefined }),
    ],
  });
}

const phaseTable = new Table({
  width: { size: CONTENT_WIDTH, type: WidthType.DXA },
  columnWidths: [2500, 1600, 5260],
  rows: [
    new TableRow({ tableHeader: true, children: [headCell("Fase", 2500), headCell("Resultado", 1600), headCell("Detalle", 5260)] }),
    phaseRow("1-2. Descubrimiento y escaneo estático", "OK", "Estructura de solo texto. El scanner devolvió 0 findings, 0 URLs y 0 dependencias.", false),
    phaseRow("3. Frontmatter", "OK", "name y description presentes; name coincide con el directorio; sin allowed-tools ni override de modelo.", true),
    phaseRow("4. Inyección de prompt", "OK", "Solo reglas de formato de commit. Sin overrides, jailbreaks ni comentarios HTML ocultos.", false),
    phaseRow("5. Análisis conductual", "OK", "Descripción alineada con las instrucciones. Sin envenenamiento de config/memoria ni scope creep.", true),
    phaseRow("6. Scripts", "N/A", "No existe carpeta scripts/; no hay código ejecutable que analizar.", false),
    phaseRow("7. Cadena de suministro", "OK", "Sin URLs, sin descargas remotas y sin dependencias de paquetes.", true),
    phaseRow("8. Permisos", "OK", "Riesgo mínimo: no declara herramientas y su cuerpo no realiza operaciones que las requieran.", false),
  ],
});

// --- Callout de evaluación ---
const verdictTable = new Table({
  width: { size: CONTENT_WIDTH, type: WidthType.DXA },
  columnWidths: [CONTENT_WIDTH],
  rows: [
    new TableRow({
      children: [
        new TableCell({
          borders: {
            top: { style: BorderStyle.SINGLE, size: 4, color: GREEN },
            bottom: { style: BorderStyle.SINGLE, size: 4, color: GREEN },
            left: { style: BorderStyle.SINGLE, size: 18, color: GREEN },
            right: { style: BorderStyle.SINGLE, size: 4, color: GREEN },
          },
          width: { size: CONTENT_WIDTH, type: WidthType.DXA },
          shading: { fill: GREEN_BG, type: ShadingType.CLEAR },
          margins: { top: 140, bottom: 140, left: 200, right: 200 },
          children: [
            new Paragraph({
              spacing: { after: 80 },
              children: [new TextRun({ text: "Evaluación: Seguro para usar", bold: true, size: 26, color: GREEN })],
            }),
            new Paragraph({
              spacing: { line: 276 },
              children: [new TextRun({
                text: "El skill es un archivo de instrucciones de texto puro que solo orienta el formato de los mensajes de commit. No contiene código ejecutable, no solicita permisos, no accede a datos sensibles ni intenta persistir instrucciones. No se detectaron patrones maliciosos ni en el escaneo automático ni en la revisión manual.",
                size: 22, color: INK,
              })],
            }),
          ],
        }),
      ],
    }),
  ],
});

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22, color: INK } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 30, bold: true, font: "Arial", color: TEAL },
        paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: INK },
        paragraph: { spacing: { before: 220, after: 120 }, outlineLevel: 1 } },
    ],
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 560, hanging: 280 } } } }] },
      { reference: "phases", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 560, hanging: 280 } } } }] },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: LINE, space: 4 } },
          children: [
            new TextRun({ text: "TaskFlow · Auditoría de seguridad de skill", size: 16, color: MUTED }),
            new TextRun({ text: "\tmensajes-commit", size: 16, color: MUTED }),
          ],
          tabStops: [{ type: "right", position: CONTENT_WIDTH }],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          border: { top: { style: BorderStyle.SINGLE, size: 6, color: LINE, space: 4 } },
          children: [new TextRun({ children: ["Página ", PageNumber.CURRENT, " de ", PageNumber.TOTAL_PAGES], size: 16, color: MUTED })],
        })],
      }),
    },
    children: [
      new Paragraph({
        spacing: { after: 40 },
        children: [new TextRun({ text: "INFORME DE SEGURIDAD", bold: true, size: 18, color: TEAL, characterSpacing: 40 })],
      }),
      new Paragraph({
        spacing: { after: 40 },
        children: [new TextRun({ text: "Auditoría de Seguridad de Skill", bold: true, size: 44, color: INK })],
      }),
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({ text: "Revisión estática y conductual del skill de agente «mensajes-commit»", size: 24, color: MUTED })],
      }),
      rule(),

      metaTable,
      spacer(),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Resumen ejecutivo")] }),
      body("Se ha auditado el skill «mensajes-commit» combinando el escáner estático del skill-scanner con una revisión manual de las ocho fases del flujo de trabajo. El skill se limita a definir reglas de estilo para redactar mensajes de commit y no incluye scripts, referencias, dependencias ni permisos de herramientas."),
      body("El resultado es limpio: no se identificó ningún hallazgo de seguridad. El skill respeta el principio de mínimo privilegio y no realiza acciones sobre el sistema, el repositorio ni la configuración del agente."),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Resumen de resultados")] }),
      summaryTable,
      spacer(),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Metodología")] }),
      body("La auditoría siguió el flujo de trabajo de ocho fases del skill-scanner:"),
      numbered("Entrada y descubrimiento: localización y validación de la estructura del skill."),
      numbered("Escaneo estático automatizado: ejecución del scanner y parseo del JSON de findings."),
      numbered("Validación del frontmatter: campos requeridos, consistencia de nombre y permisos."),
      numbered("Análisis de inyección de prompt: búsqueda de overrides, jailbreaks y contenido oculto."),
      numbered("Análisis conductual: alineación descripción/instrucciones y envenenamiento de configuración."),
      numbered("Análisis de scripts: revisión de código ejecutable (no aplica en este skill)."),
      numbered("Evaluación de cadena de suministro: URLs, descargas remotas y dependencias."),
      numbered("Análisis de permisos: mínimo privilegio y justificación de herramientas."),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Análisis por fase")] }),
      phaseTable,
      spacer(),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Ataques estructurales")] }),
      body("Se verificaron los vectores estructurales habituales; ninguno está presente:"),
      bullet("Symlinks que resuelvan fuera del directorio del skill: no hay."),
      bullet("Hooks (PreToolUse/PostToolUse) en el frontmatter: no hay."),
      bullet("Sintaxis de ejecución en carga (`!`comando``): no hay."),
      bullet("Ficheros de test auto-ejecutables (conftest.py, test_*.py, *.test.js): no hay."),
      bullet("Hooks de ciclo de vida de npm (postinstall): no hay."),
      bullet("Unicode invisible (tags, zero-width, RTL) o metadatos de imagen ocultos: no hay."),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Detalle de hallazgos")] }),
      body("No se identificaron hallazgos de seguridad. El escaneo automático devolvió 0 findings y la revisión manual no encontró desalineaciones, abusos de permisos ni patrones maliciosos."),

      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("Evaluación final")] }),
      verdictTable,
      spacer(),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("Nota operativa")] }),
      body("El scanner del skill-scanner asume la CLI «uv», que no está instalada en este entorno. La ejecución se realizó con el intérprete Python del usuario (con pyyaml disponible), obteniendo el mismo resultado estructurado."),
    ],
  }],
});

const outDir = path.resolve(__dirname, "..", "documentos");
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "Auditoria-Seguridad-mensajes-commit.docx");
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outPath, buffer);
  console.log("OK:" + outPath);
});
