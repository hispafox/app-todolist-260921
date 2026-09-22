# -*- coding: utf-8 -*-
"""Genera el documento Word del Lab M2.1 (commit-message) desde su contenido.

Fuente unica del .docx: este script. Para regenerar:
    python labs/docx/build_lab_M2.1.py

Diseno aplicando CARP (Contraste, Alineacion, Repeticion, Proximidad) y la
direccion visual del proyecto (teal/petroleo + marfil + coral + ambar).
Paleta verificada con WCAG AA (ver carp-design-review).
"""
from __future__ import annotations

import re
from pathlib import Path

from docx import Document
from docx.enum.text import WD_TAB_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Emu, Inches, Pt, RGBColor

# --- Paleta -----------------------------------------------------------------
INK = "22312F"          # tinta del cuerpo (13.6:1 sobre blanco)
BRAND_DEEP = "0C4A47"   # teal profundo: titulo y H1 (10.1:1)
BRAND = "14746F"        # teal: H2, reglas, cabeceras de tabla, acentos (5.6:1)
CODE_INK = "0C4A47"     # codigo en linea
MUTED = "3A4C48"        # texto auxiliar (meta, pies, cabecera)

SAND = "FAF6EE"         # fondo cajas de prompt (marfil)
TEAL_TINT = "EAF3F1"    # fondo cajas "por que" / info
AMBER_TINT = "FBF3E2"   # fondo cajas pista
CORAL_TINT = "FBEDE8"   # fondo cajas error
CODE_BG = "EEF3F1"      # fondo bloques de codigo
RULE_SOFT = "D8E2E0"    # filetes suaves

AMBER_BORDER = "D9A441"
CORAL_BORDER = "C4553B"
AMBER_LBL = "7A5A16"    # etiqueta pista (5.8:1 sobre su fondo)
CORAL_LBL = "B23A22"    # etiqueta error (5.2:1 sobre su fondo)

BODY_FONT = "Arial"
TITLE_FONT = "Georgia"
MONO_FONT = "Consolas"

CONTENT_W = 9360        # dxa (6.5") ancho de contenido con margenes de 1"
DXA_TO_EMU = 635

TOKEN_RE = re.compile(r"(`[^`]+`|\*\*[^*]+\*\*)")

KIND = {
    "porque": (TEAL_TINT, BRAND, BRAND_DEEP, "POR QUÉ"),
    "info": (TEAL_TINT, BRAND, BRAND_DEEP, "NOTA"),
    "pista": (AMBER_TINT, AMBER_BORDER, AMBER_LBL, "PISTA"),
    "error": (CORAL_TINT, CORAL_BORDER, CORAL_LBL, "ERROR COMÚN"),
}


# --- Utilidades de bajo nivel ----------------------------------------------
def _set(el: OxmlElement, attr: str, val: str) -> None:
    el.set(qn(attr), val)


def set_tracking(run, twips: int = 30) -> None:
    rpr = run._r.get_or_add_rPr()
    sp = OxmlElement("w:spacing")
    _set(sp, "w:val", str(twips))
    rpr.append(sp)


def para_border(paragraph, edge: str, color: str, sz: int = 6, space: int = 4) -> None:
    pPr = paragraph._p.get_or_add_pPr()
    pbdr = pPr.find(qn("w:pBdr"))
    if pbdr is None:
        pbdr = OxmlElement("w:pBdr")
        pPr.append(pbdr)
    b = OxmlElement(f"w:{edge}")
    _set(b, "w:val", "single")
    _set(b, "w:sz", str(sz))
    _set(b, "w:space", str(space))
    _set(b, "w:color", color)
    pbdr.append(b)


def add_field(paragraph, instr: str, size: float = 8, color: str = MUTED) -> None:
    fld = OxmlElement("w:fldSimple")
    _set(fld, "w:instr", instr)
    r = OxmlElement("w:r")
    rpr = OxmlElement("w:rPr")
    rf = OxmlElement("w:rFonts")
    _set(rf, "w:ascii", BODY_FONT)
    _set(rf, "w:hAnsi", BODY_FONT)
    rpr.append(rf)
    sz = OxmlElement("w:sz")
    _set(sz, "w:val", str(int(size * 2)))
    rpr.append(sz)
    col = OxmlElement("w:color")
    _set(col, "w:val", color)
    rpr.append(col)
    r.append(rpr)
    t = OxmlElement("w:t")
    t.text = "1"
    r.append(t)
    fld.append(r)
    paragraph._p.append(fld)


