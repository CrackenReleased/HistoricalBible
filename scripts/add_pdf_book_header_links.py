"""Link each visible running book title to that book's chapter-one page."""
from __future__ import annotations

from bisect import bisect_right
from hashlib import sha256
import json
from pathlib import Path

import numpy as np
import pymupdf
from pypdf import PdfReader, PdfWriter
from pypdf.generic import ArrayObject, DictionaryObject, FloatObject, NameObject, NumberObject, TextStringObject


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "pdf-proof/v0.3.2/Bible-proof-v0.3.2.pdf"
OUTPUT = ROOT / "pdf-proof/v0.3.3/Bible-proof-v0.3.3.pdf"
EXPECTED_SOURCE_SHA = "3e0964d4874ef028e3fb5cf3c68daefb7d831396ced24cf8d22a671ba427fc16"
TESTAMENT_HEADINGS = ("~ THE OLD TESTAMENT ~", "~ THE NEW TESTAMENT ~")


def visible_book_rect(page: pymupdf.Page) -> tuple[float, float, float, float]:
    """Find the existing blue right-header lettering, not a guessed hit area."""
    scale = 2
    pix = page.get_pixmap(matrix=pymupdf.Matrix(scale, scale),
                          clip=pymupdf.Rect(0, 0, page.rect.width, 30), alpha=False)
    rgb = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, 3)
    red, blue = rgb[:, :, 0].astype(np.int16), rgb[:, :, 2].astype(np.int16)
    mask = (blue > red + 20) & (red < 200)
    mask[:, :800] = False  # Existing center return label is outside this region.
    yy, xx = np.where(mask)
    if len(xx) < 12:
        raise ValueError(f"Cannot locate right running header on page {page.number + 1}")
    # PyMuPDF measures from top left; link rectangles in PDF use bottom left.
    x0, x1 = xx.min() / scale - 3, (xx.max() + 1) / scale + 3
    y0, y1 = yy.min() / scale - 4, (yy.max() + 1) / scale + 4
    if not (400 < x0 < x1 <= 600 and 8 < y0 < y1 < 30):
        raise ValueError(f"Unexpected header box on page {page.number + 1}: {(x0, y0, x1, y1)}")
    return x0, y0, x1, y1


