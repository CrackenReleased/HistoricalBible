"""Extract a source-identified local KJV comparison witness for PDF repair.

This derivative is audit evidence, never an automatic canonical replacement.
Run with Python + PyMuPDF. Only the named JSON output is written.
"""
from __future__ import annotations

import argparse
from collections import Counter
from hashlib import sha256
import json
from pathlib import Path
import re
import subprocess

import pymupdf as fitz

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "TacticalCastle" / "HistoricalBible" / "AV1611.pdf"
OUTPUT = ROOT / "pdf-proof" / "v0.2.0" / "reference-verses.json"
SOURCE_SHA = "ec475474ca4753c0eb05498213e6864dbd3d5b1dc0af0a819834c74b2867d127"
INVENTORY_SHA = "04eaa83915daf5b8bde0bfb8877104d726a1388a8f46583c24ae133eba7d43d8"
CODES = "Gen Exod Lev Num Deut Josh Judg Ruth 1Sam 2Sam 1Kgs 2Kgs 1Chr 2Chr Ezra Neh Esth Job Ps Prov Eccl Song Isa Jer Lam Ezek Dan Hos Joel Amos Obad Jonah Mic Nah Hab Zeph Hag Zech Mal Matt Mark Luke John Acts Rom 1Cor 2Cor Gal Eph Phil Col 1Thess 2Thess 1Tim 2Tim Titus Phlm Heb Jas 1Pet 2Pet 1John 2John 3John Jude Rev".split()
SINGLE = {"Obad", "Phlm", "2John", "3John", "Jude"}
CHAPTER = re.compile(r"(?:[123] )?[A-Z]{2,8} (\d{2,3})$")
NUMBER = re.compile(r"(?<!\w)(\d{1,3})(?:\s+|$)")
DIVINE = re.compile(r"(?<![A-Za-z])(?:LORD|GOD)(?![A-Za-z])")
ACROSTICS = set("ALEPH BETH GIMEL DALETH HE VAU ZAIN CHETH TETH JOD CAPH LAMED MEM NUN SAMECH AIN PE TZADDI KOPH RESH SCHIN TAU".split())


def norm(text):
    return re.sub(r"\s+", " ", text).strip()


def styled_lines(page):
    """Keep source reading order and actual font properties, not OCR."""
    for block in page.get_text("rawdict")["blocks"]:
        for line in block.get("lines", []):
            chars = []
            previous = None
            for span in line["spans"]:
                for c in span["chars"]:
                    # Some small-cap/font transitions draw a real word-space
                    # using positioning rather than an encoded space glyph.
                    # Retain that existing gap; never guess letters or words.
                    if previous and chars and not chars[-1]["c"].isspace() and not c["c"].isspace():
                        old, old_size, old_font = previous
                        gap = c["origin"][0] - old["bbox"][2]
                        changed = old_font != span["font"] or abs(old_size-span["size"]) > .1
                        if changed and old["c"].isalpha() and c["c"].isalpha() and gap > max(.8, min(old_size,span["size"])*.12):
                            chars.append({"c":" ","italic":False,"smaller_cap":False,"inferred_gap_space":round(gap,4)})
                    chars.append({"c": c["c"], "italic": "Italic" in span["font"], "font_size": round(span["size"], 4),
                                  "smaller_cap": span["size"] < 9 and c["c"].isupper()})
                    previous = (c, span["size"], span["font"])
            while chars and chars[0]["c"].isspace():
                chars.pop(0)
            while chars and chars[-1]["c"].isspace():
                chars.pop()
            if chars:
                yield {"chars": chars, "text": "".join(c["c"] for c in chars),
                       "max_size": max(s["size"] for s in line["spans"]),
                       "bbox": [round(v, 3) for v in line["bbox"]]}


def add_segment(record, chars, page):
    if not chars:
        return
    record["segments"].append({"page": page, "chars": chars})