def set_cell_bg(cell, hex_fill: str) -> None:
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    _set(shd, "w:val", "clear")
    _set(shd, "w:color", "auto")
    _set(shd, "w:fill", hex_fill)
    tcPr.append(shd)


def set_cell_borders(cell, **edges) -> None:
    """edges: left/top/right/bottom -> dict(sz,color) o None (=nil)."""
    tcPr = cell._tc.get_or_add_tcPr()
    borders = OxmlElement("w:tcBorders")
    for edge in ("top", "left", "bottom", "right"):
        spec = edges.get(edge, None)
        e = OxmlElement(f"w:{edge}")
        if spec is None:
            _set(e, "w:val", "nil")
        else:
            _set(e, "w:val", "single")
            _set(e, "w:sz", str(spec["sz"]))
            _set(e, "w:space", "0")
            _set(e, "w:color", spec["color"])
        borders.append(e)
    tcPr.append(borders)


def set_cell_margins(cell, top=90, bottom=90, left=150, right=150) -> None:
    tcPr = cell._tc.get_or_add_tcPr()
    m = OxmlElement("w:tcMar")
    for edge, val in (("top", top), ("bottom", bottom), ("left", left), ("right", right)):
        e = OxmlElement(f"w:{edge}")
        _set(e, "w:w", str(val))
        _set(e, "w:type", "dxa")
        m.append(e)
    tcPr.append(m)


def set_repeat_header(row) -> None:
    trPr = row._tr.get_or_add_trPr()
    h = OxmlElement("w:tblHeader")
    _set(h, "w:val", "true")
    trPr.append(h)


def set_cant_split(row) -> None:
    trPr = row._tr.get_or_add_trPr()
    cs = OxmlElement("w:cantSplit")
    _set(cs, "w:val", "true")
    trPr.append(cs)


def apply_widths(table, widths) -> None:
    table.autofit = False
    table.allow_autofit = False
    tblPr = table._tbl.tblPr
    tblW = tblPr.find(qn("w:tblW"))
    if tblW is None:
        tblW = OxmlElement("w:tblW")
        tblPr.append(tblW)
    _set(tblW, "w:type", "dxa")
    _set(tblW, "w:w", str(sum(widths)))
    grid = table._tbl.find(qn("w:tblGrid"))
    cols = grid.findall(qn("w:gridCol"))
    for gc, w in zip(cols, widths):
        _set(gc, "w:w", str(w))
    for row in table.rows:
        for cell, w in zip(row.cells, widths):
            cell.width = Emu(w * DXA_TO_EMU)


# --- Runs enriquecidos (codigo `..` y negrita **..**) -----------------------
def add_rich(paragraph, text: str, size=None, color=INK, italic=False, font=BODY_FONT) -> None:
    for part in TOKEN_RE.split(text):
        if not part:
            continue
        if part.startswith("`") and part.endswith("`"):
            run = paragraph.add_run(part[1:-1])
            run.font.name = MONO_FONT
            run.font.color.rgb = RGBColor.from_string(CODE_INK)
            run.font.size = Pt(size - 0.5) if size else Pt(10)
        elif part.startswith("**") and part.endswith("**"):
            run = paragraph.add_run(part[2:-2])
            run.font.name = font
            run.bold = True
            run.italic = italic
            run.font.color.rgb = RGBColor.from_string(color)
            if size:
                run.font.size = Pt(size)
        else:
            run = paragraph.add_run(part)
            run.font.name = font
            run.italic = italic
            run.font.color.rgb = RGBColor.from_string(color)
            if size:
                run.font.size = Pt(size)


# --- Bloques de contenido ---------------------------------------------------
def spacer(doc, pts: int = 6) -> None:
    p = doc.add_paragraph()
    pf = p.paragraph_format
    pf.space_before = Pt(0)
    pf.space_after = Pt(0)
    pf.line_spacing = Pt(pts)


def add_body(doc, text: str, italic=False):
    p = doc.add_paragraph()
    add_rich(p, text, italic=italic)
    return p


def add_bullet(doc, text: str):
    p = doc.add_paragraph(style="List Bullet")
    add_rich(p, text)
    p.paragraph_format.space_after = Pt(3)
    return p


def add_h1(doc, text: str):
    p = doc.add_paragraph(text, style="Heading 1")
    para_border(p, "bottom", BRAND, sz=6, space=4)
    return p


