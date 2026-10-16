"""Embed an exact installed OTF into Word's unembedded WinAnsi font.

Converts only the affected font's text strings to identity CID encoding;
characters, glyph widths, text operators and numeric adjustments are preserved.
The original PDF is never modified. Requires pymupdf and pypdf; fsType embedding
restrictions are checked before loading the font into a new PDF.
"""
from __future__ import annotations

import argparse
import copy
import hashlib
import io
from pathlib import Path
import re
import struct
import xml.etree.ElementTree as ET

import pymupdf
from pypdf import PdfReader, PdfWriter
from pypdf.generic import (
    ArrayObject, ByteStringObject, ContentStream, DecodedStreamObject,
    DictionaryObject, NameObject, NumberObject,
)


def embedding_rights(font_data: bytes) -> int:
    """Return OS/2 fsType; reject restricted, bitmap-only, or unknown rights."""
    tables = struct.unpack_from(">H", font_data, 4)[0]
    for i in range(tables):
        tag, _, offset, _ = struct.unpack_from(">4sIII", font_data, 12 + 16 * i)
        if tag == b"OS/2":
            flags = struct.unpack_from(">H", font_data, offset + 8)[0]
            if flags & (0x0002 | 0x0200):
                raise ValueError(f"Font embedding prohibited: fsType={flags:#06x}")
            if flags & ~0x030E:
                raise ValueError(f"Unknown font embedding rights: {flags:#06x}")
            return flags
    raise ValueError("No OS/2 embedding-rights declaration; manual review needed")


def winansi(code: int) -> str:
    # PDF WinAnsi's printable aliases differ from Windows cp1252.
    if code in (127, 129, 141, 143, 144, 157):
        return "\u2022"
    if code == 160:
        return " "
    return bytes([code]).decode("cp1252")


def stream(writer: PdfWriter, data: str):
    result = DecodedStreamObject()
    result.set_data(data.encode("ascii"))
    return writer._add_object(result)


def cmap_blocks(entries: list[str], kind: str) -> str:
    # PDF CMaps limit mapping sections to 100 entries each.
    return "\n".join(
        f"{len(entries[i:i + 100])} begin{kind}\n"
        + "\n".join(entries[i:i + 100]) + f"\nend{kind}"
        for i in range(0, len(entries), 100)
    )