def ranges(chars, flag):
    result, start = [], None
    for i in range(len(chars) + 1):
        enabled = i < len(chars) and chars[i].get(flag, False)
        if enabled and start is None:
            start = i
        elif not enabled and start is not None:
            end = i
            while start < end and chars[start]["c"].isspace():
                start += 1
            while end > start and chars[end - 1]["c"].isspace():
                end -= 1
            if end > start:
                result.append({"start": start, "end": end,
                               "text": "".join(c["c"] for c in chars[start:end])})
            start = None
    return result


def finish(record):
    chars, pilcrows, joins = [], [], []
    for segment in record.pop("segments"):
        incoming = segment["chars"]
        if chars and incoming:
            if chars[-1]["c"] == "-":
                joins.append({"offset": len(chars), "kind": "printed_hyphen_preserved_across_line_wrap"})
            else:
                chars.append({"c": " ", "italic": chars[-1]["italic"] and incoming[0]["italic"],
                              "smaller_cap": False})
        for c in incoming:
            if c["c"] == "\u00b6":
                pilcrows.append({"offset": len(chars), "page": segment["page"]})
                continue
            if c["c"].isspace():
                if not chars or chars[-1]["c"] == " ":
                    continue
                c = dict(c, c=" ")
            chars.append(c)
        if segment["page"] not in record["pages"]:
            record["pages"].append(segment["page"])
    while chars and chars[-1]["c"].isspace():
        chars.pop()
    text = "".join(c["c"] for c in chars)
    italics = ranges(chars, "italic")
    divine_names = []
    occurrences = Counter()
    for match in DIVINE.finditer(text):
        token = match.group()
        occurrences[token] += 1
        sizes = [c.get("font_size") for c in chars[match.start():match.end()]]
        if any(size is None for size in sizes):
            expected = None
        elif max(sizes) - min(sizes) < 0.1:
            expected = False
        elif sizes[0] > max(sizes[1:]) + 0.1 and max(sizes[1:]) - min(sizes[1:]) < 0.1:
            expected = True
        else:
            expected = None
        divine_names.append({"token": token, "occurrence_index": occurrences[token],
                             "char_start": match.start(), "char_end": match.end(),
                             "glyph_sizes": sizes, "smallcaps_expected": expected,
                             "typography_status": "ambiguous_requires_review" if expected is None else "native_font_size_evidence"})
    bracketed = text
    for r in reversed(italics):
        bracketed = bracketed[:r["start"]] + "[" + bracketed[r["start"]:r["end"]] + "]" + bracketed[r["end"]:]
    record.update(text=text, bracketed_text=bracketed, italic_ranges=italics,
                  smaller_cap_ranges=ranges(chars, "smaller_cap"),
                  paragraph_markers=pilcrows, line_wrap_joins=joins,
                  divine_names=divine_names,
                  extraction_status="source_derived_not_editorially_adjudicated")
    return record