def add_h2(doc, text: str):
    return doc.add_paragraph(text, style="Heading 2")


def add_h3(doc, text: str):
    return doc.add_paragraph(text, style="Heading 3")


def add_intro(doc, text: str):
    """Entradilla de ejercicio: italica con filete izquierdo de acento."""
    p = doc.add_paragraph()
    add_rich(p, text, italic=True, color=MUTED)
    p.paragraph_format.left_indent = Inches(0.16)
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(8)
    para_border(p, "left", BRAND, sz=18, space=8)
    return p


def add_step(doc, num: str, text: str):
    p = doc.add_paragraph()
    pf = p.paragraph_format
    pf.left_indent = Inches(0.3)
    pf.first_line_indent = Inches(-0.3)
    pf.space_before = Pt(2)
    pf.space_after = Pt(5)
    r = p.add_run(f"{num}  ")
    r.bold = True
    r.font.name = BODY_FONT
    r.font.color.rgb = RGBColor.from_string(BRAND)
    add_rich(p, text)
    return p


def add_expect(doc, text: str):
    p = doc.add_paragraph()
    pf = p.paragraph_format
    pf.left_indent = Inches(0.3)
    pf.space_before = Pt(1)
    pf.space_after = Pt(7)
    lead = p.add_run("Qué esperar.  ")
    lead.bold = True
    lead.font.name = BODY_FONT
    lead.font.color.rgb = RGBColor.from_string(BRAND)
    add_rich(p, text)
    return p


def _one_cell(doc, fill: str, border: str):
    table = doc.add_table(rows=1, cols=1)
    apply_widths(table, [CONTENT_W])
    set_cant_split(table.rows[0])
    cell = table.cell(0, 0)
    set_cell_bg(cell, fill)
    set_cell_borders(cell, left={"sz": 24, "color": border})
    set_cell_margins(cell)
    return cell


def add_prompt(doc, text: str) -> None:
    cell = _one_cell(doc, SAND, BRAND)
    p0 = cell.paragraphs[0]
    lbl = p0.add_run("PROMPT PARA COPILOT")
    lbl.bold = True
    lbl.font.name = BODY_FONT
    lbl.font.size = Pt(8)
    lbl.font.color.rgb = RGBColor.from_string(BRAND_DEEP)
    set_tracking(lbl, 40)
    p0.paragraph_format.space_after = Pt(4)
    body = cell.add_paragraph()
    add_rich(body, text, italic=True, color=INK)
    body.paragraph_format.space_after = Pt(0)
    spacer(doc)


def add_note(doc, kind: str, body: str, lead: str | None = None) -> None:
    fill, border, lblcol, deflabel = KIND[kind]
    cell = _one_cell(doc, fill, border)
    p0 = cell.paragraphs[0]
    chip = p0.add_run(deflabel)
    chip.bold = True
    chip.font.name = BODY_FONT
    chip.font.size = Pt(8)
    chip.font.color.rgb = RGBColor.from_string(lblcol)
    set_tracking(chip, 40)
    p0.paragraph_format.space_after = Pt(4)
    bp = cell.add_paragraph()
    if lead:
        lr = bp.add_run(lead + " ")
        lr.bold = True
        lr.font.name = BODY_FONT
        lr.font.color.rgb = RGBColor.from_string(INK)
    add_rich(bp, body)
    bp.paragraph_format.space_after = Pt(0)
    spacer(doc)


def add_code(doc, lines) -> None:
    cell = _one_cell(doc, CODE_BG, BRAND)
    for i, ln in enumerate(lines):
        p = cell.paragraphs[0] if i == 0 else cell.add_paragraph()
        r = p.add_run(ln)
        r.font.name = MONO_FONT
        r.font.size = Pt(9.5)
        r.font.color.rgb = RGBColor.from_string(INK)
        p.paragraph_format.space_after = Pt(0)
        p.paragraph_format.line_spacing = Pt(13)
    spacer(doc)