def embed_font(source: Path, output: Path, font_path: Path,
               base_font: str = "AdobeHeitiStd-Regular") -> dict:
    if source.resolve() == output.resolve():
        raise ValueError("Source PDF must remain read-only; choose a new output")
    font_data = font_path.read_bytes()
    rights = embedding_rights(font_data)
    exact_font = pymupdf.Font(fontbuffer=font_data)

    # Let MuPDF construct the appropriate CID descendant, FontFile3/OpenType,
    # and descriptor for the unchanged CFF OTF; keep it only in memory.
    template = pymupdf.open()
    page = template.new_page()
    page.insert_font(fontbuffer=font_data, fontname="ExactSource")
    template_reader = PdfReader(io.BytesIO(template.tobytes()))
    font_template = template_reader.pages[0]["/Resources"]["/Font"]["/ExactSource"]
    if font_template["/DescendantFonts"][0]["/BaseFont"] != "/" + base_font:
        raise ValueError("Installed font program does not match the requested exact font")

    reader = PdfReader(source)
    writer = PdfWriter()
    writer.clone_document_from_reader(reader)
    affected = {}
    rewritten_strings = 0
    seen_forms = set()

    def rewrite(contents, resources, inherited_font=None, inherited_tw=0):
        nonlocal rewritten_strings
        resources = resources.get_object()
        fonts = resources.get("/Font", DictionaryObject()).get_object()
        current_font, word_spacing = inherited_font, inherited_tw
        stack = []
        content = ContentStream(contents, writer)

        def convert(value):
            nonlocal rewritten_strings
            if current_font is None:
                return value
            font = current_font.get_object()
            if font.get("/BaseFont") != "/" + base_font:
                return value
            descriptor = font.get("/FontDescriptor", DictionaryObject()).get_object()
            if any(key in descriptor for key in ("/FontFile", "/FontFile2", "/FontFile3")):
                return value
            if font.get("/Subtype") != "/Type1" or font.get("/Encoding") != "/WinAnsiEncoding":
                raise ValueError("Only the verified simple Type1/WinAnsi font is supported")
            raw = bytes(value) if isinstance(value, ByteStringObject) else value.original_bytes
            if word_spacing != 0 and 32 in raw:
                raise ValueError("Nonzero Tw on affected spaces needs explicit geometry conversion")
            entry = affected.setdefault(current_font.idnum, {"reference": current_font, "codes": set()})
            entry["codes"].update(raw)
            rewritten_strings += 1
            result = bytearray()
            for code in raw:
                cid = exact_font.has_glyph(ord(winansi(code)))
                if not cid or cid > 65535:
                    raise ValueError(f"Exact font lacks supported WinAnsi code {code}")
                result.extend(cid.to_bytes(2, "big"))
            return ByteStringObject(bytes(result))

        for operands, operator in content.operations:
            if operator == b"q":
                stack.append((current_font, word_spacing))
            elif operator == b"Q":
                if not stack:
                    raise ValueError("Unbalanced graphics-state stack")
                current_font, word_spacing = stack.pop()
            elif operator == b"Tf":
                current_font = fonts.raw_get(operands[0])
            elif operator == b"Tw":
                word_spacing = operands[0]
            elif operator == b'Tj' or operator == b"'":
                operands[0] = convert(operands[0])
            elif operator == b'"':
                word_spacing = operands[0]
                operands[2] = convert(operands[2])
            elif operator == b"TJ":
                operands[0] = ArrayObject([
                    item if isinstance(item, (int, float)) else convert(item)
                    for item in operands[0]
                ])
            elif operator == b"Do":
                forms = resources.get("/XObject", DictionaryObject()).get_object()
                form_ref = forms.raw_get(operands[0])
                form = form_ref.get_object()
                if form.get("/Subtype") == "/Form":
                    signature = (form_ref.idnum, getattr(current_font, "idnum", None), float(word_spacing))
                    if signature not in seen_forms:
                        if any(s[0] == form_ref.idnum for s in seen_forms):
                            raise ValueError("Shared form inherits incompatible text states")
                        seen_forms.add(signature)
                        changed = rewrite(form, form.get("/Resources", resources), current_font, word_spacing)
                        form.set_data(changed.get_data())
        return content

    for page in writer.pages:
        page[NameObject("/Contents")] = writer._add_object(
            rewrite(page.get_contents(), page["/Resources"])
        )

    replacements = {}
    for entry in affected.values():
        for reference in (entry["reference"],):
            old = reference.get_object()
            if old.get("/BaseFont") != "/" + base_font:
                continue
            descriptor = old.get("/FontDescriptor", {}).get_object()
            if any(key in descriptor for key in ("/FontFile", "/FontFile2", "/FontFile3")):
                continue
            if old.get("/Subtype") != "/Type1" or old.get("/Encoding") != "/WinAnsiEncoding":
                raise ValueError("Only the verified simple Type1/WinAnsi font is supported")
            identity = reference.idnum
            if identity in replacements:
                continue
            new = font_template.clone(writer, force_duplicate=True)
            new = new.get_object()
            descendant = new["/DescendantFonts"][0].get_object()
            first, last = int(old["/FirstChar"]), int(old["/LastChar"])
            widths = old["/Widths"].get_object()
            unicode_values, cid_widths, cid_unicode = [], {}, {}
            for code in sorted(entry["codes"]):
                char = winansi(code)
                cid = exact_font.has_glyph(ord(char))
                if not cid:
                    raise ValueError(f"Exact font lacks WinAnsi code {code} ({char!r})")
                width = widths[code - first]
                if cid in cid_widths and cid_widths[cid] != width:
                    raise ValueError("Aliased glyphs have incompatible source widths")
                if cid in cid_unicode and cid_unicode[cid] != char:
                    raise ValueError("Ambiguous source Unicode aliases require distinct CIDs")
                cid_widths[cid] = width
                cid_unicode[cid] = char
            for cid, char in sorted(cid_unicode.items()):
                unicode_values.append(f"<{cid:04X}> <{char.encode('utf-16-be').hex().upper()}>")
            prefix = "/CIDInit /ProcSet findresource begin\n12 dict begin\nbegincmap\n"
            suffix = "\nendcmap\nCMapName currentdict /CMap defineresource pop\nend\nend\n"
            unicode = prefix + (
                "/CIDSystemInfo <</Registry(Adobe)/Ordering(UCS)/Supplement 0>> def\n"
                "/CMapName /Original-WinAnsi-Unicode def\n/CMapType 2 def\n"
                "1 begincodespacerange\n<0000> <FFFF>\nendcodespacerange\n"
                + cmap_blocks(unicode_values, "bfchar")
            ) + suffix
            new[NameObject("/Encoding")] = NameObject("/Identity-H")
            new[NameObject("/ToUnicode")] = stream(writer, unicode)
            descendant[NameObject("/W")] = ArrayObject([
                item for cid, width in sorted(cid_widths.items())
                for item in (NumberObject(cid), ArrayObject([width]))
            ])
            # Replace the existing shared dictionary in place; every consumer,
            # including form XObjects, retains the original resource reference.
            old.clear()
            old.update(new)
            replacements[identity] = base_font
    if not replacements:
        raise ValueError("No matching unembedded font found; output not written")
    writer.write(output)
    template.close()
    return {"embedded_fonts": len(replacements), "rewritten_strings": rewritten_strings, "fsType": rights,
            "font_bytes": len(font_data), "output": str(output)}