def extract():
    assert sha256(SOURCE.read_bytes()).hexdigest() == SOURCE_SHA, "Witness changed; re-audit it"
    inventory_bytes = subprocess.check_output(
        ["git", "show", "4ef93ac:public/data/kjv_verses.json"], cwd=ROOT)
    assert sha256(inventory_bytes).hexdigest() == INVENTORY_SHA
    # Only identifiers/counts are used from this inventory, never its wording.
    expected = list(json.loads(inventory_bytes)["verses"])
    expected_keys = set(expected)
    last_verse = Counter()
    for key in expected:
        book, chapter, verse = key.split(".")
        last_verse[(book, int(chapter))] = max(last_verse[(book, int(chapter))], int(verse))
    doc = fitz.open(SOURCE)
    toc = doc.get_toc()[1:]
    assert len(toc) == len(CODES) == 66
    records, headings, colophons, anomalies, chapters = {}, [], [], [], []
    for bi, (entry, book) in enumerate(zip(toc, CODES)):
        start = entry[2]
        stop = toc[bi + 1][2] if bi + 1 < len(toc) else len(doc) + 1
        chapter = 1 if book in SINGLE else None
        verse, active, colophon = None, False, None
        if chapter:
            chapters.append((book, chapter))
        header_name = re.sub(r"[^A-Z0-9]", "", entry[1].upper())
        for physical in range(start, stop):
            for line in styled_lines(doc[physical - 1]):
                text, chars = line["text"], line["chars"]
                if line["max_size"] < 7 or line["max_size"] > 12 or line["bbox"][1] < 30:
                    continue
                match = CHAPTER.fullmatch(text)
                if match:
                    chapter = int(match[1]); verse = None; active = False; colophon = None
                    chapters.append((book, chapter))
                    continue
                if chapter is None:
                    continue
                compact = re.sub(r"[^A-Z0-9]", "", text)
                if text.upper() == text and compact in {header_name, "THE", "CALLED", "GENESIS", "JOHN", "PHILEMON", "JUDE", "OBADIAH"}:
                    continue
                if text.startswith("_") or text.startswith("THE END"):
                    active = False; colophon = None
                    continue
                if colophon is not None:
                    colophon["segments"].append({"page": physical, "chars": chars})
                    continue
                if verse is not None and verse == last_verse[(book, chapter)] and text.startswith("\u00b6") and re.search(r"\bwritten\b|^\u00b6\s+(?:The (?:first|second)|Unto|It was)", text, re.I):
                    colophon = {"book": book, "chapter": chapter, "after_verse": verse, "pages": [], "segments": [{"page": physical, "chars": chars}]}
                    colophons.append(colophon); active = False
                    continue
                if book == "Ps" and text.rstrip(".") in ACROSTICS:
                    headings.append({"book": book, "chapter": chapter, "kind": "acrostic_heading", "page": physical, "text": text})
                    continue
                if verse is None:
                    words = text.split()
                    first = words[0].strip(".,;:")
                    is_title = not first.isupper() or (first == "A" and len(words) > 1 and not words[1].isupper())
                    if is_title:
                        headings.append({"book": book, "chapter": chapter, "kind": "superscription", "page": physical, "text": text})
                        continue
                    verse = 1; active = True
                    key = f"{book}.{chapter}.{verse}"
                    assert key not in records, f"Duplicate verse start: {key}, p{physical}: {text!r}"
                    records[key] = {"reference": key, "pages": [], "segments": []}
                cursor = 0
                for marker in NUMBER.finditer(text):
                    if active:
                        add_segment(records[f"{book}.{chapter}.{verse}"], chars[cursor:marker.start()], physical)
                    following = int(marker[1])
                    if following != verse + 1:
                        anomalies.append({"page": physical, "book": book, "chapter": chapter, "previous": verse, "following": following, "line": text})
                    verse = following; active = True
                    key = f"{book}.{chapter}.{verse}"
                    assert key not in records, f"Duplicate verse start: {key}, p{physical}: {text!r}"
                    records[key] = {"reference": key, "pages": [], "segments": []}
                    cursor = marker.end()
                if active:
                    add_segment(records[f"{book}.{chapter}.{verse}"], chars[cursor:], physical)
    assert set(records) == expected_keys, {"missing": sorted(expected_keys - set(records)), "extra": sorted(set(records) - expected_keys)}
    assert len(records) == 31102 and len(set(chapters)) == 1189
    assert not anomalies, anomalies
    verses = [finish(record) for record in records.values()]
    assert [v["reference"] for v in verses] == expected, "Verse order differs from identifier inventory"
    complete_colophons = [finish(c) for c in colophons]
    by_key = {v["reference"]: v for v in verses}
    assert by_key["Exod.14.31"]["pages"] == [40, 41]
    assert by_key["2Sam.13.39"]["text"].startswith("And the soul of king David")
    assert "A Psalm" not in by_key["Ps.3.1"]["text"]
    assert sum(h["kind"] == "acrostic_heading" for h in headings) == 22
    for key in ["Phil.4.23", "1Thess.5.28", "Heb.13.25", "Rev.22.21"]:
        assert by_key[key]["text"].endswith("Amen.")
        assert any(r["text"] == "be" for r in by_key[key]["italic_ranges"]), key
        assert "written" not in by_key[key]["text"].lower(), key
    assert len(complete_colophons) == 14, [c["book"] for c in complete_colophons]
    assert all(v["text"] and "\ufffd" not in v["text"] for v in verses)
    assert by_key["Acts.17.23"]["divine_names"][0]["smallcaps_expected"] is False
    assert by_key["Gen.2.4"]["divine_names"][0]["smallcaps_expected"] is True
    assert by_key["Gen.15.2"]["divine_names"][0]["smallcaps_expected"] is True
    for key, phrase in [("Judg.11.29","LORD came"),("1Sam.23.10","LORD God"),
                        ("1Kgs.18.21","LORD be"),("2Kgs.14.6","LORD commanded")]:
        assert phrase in by_key[key]["text"], (key,by_key[key]["text"])
    for verse_record in verses:
        for item in verse_record["divine_names"]:
            assert verse_record["text"][item["char_start"]:item["char_end"]] == item["token"]
            assert len(item["glyph_sizes"]) == len(item["token"])
        for item in verse_record["italic_ranges"]:
            assert 0 <= item["start"] < item["end"] <= len(verse_record["text"])
    metadata = {
        "version": "0.2.0", "purpose": "Local witness comparison evidence for PDF repair; never an automatic canonical corpus replacement",
        "source": {"path": str(SOURCE), "sha256": SOURCE_SHA, "pages": len(doc), "metadata": doc.metadata},
        "inventory_check": {"comparison_commit": "4ef93ac", "comparison_sha256": INVENTORY_SHA, "use": "Identifier sequence/counts only; no comparison wording imported", "verse_count": len(verses), "chapter_count": len(set(chapters)), "missing_keys": [], "extra_keys": [], "numbering_anomalies": anomalies},
        "offset_contract": "Zero-based Python Unicode code-point offsets; end exclusive; offsets address each entry's plain text before supplied-word brackets. Divine-name occurrence_index is one-based separately for each exact token within the verse.",
        "normalizations": ["Native Unicode characters retained", "Whitespace collapsed and line wraps joined", "Real positioning-only word gaps at font transitions retained when adjacent letters have a native gap above max(0.8pt,12% of smaller font size); no letters inferred", "Printed trailing hyphens retained and joined to next line", "Verse-number labels excluded", "Pilcrow paragraph marks retained as offset metadata rather than Scripture characters", "Superscriptions, acrostic headings and book-end colophons stored separately", "bracketed_text derives brackets from explicit italic font spans; source PDF contains typographic italics"],
        "uncertainties": ["A complete identifier inventory does not establish textual or doctrinal correctness", "All entries remain source-derived and editorially unadjudicated", "Printed hyphens at line breaks are preserved; lexical hyphenation has not been independently adjudicated", "Capitalized chapter-opening words are preserved as printed; casing is not automatically conformed to another witness", "Superscription recognition uses chapter-opening typography and text; separate heading records require review", "An italic font span is typographic evidence, not an independent editorial endorsement of supplied-word boundaries"],
        "verification": {"all_31102_identifiers_in_order": True, "all_1189_chapters": True, "midline_verse_boundaries": ["Exod.14.31", "2Sam.13.39"], "four_final_verses_and_italic_be": True, "psalm_3_superscription_separate": True, "psalm_119_acrostic_headings": 22, "book_end_colophons_separate": len(complete_colophons), "replacement_unicode_characters": 0, "all_italic_and_divine_name_offsets_valid": True, "ordinary_allcaps_Acts_17_23_GOD_preserved": True, "source_smallcaps_Gen_2_4_LORD_and_Gen_15_2_GOD": True},
        "headings": headings, "colophons": complete_colophons,
    }
    for verse in verses:
        verse["italic_evidence"] = verse["italic_ranges"]
        verse["italic_ranges"] = [[r["start"], r["end"]] for r in verse["italic_evidence"]]
        verse["status"] = verse.pop("extraction_status")
    return {"meta": metadata, "verses": {v["reference"]: v for v in verses}}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=OUTPUT)
    args = parser.parse_args()
    result = extract()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    assert json.loads(args.output.read_text(encoding="utf-8")) == result
    print(json.dumps({"output": str(args.output), "verses": len(result["verses"]), "headings": len(result["meta"]["headings"]), "colophons": len(result["meta"]["colophons"]), "verification": result["meta"]["verification"]}))
