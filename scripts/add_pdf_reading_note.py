"""Add a brief, tagged reading note to the verified HistoricalBible PDF proof."""
from __future__ import annotations

from hashlib import sha256
from io import BytesIO
import json
from pathlib import Path

import pymupdf
from pypdf import PdfReader, PdfWriter
from pypdf.constants import PageLabelStyle
from pypdf.generic import ArrayObject, DictionaryObject, NameObject, NumberObject, TextStringObject
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen.canvas import Canvas

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "pdf-proof/v0.3.1/Bible-proof-v0.3.1.pdf"
OUTPUT = ROOT / "pdf-proof/v0.3.2/Bible-proof-v0.3.2.pdf"
EXPECTED_SOURCE_SHA = "cb73cdfe2b0db7b29e2978d482bb0aae9e8b1c5c5a041b09b013f2e1d7c1890e"
FONT = "HistoricalNoteCalibri"
LIGHT = "HistoricalNoteCalibriLight"


def note_page() -> tuple[BytesIO, list[str]]:
    pdfmetrics.registerFont(TTFont(FONT, r"C:\Windows\Fonts\calibri.ttf"))
    pdfmetrics.registerFont(TTFont(LIGHT, r"C:\Windows\Fonts\calibril.ttf"))
    stream = BytesIO()
    page = Canvas(stream, pagesize=(612, 792), pageCompression=1)
    ink, muted, accent = colors.HexColor("#253849"), colors.HexColor("#506273"), colors.HexColor("#346487")
    tags: list[str] = []

    def start(kind="P"):
        page._code.append(f"/{kind} <</MCID {len(tags)}>> BDC")
        tags.append(kind)

    def end():
        page._code.append("EMC")

    def line(label, x, y, size=11, font=FONT, color=ink, kind="P"):
        start(kind)
        page.setFillColor(color)
        page.setFont(font, size)
        page.drawString(x, y, label)
        end()

    page.setStrokeColor(accent)
    page.setLineWidth(1.2)
    page.line(60, 708, 552, 708)
    line("A Note on This Edition", 60, 727, 20, LIGHT, ink, "H1")
    line("Reading marks", 60, 677, 12, FONT, accent, "H2")
    line("{1:1}  Chapter and verse marker: chapter 1, verse 1.", 70, 653)
    line("[was]  Supplied words: italic in most printed KJVs; here bracketed for search, copying, and machine learning.",
         70, 630, 10.8)
    line("( )  Parentheses in a verse belong to the KJV punctuation.", 70, 607)

    line("Four ways LORD / Lord / lord appears", 60, 563, 12, FONT, accent, "H2")
    page.setStrokeColor(colors.HexColor("#D7E0E7"))
    page.setLineWidth(.5)
    for y in (544, 493, 442, 391, 340):
        page.line(60, y, 552, y)

    specimens = [
        ("small", "The usual small-cap form for the divine name (YHWH).", 511),
        ("full", "Four full-height capitals, as in display or inscription text.", 460),
        ("mixed", "A capitalized title; context identifies the person addressed.", 409),
        ("lower", "A lowercase title; context identifies the person addressed.", 358),
    ]
    for form, explanation, baseline in specimens:
        start()
        page.setFillColor(ink)
        text = page.beginText(76, baseline)
        if form == "small":
            text.setFont(FONT, 20)
            text.textOut("L")
            text.setFont(FONT, 15.7)
            text.textOut("ORD")
        else:
            text.setFont(FONT, 20)
            text.textOut({"full": "LORD", "mixed": "Lord", "lower": "lord"}[form])
        page.drawText(text)
        page.setFont(FONT, 10.2)
        page.setFillColor(muted)
        page.drawString(204, baseline + 3, explanation)
        end()

    line("In 'Lord GOD,' GOD may use the same large-first-letter, smaller-capital style.",
         60, 313, 10.4)
    line("Both capital forms copy as ordinary text: LORD.", 60, 293, 10.4)
    line("Older pronouns", 60, 253, 12, FONT, accent, "H2")
    line("Thou, thee, thy, thine ordinarily refer to one person.", 70, 229, 10.8)
    line("Ye, you, your ordinarily refer to more than one person.", 70, 207, 10.8)

    line("The KJV's older English and deliberate cadence invite reading aloud and can aid",
         60, 165, 10.7)
    line("memory. These forms and marks help distinguish wording, address, and emphasis;",
         60, 148, 10.7)
    line("read each passage in its surrounding context.", 60, 131, 10.7)
    page.setStrokeColor(colors.HexColor("#D7E0E7"))
    page.line(60, 83, 552, 83)
    line("HISTORICALBIBLE  |  KING JAMES VERSION", 60, 65, 8.2, FONT, muted)
    page.showPage()
    page.save()
    stream.seek(0)
    return stream, tags


