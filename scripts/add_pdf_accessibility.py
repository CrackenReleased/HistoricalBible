"""Improve accessible structure of the verified navigation proof without reflowing pages."""
from __future__ import annotations

from hashlib import sha256
import json
from pathlib import Path

import pymupdf
from pypdf import PdfReader, PdfWriter
from pypdf.generic import ArrayObject, DictionaryObject, NameObject, NumberObject, TextStringObject


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "pdf-proof/v0.3.0/Bible-proof-v0.3.0.pdf"
OUTPUT = ROOT / "pdf-proof/v0.3.1/Bible-proof-v0.3.1.pdf"
MANIFEST = OUTPUT.parent / "accessibility-manifest.json"
EXPECTED_SOURCE_SHA = "8d35c14fa7e21144dae6e62f6faea35cd587f56b4db94641aad8acb6db3e66b2"
LINK_LABEL = "Return to table of contents"


def add_accessibility(source: Path = SOURCE, output: Path = OUTPUT) -> dict:
    source, output = Path(source), Path(output)
    source_hash = sha256(source.read_bytes()).hexdigest()
    if source_hash != EXPECTED_SOURCE_SHA:
        raise ValueError("Accessibility input differs from the verified v0.3.0 proof")

    reader = PdfReader(source, strict=True)
    if len(reader.pages) != 1162:
        raise ValueError("Unexpected page count")
    writer = PdfWriter()
    writer.clone_document_from_reader(reader)
    structure = writer.root_object[NameObject("/StructTreeRoot")].get_object()
    document_ref = structure[NameObject("/K")][0]
    document = document_ref.get_object()

    # The cover has two ornamental figures whose Word-generated alt strings
    # are opaque IDs. Give them short descriptions and expose its real title.
    cover_ref = writer.pages[0].indirect_reference
    figure_alts = ["Decorative pale blue floral flourishes",
                   "Decorative pale blue stylized leaves"]
    figures = []
    cover_headings = set()
    for item_ref in document[NameObject("/K")]:
        item = item_ref.get_object()
        if item.get(NameObject("/Pg")) != cover_ref:
            continue
        if item.get(NameObject("/S")) == NameObject("/Figure"):
            figures.append(item)
        elif item.get(NameObject("/S")) == NameObject("/P"):
            mcids = list(item.get(NameObject("/K"), []))
            if mcids == [1]:
                item[NameObject("/S")] = NameObject("/H1")
                cover_headings.add(1)
            elif mcids == [2]:
                item[NameObject("/S")] = NameObject("/H2")
                cover_headings.add(2)
    if len(figures) != 2 or cover_headings != {1, 2}:
        raise ValueError("Cover tag structure differs from the verified input")
    for figure, alt in zip(figures, figure_alts):
        figure[NameObject("/Alt")] = TextStringObject(alt)

    # The visual header on each Scripture page is a clickable return link.
    # Its annotation had no StructParent, so it was absent from the reading
    # structure. Attach a named Link/OBJR pair at the start of that page.
    parent_tree = structure[NameObject("/ParentTree")].get_object()
    parent_numbers = parent_tree[NameObject("/Nums")]
    next_key = int(structure[NameObject("/ParentTreeNextKey")])
    contents_ref = writer.pages[1].indirect_reference
    link_by_page_ref = {}
    validated_links = []
    for page_index in range(2, len(writer.pages)):
        page = writer.pages[page_index]
        page_ref = page.indirect_reference
        annotations = [ref for ref in page[NameObject("/Annots")]
                       if ref.get_object().get(NameObject("/Subtype")) == NameObject("/Link")]
        if len(annotations) != 1:
            raise ValueError(f"Expected one header link on page {page_index + 1}")
        annotation_ref = annotations[0]
        annotation = annotation_ref.get_object()
        if (NameObject("/StructParent") in annotation
                or annotation.get(NameObject("/Dest"), [None])[0] != contents_ref):
            raise ValueError(f"Unexpected header link on page {page_index + 1}")
        validated_links.append((page, page_ref, annotation_ref))

    # Resolve every page and annotation before appending objects to the writer.
    # pypdf may otherwise allocate an object number needed by a lazy clone.
    for page, page_ref, shared_annotation_ref in validated_links:
        # The source export reuses one identical annotation object on all
        # Scripture pages. A tagged annotation needs its own StructParent,
        # so give each page a distinct copy before attaching its OBJR.
        annotation = DictionaryObject(shared_annotation_ref.get_object())
        annotation_ref = writer._add_object(annotation)
        page[NameObject("/Annots")][0] = annotation_ref
        annotation[NameObject("/Contents")] = TextStringObject(LINK_LABEL)
        annotation[NameObject("/StructParent")] = NumberObject(next_key)
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
            NameObject("/Alt"): TextStringObject(LINK_LABEL),
            NameObject("/K"): ArrayObject([object_ref]),
        }))
        parent_numbers.extend([NumberObject(next_key), tag_ref])
        link_by_page_ref[page_ref.idnum] = tag_ref
        next_key += 1
    structure[NameObject("/ParentTreeNextKey")] = NumberObject(next_key)

    original_children = document[NameObject("/K")]
    ordered_children = ArrayObject()
    inserted = set()
    for item_ref in original_children:
        item = item_ref.get_object()
        page_ref = item.get(NameObject("/Pg"))
        page_number = page_ref.idnum if page_ref is not None else None
        if page_number in link_by_page_ref and page_number not in inserted:
            ordered_children.append(link_by_page_ref[page_number])
            inserted.add(page_number)
        ordered_children.append(item_ref)
    if len(inserted) != 1160:
        raise ValueError(f"Tagged page starts missing: {1160 - len(inserted)}")
    document[NameObject("/K")] = ordered_children

    metadata = {str(k): str(v) for k, v in (reader.metadata or {}).items()
                if v is not None and str(v) != "NullObject"}
    metadata["/Subject"] = "HistoricalBible proof v0.3.1: accessible cover and return navigation"
    writer.add_metadata(metadata)
    output.parent.mkdir(parents=True, exist_ok=True)
    writer.write(output)
    compacted = output.with_name(output.stem + ".compact.pdf")
    pdf = pymupdf.open(output)
    pdf.save(compacted, garbage=4, deflate=True)
    pdf.close()
    compacted.replace(output)
    result = {
        "version": "0.3.1", "source": str(source), "source_sha256": source_hash,
        "output": str(output), "output_sha256": sha256(output.read_bytes()).hexdigest(),
        "pages": len(reader.pages), "cover_figures_labeled": 2,
        "cover_headings": ["Holy Bible", "King James Version"],
        "return_links_tagged_and_labeled": 1160,
        "scope": "Accessibility structure only; existing text, page layout, links and bookmarks preserved.",
    }
    MANIFEST.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    return result


if __name__ == "__main__":
    print(json.dumps(add_accessibility(), indent=2))