def add_dod(doc, rows) -> None:
    table = doc.add_table(rows=1, cols=2)
    apply_widths(table, [1120, 8240])
    hdr = table.rows[0]
    set_repeat_header(hdr)
    for cell, text in zip(hdr.cells, ("Hecho", "Criterio de aceptación")):
        set_cell_bg(cell, BRAND)
        set_cell_borders(cell)
        set_cell_margins(cell)
        p = cell.paragraphs[0]
        r = p.add_run(text)
        r.bold = True
        r.font.name = BODY_FONT
        r.font.size = Pt(9.5)
        r.font.color.rgb = RGBColor.from_string("FFFFFF")
    for idx, text in enumerate(rows):
        row = table.add_row()
        set_cant_split(row)
        fill = "FFFFFF" if idx % 2 == 0 else TEAL_TINT
        box, crit = row.cells
        set_cell_bg(box, fill)
        set_cell_bg(crit, fill)
        set_cell_borders(box, bottom={"sz": 4, "color": RULE_SOFT})
        set_cell_borders(crit, bottom={"sz": 4, "color": RULE_SOFT})
        set_cell_margins(box)
        set_cell_margins(crit)
        bp = box.paragraphs[0]
        bp.alignment = 1  # center
        cr = bp.add_run("\u2610")
        cr.font.name = "Segoe UI Symbol"
        cr.font.size = Pt(12)
        cr.font.color.rgb = RGBColor.from_string(BRAND)
        cp = crit.paragraphs[0]
        cp.paragraph_format.space_after = Pt(0)
        add_rich(cp, text)
    spacer(doc)


# --- Estilos ----------------------------------------------------------------
def configure_styles(doc) -> None:
    normal = doc.styles["Normal"]
    normal.font.name = BODY_FONT
    normal.font.size = Pt(10.5)
    normal.font.color.rgb = RGBColor.from_string(INK)
    pf = normal.paragraph_format
    pf.space_after = Pt(6)
    pf.line_spacing = 1.15
    pf.widow_control = True

    def cfg(name, font, size, color, before, after):
        st = doc.styles[name]
        st.font.name = font
        st.font.size = Pt(size)
        st.font.bold = True
        st.font.color.rgb = RGBColor.from_string(color)
        p = st.paragraph_format
        p.space_before = Pt(before)
        p.space_after = Pt(after)
        p.keep_with_next = True

    cfg("Heading 1", TITLE_FONT, 16, BRAND_DEEP, 18, 6)
    cfg("Heading 2", TITLE_FONT, 13, BRAND, 14, 4)
    cfg("Heading 3", BODY_FONT, 10.5, INK, 10, 3)


def configure_page(doc) -> None:
    section = doc.sections[0]
    section.page_width = Inches(8.5)
    section.page_height = Inches(11)
    section.top_margin = Inches(1)
    section.bottom_margin = Inches(1)
    section.left_margin = Inches(1)
    section.right_margin = Inches(1)

    hp = section.header.paragraphs[0]
    hr = hp.add_run("LABORATORIO GHCOPTL · MÓDULO 2 — SKILLS")
    hr.font.name = BODY_FONT
    hr.font.size = Pt(8)
    hr.font.color.rgb = RGBColor.from_string(MUTED)
    set_tracking(hr, 40)
    hp.paragraph_format.space_after = Pt(6)
    para_border(hp, "bottom", RULE_SOFT, sz=4, space=4)

    fp = section.footer.paragraphs[0]
    fp.paragraph_format.tab_stops.add_tab_stop(Inches(6.5), WD_TAB_ALIGNMENT.RIGHT)
    para_border(fp, "top", RULE_SOFT, sz=4, space=4)
    left = fp.add_run("Lab M2.1 · commit-message")
    left.font.name = BODY_FONT
    left.font.size = Pt(8)
    left.font.color.rgb = RGBColor.from_string(MUTED)
    fp.add_run("\t")
    pg = fp.add_run("Página ")
    pg.font.name = BODY_FONT
    pg.font.size = Pt(8)
    pg.font.color.rgb = RGBColor.from_string(MUTED)
    add_field(fp, "PAGE")
    de = fp.add_run(" de ")
    de.font.name = BODY_FONT
    de.font.size = Pt(8)
    de.font.color.rgb = RGBColor.from_string(MUTED)
    add_field(fp, "NUMPAGES")