def build(source: Path = SOURCE, output: Path = OUTPUT) -> dict:
    if sha256(source.read_bytes()).hexdigest() != EXPECTED_SOURCE_SHA:
        raise ValueError("Input is not the verified v0.3.1 proof")
    reader = PdfReader(source, strict=True)
    if len(reader.pages) != 1162:
        raise ValueError("Unexpected source page count")
    stream, tag_kinds = note_page()
    note = PdfReader(stream, strict=True).pages[0]
    writer = PdfWriter()
    writer.clone_document_from_reader(reader)
    writer.insert_page(note, index=1)
    new_page = writer.pages[1]
    new_ref = new_page.indirect_reference
    new_page[NameObject("/Tabs")] = NameObject("/S")

    structure = writer.root_object[NameObject("/StructTreeRoot")].get_object()
    document_ref = structure[NameObject("/K")][0]
    document = document_ref.get_object()
    parent_tree = structure[NameObject("/ParentTree")].get_object()
    key = int(structure[NameObject("/ParentTreeNextKey")])
    new_page[NameObject("/StructParents")] = NumberObject(key)
    note_tags = ArrayObject()
    for mcid, kind in enumerate(tag_kinds):
        note_tags.append(writer._add_object(DictionaryObject({
            NameObject("/Type"): NameObject("/StructElem"),
            NameObject("/P"): document_ref,
            NameObject("/S"): NameObject("/" + kind),
            NameObject("/Pg"): new_ref,
            NameObject("/K"): NumberObject(mcid),
        })))
    parent_tree[NameObject("/Nums")].extend([NumberObject(key), note_tags])
    structure[NameObject("/ParentTreeNextKey")] = NumberObject(key + 1)
    children = document[NameObject("/K")]
    cover_ref = writer.pages[0].indirect_reference
    insert_at = next((i for i, child in enumerate(children)
                      if child.get_object().get(NameObject("/Pg")) != cover_ref), None)
    if insert_at is None:
        raise ValueError("Could not locate document contents after cover tags")
    for offset, tag in enumerate(note_tags):
        children.insert(insert_at + offset, tag)

    writer.root_object.pop(NameObject("/PageLabels"), None)
    writer.set_page_label(0, 0, prefix="Cover")
    writer.set_page_label(1, 1, prefix="Note")
    writer.set_page_label(2, 2, prefix="Contents")
    writer.set_page_label(3, len(writer.pages) - 1, PageLabelStyle.DECIMAL, start=1)
    metadata = {str(k): str(v) for k, v in (reader.metadata or {}).items()
                if v is not None and str(v) != "NullObject"}
    metadata["/Subject"] = "HistoricalBible proof v0.3.2: illustrated reading note"
    writer.add_metadata(metadata)
    output.parent.mkdir(parents=True, exist_ok=True)
    writer.write(output)
    compacted = output.with_name(output.stem + ".compact.pdf")
    pdf = pymupdf.open(output)
    pdf.save(compacted, garbage=4, deflate=True)
    pdf.close()
    compacted.replace(output)
    result = {
        "version": "0.3.2", "source": str(source),
        "source_sha256": EXPECTED_SOURCE_SHA, "output": str(output),
        "output_sha256": sha256(output.read_bytes()).hexdigest(),
        "pages": len(writer.pages), "note_page_index": 1,
        "note_tagged_text_elements": len(tag_kinds),
        "scope": "One live-text reading note before Contents; previous pages retained.",
    }
    (output.parent / "reading-note-manifest.json").write_text(
        json.dumps(result, indent=2) + "\n", encoding="utf-8")
    return result


if __name__ == "__main__":
    print(json.dumps(build(), indent=2))