def add_book_header_links(source: Path = SOURCE, output: Path = OUTPUT) -> dict:
    source, output = Path(source), Path(output)
    source_hash = sha256(source.read_bytes()).hexdigest()
    if source_hash != EXPECTED_SOURCE_SHA:
        raise ValueError("Input is not the verified v0.3.2 reading-note proof")

    geometry = pymupdf.open(source)
    reader = PdfReader(source, strict=True)
    if len(reader.pages) != 1163 or len(geometry) != 1163:
        raise ValueError("Unexpected source page count")
    roots = [(row[2] - 1, row[1]) for row in geometry.get_toc()
             if row[0] == 1 and row[1] not in
             ("Table of Contents:", *TESTAMENT_HEADINGS)]
    if len(roots) != 66 or roots[0][0] != 3 or roots[-1][1] != "REVELATION":
        raise ValueError("Book outline differs from the verified proof")
    starts = [page for page, _ in roots]

    writer = PdfWriter()
    writer.clone_document_from_reader(reader)
    book_destinations = {}
    node = writer.root_object[NameObject("/Outlines")][NameObject("/First")]
    while node is not None:
        outline = node.get_object()
        title = str(outline.get(NameObject("/Title"), ""))
        if title in {name for _, name in roots}:
            book_destinations[title] = ArrayObject(outline[NameObject("/Dest")])
        node = outline.get(NameObject("/Next"))
    if len(book_destinations) != 66:
        raise ValueError("Could not recover all existing book destinations")
    structure = writer.root_object[NameObject("/StructTreeRoot")].get_object()
    document_ref = structure[NameObject("/K")][0]
    document = document_ref.get_object()
    parent_numbers = structure[NameObject("/ParentTree")].get_object()[NameObject("/Nums")]
    next_key = int(structure[NameObject("/ParentTreeNextKey")])
    contents_ref = writer.pages[2].indirect_reference

    # Resolve all relevant cloned references before adding new objects; pypdf
    # can otherwise allocate an object number needed by a lazy clone.
    pending = []
    skipped = []
    for page_index in range(3, len(writer.pages)):
        page = writer.pages[page_index]
        page_ref = page.indirect_reference
        old_link_refs = [ref for ref in page[NameObject("/Annots")]
                         if ref.get_object().get(NameObject("/Subtype")) == NameObject("/Link")]
        if len(old_link_refs) != 1 or old_link_refs[0].get_object()[NameObject("/Dest")][0] != contents_ref:
            raise ValueError(f"Existing Contents link differs on page {page_index + 1}")
        book_start, title = roots[bisect_right(starts, page_index) - 1]
        target_ref = writer.pages[book_start].indirect_reference
        if book_destinations[title][0] != target_ref:
            raise ValueError(f"Bookmark for {title} does not match its chapter-one page")
        body = geometry[page_index].get_text()
        if body.startswith(TESTAMENT_HEADINGS):
            # These two pages visibly say OLD/NEW TESTAMENT at top right,
            # rather than a book name. Their book starts remain in the index.
            skipped.append(page_index)
            continue
        rect = visible_book_rect(geometry[page_index])
        pending.append((page, page_ref, target_ref, title, rect))
    if len(pending) != 1158 or skipped != [3, 882]:
        raise ValueError(f"Unexpected header inventory: {len(pending)} book labels, {skipped} testament labels")
    widths_by_title: dict[str, list[float]] = {}
    for _, _, _, title, rect in pending:
        widths_by_title.setdefault(title, []).append(rect[2] - rect[0])
    for title, widths in widths_by_title.items():
        if max(widths) - min(widths) > 2:
            raise ValueError(f"Running header width varies within {title}; inspect before linking")
    geometry.close()

    new_tag_by_page = {}
    for page, page_ref, target_ref, title, (x0, y0, x1, y1) in pending:
        height = float(page.mediabox.height)
        annotation_ref = writer._add_object(DictionaryObject({
            NameObject("/Subtype"): NameObject("/Link"),
            NameObject("/Rect"): ArrayObject([FloatObject(x0), FloatObject(height-y1),
                                               FloatObject(x1), FloatObject(height-y0)]),
            NameObject("/BS"): DictionaryObject({NameObject("/W"): NumberObject(0)}),
            NameObject("/F"): NumberObject(4),
            # Reuse the book bookmark's precise destination and zoom behavior.
            NameObject("/Dest"): ArrayObject(book_destinations[title]),
            NameObject("/Contents"): TextStringObject(f"Go to chapter 1 of {title}"),
            NameObject("/StructParent"): NumberObject(next_key),
        }))
        page[NameObject("/Annots")].append(annotation_ref)
        object_ref = writer._add_object(DictionaryObject({
            NameObject("/Type"): NameObject("/OBJR"),
            NameObject("/Obj"): annotation_ref,
            NameObject("/Pg"): page_ref,
        }))
        tag_ref = writer._add_object(DictionaryObject({
            NameObject("/Type"): NameObject("/StructElem"),
            NameObject("/P"): document_ref,
            NameObject("/S"): NameObject("/Link"),
            NameObject("/Pg"): page_ref,
            NameObject("/Alt"): TextStringObject(f"Go to chapter 1 of {title}"),
            NameObject("/K"): ArrayObject([object_ref]),
        }))
        parent_numbers.extend([NumberObject(next_key), tag_ref])
        new_tag_by_page[page_ref.idnum] = tag_ref
        next_key += 1
    structure[NameObject("/ParentTreeNextKey")] = NumberObject(next_key)

    children = ArrayObject()
    inserted = set()
    for item_ref in document[NameObject("/K")]:
        children.append(item_ref)
        item = item_ref.get_object()
        page_ref = item.get(NameObject("/Pg"))
        if (item.get(NameObject("/S")) == NameObject("/Link")
                and item.get(NameObject("/Alt")) == "Return to table of contents"
                and page_ref is not None and page_ref.idnum in new_tag_by_page):
            children.append(new_tag_by_page[page_ref.idnum])
            inserted.add(page_ref.idnum)
    if len(inserted) != len(pending):
        raise ValueError(f"Could not place {len(pending) - len(inserted)} links in reading order")
    document[NameObject("/K")] = children

    metadata = {str(k): str(v) for k, v in (reader.metadata or {}).items()
                if v is not None and str(v) != "NullObject"}
    metadata["/Subject"] = "HistoricalBible proof v0.3.3: clickable book-name running headers"
    writer.add_metadata(metadata)
    output.parent.mkdir(parents=True, exist_ok=True)
    writer.write(output)
    compacted = output.with_name(output.stem + ".compact.pdf")
    pdf = pymupdf.open(output)
    pdf.save(compacted, garbage=4, deflate=True)
    pdf.close()
    compacted.replace(output)

    result = {
        "version": "0.3.3", "source": str(source), "source_sha256": source_hash,
        "output": str(output), "output_sha256": sha256(output.read_bytes()).hexdigest(),
        "pages": len(reader.pages), "book_header_links_added": len(pending),
        "testament_header_pages_without_book_label": skipped,
        "scope": "Added tagged book-title links only; visible page content and existing navigation unchanged.",
    }
    (output.parent / "book-header-links-manifest.json").write_text(
        json.dumps(result, indent=2) + "\n", encoding="utf-8")
    return result


if __name__ == "__main__":
    print(json.dumps(add_book_header_links(), indent=2))
