"""Add nested chapter bookmarks and viewer page labels to a verified proof copy."""
from __future__ import annotations
from collections import Counter
from hashlib import sha256
import json
from pathlib import Path
import re
import pymupdf as fitz
from pypdf import PdfReader, PdfWriter
from pypdf.constants import PageLabelStyle
from pypdf.generic import Fit, NameObject, NumberObject, TreeObject

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'pdf-proof/v0.2.0/Bible-proof-v0.2.0.pdf'
OUTPUT = ROOT / 'pdf-proof/v0.3.0/Bible-proof-v0.3.0.pdf'
MANIFEST = ROOT / 'pdf-proof/v0.3.0/navigation-manifest.json'
EXPECTED_SOURCE_SHA = 'bee80c88da5dd99f1e7b526b25db81257c29bd4bbaab9be3faf73f372adce7ca'
CODES = 'Gen Exod Lev Num Deut Josh Judg Ruth 1Sam 2Sam 1Kgs 2Kgs 1Chr 2Chr Ezra Neh Esth Job Ps Prov Eccl Song Isa Jer Lam Ezek Dan Hos Joel Amos Obad Jonah Mic Nah Hab Zeph Hag Zech Mal Matt Mark Luke John Acts Rom 1Cor 2Cor Gal Eph Phil Col 1Thess 2Thess 1Tim 2Tim Titus Phlm Heb Jas 1Pet 2Pet 1John 2John 3John Jude Rev'.split()
BOOK_TITLES = '''GENESIS|EXODUS|LEVITICUS|NUMBERS|DEUTERONOMY|JOSHUA|JUDGES|RUTH|I SAMUEL|II SAMUEL|I KINGS|II KINGS|I CHRONICLES|II CHRONICLES|EZRA|NEHEMIAH|ESTHER|JOB|PSALMS|PROVERBS|ECCLESIASTES|SONG OF SOLOMON|ISAIAH|JEREMIAH|LAMENTATIONS|EZEKIEL|DANIEL|HOSEA|JOEL|AMOS|OBADIAH|JONAH|MICAH|NAHUM|HABAKKUK|ZEPHANIAH|HAGGAI|ZECHARIAH|MALACHI|MATTHEW|MARK|LUKE|JOHN|ACTS|ROMANS|I CORINTHIANS|II CORINTHIANS|GALATIANS|EPHESIANS|PHILIPPIANS|COLOSSIANS|I THESSALONIANS|II THESSALONIANS|I TIMOTHY|II TIMOTHY|TITUS|PHILEMON|HEBREWS|JAMES|I PETER|II PETER|I JOHN|II JOHN|III JOHN|JUDE|REVELATION'''.split('|')
assert len(CODES) == len(BOOK_TITLES) == 66


def page_text_chapter_starts(document: fitz.Document, root_pages: dict[str, int]) -> dict[str, tuple[int, int]]:
    starts = sorted((page, code) for code, page in root_pages.items())
    result: dict[str, tuple[int, int]] = {}
    for page_index, page in enumerate(document):
        if page_index < 2:
            continue
        code = next((book for start, book in reversed(starts) if start <= page_index), None)
        if code is None:
            continue
        for chapter in re.finditer(r'\{(\d+):1\}', page.get_text()):
            key = f'{code}.{chapter.group(1)}'
            if key in result:
                raise ValueError(f'Duplicate chapter-start verse marker: {key}')
            result[key] = (page_index, int(chapter.group(1)))
    return result


