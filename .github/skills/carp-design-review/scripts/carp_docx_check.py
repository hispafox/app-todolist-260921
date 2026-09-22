"""Apoyo a la revisión CARP de documentos Word.

Dos modos:

  # 1) Inspeccionar estructura y estilo de un .docx (no necesita render):
  python carp_docx_check.py inspect <ruta.docx>

  # 2) Rasterizar paginas de un PDF ya exportado a una imagen para revision visual:
  python carp_docx_check.py render <ruta.pdf> <salida.png> [pagina ...]

  # 3) Calcular el ratio de contraste WCAG entre un color de texto y su fondo:
  python carp_docx_check.py contrast <hex_texto> <hex_fondo>

La conversion .docx -> .pdf se hace fuera de este script (Word "Guardar como PDF",
Word COM en Windows, o `soffice --headless --convert-to pdf`). Ver el SKILL.md.
"""
from __future__ import annotations

import hashlib
import re
import sys
import zipfile
from pathlib import Path


def inspect(docx_path: Path) -> int:
    if not docx_path.exists():
        print(f"ERROR: no existe {docx_path}")
        return 1
    if not zipfile.is_zipfile(docx_path):
        print(f"ERROR: {docx_path} no es un .docx valido (zip)")
        return 1

    data = docx_path.read_bytes()
    sha = hashlib.sha256(data).hexdigest()[:16]

    with zipfile.ZipFile(docx_path) as z:
        xml = z.read("word/document.xml").decode("utf-8")
        # El campo PAGE suele vivir en pies/cabeceras, no en el cuerpo.
        chrome = "".join(
            z.read(name).decode("utf-8")
            for name in z.namelist()
            if re.match(r"word/(header|footer)\d+\.xml$", name)
        )

    paragraphs = xml.count("<w:p ") + xml.count("<w:p>")
    tables = xml.count("<w:tbl>")
    fills = sorted({m.upper() for m in re.findall(r'w:fill="([0-9A-Fa-f]{6})"', xml)})
    headings = re.findall(r'w:val="Heading(\d)"', xml)
    heading_counts = {lvl: headings.count(lvl) for lvl in sorted(set(headings))}
    texts = re.findall(r"<w:t[^>]*>([^<]*)</w:t>", xml)
    char_count = sum(len(t) for t in texts)
    page_fields = (xml + chrome).count("PAGE")
    repeat_headers = xml.count("<w:tblHeader")

    print(f"archivo           {docx_path}")
    print(f"tamano_bytes      {len(data)}")
    print(f"sha256_16         {sha}")
    print(f"zip_valido        True")
    print(f"parrafos          {paragraphs}")
    print(f"tablas            {tables}")
    print(f"cabeceras_repet   {repeat_headers}")
    print(f"rellenos_color    {fills or '(ninguno)'}")
    print(f"encabezados       {heading_counts or '(ninguno)'}")
    print(f"campos_PAGE       {page_fields}")
    print(f"caracteres_texto  {char_count}")
    # Pistas CARP rapidas
    hints = []
    if len(fills) < 2:
        hints.append("Contraste/Repeticion: apenas hay color de acento (<2 rellenos).")
    if len(heading_counts) < 2:
        hints.append("Contraste: poca jerarquia de encabezados.")
    if repeat_headers == 0 and tables > 0:
        hints.append("Alineacion: tablas sin cabecera repetida (w:tblHeader).")
    if page_fields == 0:
        hints.append("Remate: sin numeracion de pagina (campo PAGE).")
    print("pistas_carp       " + ("; ".join(hints) if hints else "sin avisos evidentes"))
    return 0


def render(pdf_path: Path, out_png: Path, pages: list[int]) -> int:
    try:
        import pypdfium2 as pdfium
        from PIL import Image
    except ImportError as exc:  # noqa: BLE001
        print(f"ERROR: faltan dependencias de render ({exc}). Instala pypdfium2 y Pillow.")
        return 1
    if not pdf_path.exists():
        print(f"ERROR: no existe {pdf_path}")
        return 1

    pdf = pdfium.PdfDocument(str(pdf_path))
    total = len(pdf)
    wanted = pages or list(range(1, min(3, total) + 1))
    idx = [p - 1 for p in wanted if 0 < p <= total]
    if not idx:
        print(f"ERROR: paginas fuera de rango (el PDF tiene {total})")
        return 1

    imgs = [pdf[i].render(scale=1.4).to_pil() for i in idx]
    width = max(im.width for im in imgs)
    gap = 16
    height = sum(im.height for im in imgs) + gap * (len(imgs) - 1)
    canvas = Image.new("RGB", (width, height), "white")
    y = 0
    for im in imgs:
        canvas.paste(im, (0, y))
        y += im.height + gap
    out_png.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(out_png)
    print(f"render_ok         {out_png}")
    print(f"paginas           {[i + 1 for i in idx]} de {total}")
    return 0


def _luminance(hex_color: str) -> float:
    h = hex_color.lstrip("#")
    if len(h) != 6:
        raise ValueError(hex_color)
    channels = (int(h[i : i + 2], 16) / 255 for i in (0, 2, 4))

    def lin(c: float) -> float:
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4

    r, g, b = (lin(c) for c in channels)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(fg: str, bg: str) -> int:
    try:
        l1, l2 = _luminance(fg), _luminance(bg)
    except ValueError:
        print("ERROR: usa colores hex de 6 digitos, p. ej. FFFFFF 0C1B2C")
        return 1
    lighter, darker = max(l1, l2), min(l1, l2)
    ratio = (lighter + 0.05) / (darker + 0.05)

    def verdict(threshold: float) -> str:
        return "PASA" if ratio >= threshold else "FALLA"

    print(f"colores           #{fg.lstrip('#').upper()} sobre #{bg.lstrip('#').upper()}")
    print(f"ratio_contraste   {ratio:.2f}:1")
    print(f"AA_texto_normal   {verdict(4.5)} (>=4.5)")
    print(f"AA_texto_grande   {verdict(3.0)} (>=3.0)")
    print(f"AAA_texto_normal  {verdict(7.0)} (>=7.0)")
    print(f"AAA_texto_grande  {verdict(4.5)} (>=4.5)")
    return 0


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        print(__doc__)
        return 2
    mode = argv[1]
    if mode == "inspect" and len(argv) >= 3:
        return inspect(Path(argv[2]))
    if mode == "render" and len(argv) >= 4:
        pages = [int(a) for a in argv[4:]]
        return render(Path(argv[2]), Path(argv[3]), pages)
    if mode == "contrast" and len(argv) >= 4:
        return contrast(argv[2], argv[3])
    print(__doc__)
    return 2


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