def add_title_block(doc) -> None:
    eyebrow = doc.add_paragraph()
    er = eyebrow.add_run("GITHUB COPILOT · LABORATORIO · CAPA 2 — SKILLS")
    er.bold = True
    er.font.name = BODY_FONT
    er.font.size = Pt(9)
    er.font.color.rgb = RGBColor.from_string(BRAND)
    set_tracking(er, 50)
    eyebrow.paragraph_format.space_after = Pt(2)

    title = doc.add_paragraph()
    tr = title.add_run("Lab M2.1 — Tu primer skill: commit-message")
    tr.bold = True
    tr.font.name = TITLE_FONT
    tr.font.size = Pt(24)
    tr.font.color.rgb = RGBColor.from_string(BRAND_DEEP)
    title.paragraph_format.space_after = Pt(6)
    para_border(title, "bottom", BRAND, sz=18, space=6)

    meta = doc.add_paragraph()
    add_rich(
        meta,
        "Lab versión 2 · Última actualización 2026-07-03 · Base: "
        "`temario/GHCOPTL-M2.1-tu-primer-skill-commit-message.md`",
        size=9,
        color=MUTED,
    )
    meta.paragraph_format.space_after = Pt(10)

    add_body(
        doc,
        "En el capítulo has visto, sobre el papel, qué es un `SKILL.md`, por qué su "
        "`description` decide cuándo se carga, y cómo es por dentro el skill de los commits. "
        "Ahora lo construyes tú: le encargas a GitHub Copilot el skill `commit-message`, lo "
        "afinas hasta que salta cuando debe y el formato sale como quieres, y lo usas para "
        "generar el mensaje de un commit real, validándolo antes de confirmarlo. Al final "
        "comparas lo tuyo con la rama de referencia del capítulo, en la demo del curso.",
    )