def add_navigation(source: Path = SOURCE, output: Path = OUTPUT) -> dict:
    source, output = Path(source), Path(output)
    if sha256(source.read_bytes()).hexdigest() != EXPECTED_SOURCE_SHA:
        raise ValueError('Navigation input does not match the verified v0.2.0 proof')
    reader = PdfReader(source, strict=True)
    if len(reader.pages) != 1162:
        raise ValueError(f'Expected 1162 pages, found {len(reader.pages)}')
    writer = PdfWriter()
    writer.clone_document_from_reader(reader)

    node_by_title = {}
    node = writer.get_outline_root().get('/First')
    while node is not None:
        current = node.get_object()
        title = str(current.get('/Title', ''))
        # Cloned outline dictionaries are generic dictionaries; pypdf's
        # nested insertion helper requires its tree-aware dictionary type.
        current.__class__ = TreeObject
        node_by_title[title] = node
        node = current.get('/Next')
    missing = sorted(set(BOOK_TITLES) - node_by_title.keys())
    if missing:
        raise ValueError(f'Book bookmarks missing from source outline: {missing}')

    geometry = fitz.open(source)
    root_pages = {}
    toc_rows = geometry.get_toc()
    for code, title in zip(CODES, BOOK_TITLES):
        rows = [row for row in toc_rows if row[0] == 1 and row[1] == title]
        if len(rows) != 1:
            raise ValueError(f'Expected one root destination for {title}; found {len(rows)}')
        root_pages[code] = rows[0][2] - 1
    chapter_starts = page_text_chapter_starts(geometry, root_pages)
    if len(chapter_starts) != 1189:
        raise ValueError(f'Expected 1189 chapter starts, found {len(chapter_starts)}')

    counts = Counter()
    for code, title in zip(CODES, BOOK_TITLES):
        book_node = node_by_title[title]
        chapters = sorted((int(key.rsplit('.', 1)[1]), page) for key, (page, _) in chapter_starts.items() if key.startswith(code + '.'))
        if not chapters or [n for n, _ in chapters] != list(range(1, len(chapters) + 1)):
            raise ValueError(f'Chapter numbering is incomplete or out of order for {code}: {chapters[:4]}')
        for chapter, page_index in chapters:
            marker = f'{{{chapter}:1}}'
            boxes = geometry[page_index].search_for(marker)
            if not boxes:
                raise ValueError(f'Cannot position bookmark for {code}.{chapter}.1')
            rect = boxes[0]
            top = geometry[page_index].rect.height - rect.y0
            writer.add_outline_item(f'Chapter {chapter}', page_index, parent=book_node,
                                    fit=Fit.xyz(rect.x0, top, 0), is_open=False)
            counts[code] += 1
        # Preserve any pre-existing nested items (Psalms has five section
        # bookmarks), while collapsing the complete branch by default.
        original_descendants = abs(int(book_node.get_object().get('/Count', 0)))
        book_node.get_object()[NameObject('/Count')] = NumberObject(-len(chapters) - original_descendants)
    geometry.close()

    # The cover and contents have no printed folio. Bible pages are numbered 1-1160.
    writer.set_page_label(0, 0, prefix='Cover')
    writer.set_page_label(1, 1, prefix='Contents')
    writer.set_page_label(2, len(reader.pages) - 1, PageLabelStyle.DECIMAL, start=1)
    metadata = {str(k): str(v) for k, v in (reader.metadata or {}).items() if v is not None}
    metadata['/Subject'] = 'HistoricalBible proof v0.3.0: chapter bookmarks and printed page labels'
    writer.add_metadata(metadata)

    output.parent.mkdir(parents=True, exist_ok=True)
    writer.write(output)
    compacted = output.with_name(output.stem + '.compact.pdf')
    document = fitz.open(output)
    document.save(compacted, garbage=4, deflate=True)
    document.close()
    compacted.replace(output)
    result = {
        'version': '0.3.0', 'source': str(source),
        'source_sha256': sha256(source.read_bytes()).hexdigest(),
        'output': str(output), 'output_sha256': sha256(output.read_bytes()).hexdigest(),
        'pages': len(reader.pages), 'source_bookmarks': len(toc_rows),
        'chapter_bookmarks_added': sum(counts.values()), 'chapters_by_book': dict(counts),
        'page_labels': {'page_1': 'Cover', 'page_2': 'Contents', 'page_3': '1', 'last_page': '1160'},
        'bookmarks_collapsed_under_each_book': True,
        'scope': 'Navigation-only derivative; page content, Scripture and annotations are retained.'
    }
    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(json.dumps(result, indent=2) + '\n', encoding='utf8')
    return result


if __name__ == '__main__':
    print(json.dumps(add_navigation(), indent=2))