def clean_running_furniture(source: Path, output: Path, start_page: int = 2) -> dict:
    """Preserve running labels as shared vector glyphs, outside copy/select text.

    start_page is zero-based. Only text-show operands inside /Artifact marked
    content are emptied. Main Scripture, genuine headings, MCIDs, links and the
    structure tree remain native and retain their source geometry.
    """
    source, output = Path(source), Path(output)
    if source.resolve() == output.resolve():
        raise ValueError("Choose a separate output; the input remains read-only")
    ET.register_namespace("", "http://www.w3.org/2000/svg")
    ET.register_namespace("xlink", "http://www.w3.org/1999/xlink")
    ns = "{http://www.w3.org/2000/svg}"
    href = "{http://www.w3.org/1999/xlink}href"
    original = pymupdf.open(source)
    vector_source = pymupdf.open()
    vector_cache, groups_by_page = {}, {}
    writer = PdfWriter()
    writer.clone_document_from_reader(PdfReader(source))
    removed = 0
    for index in range(start_page, len(original)):
        page = original[index]
        svg = ET.fromstring(page.get_svg_image(text_as_path=True))
        definitions = {e.get("id"): e for e in svg.iter() if e.get("id")}
        groups = {}
        for use in svg.iter(ns + "use"):
            matrix = re.findall(r"[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?", use.get("transform", ""))
            if len(matrix) != 6 or not use.get("data-text", "").strip():
                continue
            baseline = float(matrix[5])
            if baseline < 40 or baseline > 748:
                groups.setdefault(round(baseline, 4), []).append(copy.deepcopy(use))
        groups_by_page[index] = []
        for uses in groups.values():
            result = ET.Element(ns + "svg", width=str(page.rect.width),
                                height=str(page.rect.height),
                                viewBox=f"0 0 {page.rect.width} {page.rect.height}")
            defs = ET.SubElement(result, ns + "defs")
            wanted = sorted({u.get(href, "").lstrip("#") for u in uses})
            # Font-generated IDs can vary by page. Canonicalize IDs by their
            # exact path data so repeated labels share the same PDF form.
            renamed = {}
            for identity in wanted:
                element = copy.deepcopy(definitions[identity])
                element.attrib.pop("id", None)
                new_id = "g" + hashlib.sha256(ET.tostring(element)).hexdigest()[:20]
                element.set("id", new_id)
                renamed[identity] = new_id
                defs.append(element)
            # Sort defs after canonicalization to avoid source-ID ordering noise.
            defs[:] = sorted(defs, key=lambda e: e.get("id"))
            for use in uses:
                use.set(href, "#" + renamed[use.get(href).lstrip("#")])
                use.attrib.pop("data-text", None)
            result.extend(uses)
            data = ET.tostring(result)
            digest = hashlib.sha256(data).digest()
            if digest not in vector_cache:
                svg_document = pymupdf.open(stream=data, filetype="svg")
                vector_pdf = pymupdf.open(stream=svg_document.convert_to_pdf(), filetype="pdf")
                number = len(vector_source)
                vector_source.insert_pdf(vector_pdf)
                vector_cache[digest] = number
                vector_pdf.close()
                svg_document.close()
            groups_by_page[index].append(vector_cache[digest])
        content = ContentStream(writer.pages[index].get_contents(), writer)
        artifacts = []
        for operands, operator in content.operations:
            if operator in (b"BMC", b"BDC"):
                artifacts.append((artifacts[-1] if artifacts else False) or operands[0] == "/Artifact")
            elif operator == b"EMC":
                if not artifacts:
                    raise ValueError(f"Unbalanced marked content on page {index + 1}")
                artifacts.pop()
            elif artifacts and artifacts[-1]:
                if operator in (b"Tj", b"'", b'"'):
                    operands[-1] = ByteStringObject(b"")
                    removed += 1
                elif operator == b"TJ":
                    operands[0] = ArrayObject([v for v in operands[0] if isinstance(v, (int, float))])
                    removed += 1
        if artifacts:
            raise ValueError(f"Unbalanced marked content on page {index + 1}")
        writer.pages[index][NameObject("/Contents")] = writer._add_object(content)
    buffer = io.BytesIO()
    writer.write(buffer)
    document = pymupdf.open(stream=buffer.getvalue(), filetype="pdf")
    for index, numbers in groups_by_page.items():
        for number in numbers:
            document[index].show_pdf_page(document[index].rect, vector_source, number)
    metadata = dict(document.metadata)
    metadata['subject'] = 'HistoricalBible owner-review proof v0.2.0; not a publication replacement'
    document.set_metadata(metadata)
    document.save(output, garbage=4, deflate=True)
    document.close()
    original.close()
    vector_source.close()
    return {"pages_cleaned": len(groups_by_page), "artifact_text_operations": removed,
            "unique_vector_groups": len(vector_cache), "output_bytes": output.stat().st_size,
            "output": str(output)}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("font", type=Path)
    parser.add_argument("--base-font", default="AdobeHeitiStd-Regular")
    args = parser.parse_args()
    print(embed_font(args.source, args.output, args.font, args.base_font))