# --- Documento --------------------------------------------------------------
def build(path: Path) -> None:
    doc = Document()
    doc.core_properties.title = "Lab M2.1 — Tu primer skill: commit-message"
    doc.core_properties.author = "GHCOPTL"
    configure_styles(doc)
    configure_page(doc)
    add_title_block(doc)

    # En este lab
    add_h1(doc, "En este lab")
    add_body(doc, "Guía rápida de lo que vas a practicar:")
    for item in (
        "**Overview** — qué practicas",
        "**Punto de partida** — requisitos + tu repositorio + la demo de referencia",
        "**Ejercicio 1** — Encárgale a GitHub Copilot el skill `commit-message`",
        "**Ejercicio 2** — Afínalo: que la `description` dispare y el formato sea sólido",
        "**Ejercicio 3** — Úsalo de verdad: genera un commit y valídalo antes de confirmar",
        "**Definition of Done**",
        "**Comparar con la referencia**",
        "**Reto opcional** — tu segundo skill",
        "**Lo que has practicado** + puente al Lab 2.2",
    ):
        add_bullet(doc, item)

    # Overview
    add_h1(doc, "Overview")
    add_body(
        doc,
        "Al terminar este lab sabrás **crear un skill desde cero encargándoselo a GitHub "
        "Copilot**, **afinarlo** hasta que su `description` lo active en el momento correcto, "
        "y **usarlo** para que genere mensajes de commit con tu formato, revisándolos antes "
        "de confirmar. El entregable es un `SKILL.md` real en tu repositorio: tu primera "
        "parte de la capa 2.",
    )
    add_body(
        doc,
        "El detalle conceptual (anatomía del `SKILL.md`, carga progresiva, Conventional "
        "Commits) está en la base del capítulo; este lab es la parte de tus manos.",
    )
    add_note(doc, "info", "Tiempo estimado: 30–40 min.")

    # Punto de partida
    add_h1(doc, "Punto de partida")
    add_body(doc, "**Requisitos** (los mismos de todo el curso):")
    add_bullet(
        doc,
        "**VS Code** con la **extensión de GitHub Copilot** y una cuenta con acceso al "
        "**modo agente**.",
    )
    add_bullet(
        doc,
        "**SDK de .NET 10**, **Node.js**, **Git** y la **GitHub CLI** (`gh`) —ya la dejaste "
        "lista y autenticada en el lab anterior—.",
    )
    add_body(
        doc,
        "**Trabajas en tu propio repositorio**, el mismo del capítulo anterior. Sigues donde "
        "lo dejaste: ya tienes tu `.github/copilot-instructions.md` con las reglas de la casa, "
        "y el repositorio publicado en GitHub. Todo en una sola rama, como siempre: aquí no "
        "creas ramas.",
    )
    add_body(
        doc,
        "Ese es justo el estado en el que surgió la pregunta que abre este capítulo: los "
        "commits salían dispares. Vas a resolverla construyendo tu primer skill, encima de lo "
        "que ya tienes.",
    )
    add_note(
        doc,
        "pista",
        "Necesitas un repositorio con un `.github/copilot-instructions.md`, como el que se "
        "montó en el 1.1. Puedes crear uno rápido dirigiendo a GitHub Copilot, o mirar cómo "
        "quedó en la demo: en tu clon de `AppTodoList-curso`, `git checkout submodulo-1.1/setup`, "
        "y replica ese punto de partida en tu repositorio antes de seguir.",
        lead="¿Empiezas el curso por aquí?",
    )
    add_note(
        doc,
        "pista",
        "La solución de referencia está en la demo `AppTodoList-curso`, que clonaste una vez "
        "en el lab anterior. Cuando termines, te asomas a su rama de este capítulo para "
        "comparar —solo para mirar, nunca trabajas dentro de la demo—.",
        lead="Tu red de seguridad: la demo del curso.",
    )

    # Ejercicio 1
    add_h1(doc, "Ejercicio 1 — Encárgale a GitHub Copilot el skill commit-message")
    add_intro(
        doc,
        "Un skill no se escribe a mano de cero: se le describe la tarea a GitHub Copilot y él "
        "te da un primer `SKILL.md`. Aquí le encargas el de los mensajes de commit con las "
        "características que tú quieres. Experimenta a tu aire con la redacción del encargo; "
        "cuanto más claras las características, mejor sale el primer borrador.",
    )
    add_h2(doc, "Tarea 1.1 — Describe el skill que quieres")
    add_step(
        doc,
        "1",
        "En el **modo agente**, pídele el skill describiendo dónde va y qué características "
        "tiene:",
    )
    add_prompt(
        doc,
        "«Quiero crear un skill en este proyecto, solo aquí para este proyecto, en la carpeta "
        "correspondiente, que suele ser `.github/skills`. El objetivo de este skill es crear "
        "los mensajes de commit cuando vayamos a commitear algo. Queremos estas "
        "características: 1) Sé específico con lo que cambió: no vale \u201cactualizar "
        "fichero\u201d, di qué se tocó exactamente. 2) El cuerpo del commit es opcional pero "
        "valioso: la primera línea es el resumen (tipo: descripción corta), el cuerpo explica "
        "el detalle; si el cambio es trivial, una sola línea basta. 3) Escueto no es lo mismo "
        "que vago: \u201cdocs: cambiar idioma de código de inglés a castellano\u201d es corto "
        "pero dice exactamente qué ocurrió; \u201cactualizar instrucciones\u201d no dice nada.»",
    )
    add_expect(
        doc,
        "GitHub Copilot te propone un `SKILL.md` con su frontmatter (`name`, `description`, "
        "`argument-hint`) y un cuerpo con el formato del mensaje, la tabla de tipos y las "
        "reglas que le has pedido. Todavía no lo ha creado; te lo muestra.",
    )
    add_note(
        doc,
        "porque",
        "Fíjate en que le das tres cosas: **dónde** va (la carpeta `.github/skills`), **para "
        "qué** sirve (el disparador de la `description`), y **las reglas de calidad** "
        "(específico, cuerpo = porqué, escueto ≠ vago). Esas reglas son las que separan un "
        "commit útil de uno inútil, y quieres que queden dentro del skill, no en tu memoria.",
        lead="Por qué este prompt.",
    )
    add_h2(doc, "Tarea 1.2 — Que lo cree")
    add_step(doc, "2", "Cuando el contenido te encaje, pídele que lo escriba:")
    add_prompt(doc, "«Crea el skill de commit-message con el contenido que me mostraste.»")
    add_expect(doc, "GitHub Copilot crea el fichero en `.github/skills/commit-message/SKILL.md`.")
    add_step(
        doc,
        "3",
        "Ábrelo y recórrelo por partes, como hicimos en el capítulo: el frontmatter arriba "
        "(`name`, `description`, `argument-hint`), y debajo el formato, la tabla de tipos y "
        "las reglas.",
    )
    add_note(
        doc,
        "error",
        "Si GitHub Copilot te crea el fichero en otro sitio (por ejemplo suelto en la raíz o "
        "en una carpeta con otro nombre), muévelo a `.github/skills/commit-message/SKILL.md`: "
        "la carpeta con el nombre del skill es lo que hace que se reconozca. Y recuerda que, "
        "al estar en el repositorio, viajará con el código para quien lo clone.",
    )

    # Ejercicio 2
    add_h1(doc, "Ejercicio 2 — Afínalo: que la description dispare y el formato sea sólido")
    add_intro(
        doc,
        "Un skill es un documento vivo. El primer borrador rara vez es el definitivo: se "
        "prueba, se compara con lo que querías y se ajusta. Aquí afinas dos cosas: que la "
        "`description` enumere bien los disparadores y que el cuerpo del skill recoja las "
        "buenas prácticas del estándar.",
    )
    add_h2(doc, "Tarea 2.1 — Revisa la description, el interruptor")
    add_step(
        doc,
        "1",
        "Lee la `description` que ha generado GitHub Copilot. Pregúntate: **¿enumera las "
        "situaciones en que quiero que salte?** Una buena `description` no dice solo «genera "
        "mensajes de commit»; nombra los disparadores: cuando vas a hacer un commit, cuando "
        "quieres redactar el mensaje, cuando preguntas cómo formular un commit.",
    )
    add_step(
        doc,
        "2",
        "Si la ves genérica, pídele que la mejore nombrando esas situaciones. Es la línea que "
        "decide si el skill se activa solo cuando toca.",
    )
    add_note(
        doc,
        "porque",
        "La `description` es el interruptor. Un skill perfecto por dentro con una "
        "`description` vaga no entra cuando debería. Esta es la línea que más se piensa.",
    )
    add_h2(doc, "Tarea 2.2 — Completa las buenas prácticas con una investigación")
    add_step(doc, "3", "Pídele que verifique si al skill le falta alguna buena práctica del estándar:")
    add_prompt(
        doc,
        "«¿Podemos hacer una investigación para comprobar si faltan buenas prácticas a la hora "
        "de redactar mensajes de commit en el skill?»",
    )
    add_expect(
        doc,
        "GitHub Copilot repasa el estándar **Conventional Commits** y, si procede, completa el "
        "skill: el formato `tipo(ámbito): resumen`, la tabla de tipos (`feat`, `fix`, `docs`, "
        "`refactor`, `test`, `chore`…), el `BREAKING CHANGE` con `!` o footer, los footers "
        "como `Closes: #42`, y el procedimiento paso a paso.",
    )
    add_note(
        doc,
        "pista",
        "Comprueba que el cuerpo del skill deja escrita la regla de oro: **el diff ya cuenta "
        "el cómo; el cuerpo del mensaje responde al porqué**. Y el par de ejemplos de «escueto "
        "≠ vago». Son las dos reglas que hacen que los mensajes salgan útiles.",
    )

    # Ejercicio 3
    add_h1(doc, "Ejercicio 3 — Úsalo de verdad: genera un commit y valídalo antes de confirmar")
    add_intro(
        doc,
        "La prueba de que el skill sirve es verlo trabajar. Vas a subir tu primer cambio —el "
        "propio skill que acabas de crear— dejando que GitHub Copilot genere el mensaje con "
        "él, y pidiéndole que te lo enseñe antes de confirmar, para validarlo tú.",
    )
    add_h2(doc, "Tarea 3.1 — Que genere el mensaje y te lo muestre")
    add_step(doc, "1", "Con el skill ya creado (ese es tu cambio pendiente), pídele:")
    add_prompt(
        doc,
        "«Vamos a subir cambios, primero en local. Usa el nuevo skill de mensajes de commit "
        "para generar el mensaje del commit, y muéstramelo antes de hacer el commit para "
        "validarlo.»",
    )
    add_expect(
        doc,
        "GitHub Copilot lee el skill, mira el cambio (`git status` / `git diff`), y te propone "
        "un mensaje con el formato del skill —algo como `feat(skills): añadir skill "
        "commit-message para mensajes de commit`— **sin confirmar todavía**. Te lo enseña para "
        "que lo valides.",
    )
    add_note(
        doc,
        "porque",
        "¿Tiene un tipo válido? ¿El resumen dice qué cambió sin que tengas que abrir el diff? "
        "¿Está en imperativo y por debajo de los ~50 caracteres? Si el cambio lo merece, ¿el "
        "cuerpo explica el porqué?",
        lead="Revisa el mensaje contra las reglas del skill, no contra que «suene bien».",
    )
    add_h2(doc, "Tarea 3.2 — Aprueba, confirma y sube")
    add_step(doc, "3", "Si el mensaje te convence, dale luz verde:")
    add_prompt(doc, "«Ok, adelante con el commit.»")
    add_expect(doc, "GitHub Copilot hace el commit con el mensaje validado.")
    add_step(doc, "4", "Y llévalo a tu repositorio remoto, como harías en equipo:")
    add_prompt(doc, "«Sube los cambios también al remoto.»")
    add_expect(
        doc,
        "GitHub Copilot hace el `push` a tu repositorio de GitHub. Tu primer skill queda "
        "publicado, versionado junto al código.",
    )
    add_note(
        doc,
        "error",
        "Si el mensaje sale genérico («update», «cambios»), casi siempre el problema está en "
        "la `description` o en las reglas del skill, no en este prompt. Vuelve al Ejercicio 2, "
        "afina el skill, y repite. Ese ciclo —probar, ver qué sale, ajustar el skill— es "
        "exactamente cómo se afina un skill en la vida real.",
    )

    # Definition of Done
    add_h1(doc, "Definition of Done")
    add_body(
        doc,
        "Este capítulo entrega un skill (un `SKILL.md`), no código compilable, así que su "
        "«hecho» es de **artefacto + comportamiento**. Lo has terminado cuando:",
    )
    add_dod(
        doc,
        [
            "Existe el fichero `.github/skills/commit-message/SKILL.md` con su frontmatter "
            "(`name`, `description`, `argument-hint`) y su cuerpo (formato, tipos, reglas, "
            "procedimiento).",
            "La `description` **enumera los disparadores** (no es un «ayuda con git» genérico).",
            "El cuerpo recoge **Conventional Commits** y las dos reglas de calidad (cuerpo = "
            "porqué; escueto ≠ vago).",
            "Le has pedido un commit y GitHub Copilot ha **generado el mensaje con el skill**, "
            "te lo ha mostrado para validar, y ha confirmado tras tu aprobación —y lo has "
            "subido a tu remoto—.",
        ],
    )

    # Comparar con la referencia
    add_h1(doc, "Comparar con la referencia")
    add_body(
        doc,
        "La solución de referencia de este capítulo está en la demo del curso, "
        "`AppTodoList-curso`, en su rama `submodulo-2.1/commit-message`. La usas solo para "
        "mirar —nunca trabajas dentro de la demo—.",
    )
    add_body(doc, "En tu clon de la demo (la carpeta aparte, no la de tu proyecto):")
    add_code(doc, ["cd AppTodoList-curso", "git checkout submodulo-2.1/commit-message"])
    add_body(
        doc,
        "Abre su `.github/skills/commit-message/SKILL.md` y ponlo al lado del tuyo. No tiene "
        "por qué ser idéntico palabra por palabra —tu redacción del encargo influye—, pero la "
        "estructura y las reglas deben coincidir: el frontmatter, la tabla de tipos, las "
        "reglas de calidad y el procedimiento. Si a tu skill le falta alguna parte (por "
        "ejemplo el `BREAKING CHANGE` o los footers), añádela dirigiendo a GitHub Copilot.",
    )

    # Reto opcional
    add_h1(doc, "Reto opcional — tu segundo skill")
    add_body(
        doc,
        "Piensa en tu trabajo real. De las cosas que le pides a GitHub Copilot una y otra vez "
        "con las mismas reglas —el formato de un endpoint, la estructura de un test, un tipo "
        "de consulta—, elige una y **encárgale un segundo skill** para ella, con el mismo "
        "método: describe la tarea, revisa la `description`, afínala hasta que salte, y "
        "pruébala. Si te sale, ya tienes dos partes de tu capa 2.",
    )

    # Lo que has practicado
    add_h1(doc, "Lo que has practicado")
    add_body(
        doc,
        "Has creado tu primer skill desde cero encargándoselo a GitHub Copilot, lo has afinado "
        "hasta que su `description` lo activa cuando toca y su cuerpo recoge el estándar, y lo "
        "has usado para generar un mensaje de commit real que has validado antes de confirmar. "
        "Eso es la **capa 2**, funcionando con tus manos: conocimiento de una tarea, "
        "empaquetado y cargado bajo demanda.",
    )
    add_note(
        doc,
        "info",
        "Acabas de fabricar **un** skill a mano. Pero como el `SKILL.md` es un estándar "
        "abierto, hay un ecosistema entero de skills ya hechos, listos para instalar. Y en "
        "cuanto te traes uno que no escribiste tú, aparece una pregunta que no es menor: ¿qué "
        "estás metiendo, exactamente, en tu proyecto? En el Lab 2.2 exploras ese ecosistema y "
        "aprendes a inspeccionar un skill de fuera antes de confiar en él.",
        lead="Puente al Lab 2.2.",
    )

    path.parent.mkdir(parents=True, exist_ok=True)
    doc.save(str(path))
    print(f"OK -> {path}")


if __name__ == "__main__":
    out = Path(__file__).resolve().parent / "GHCOPTL-M2.1-lab.docx"
    build(out)
