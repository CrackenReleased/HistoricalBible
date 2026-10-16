"""Create an explicitly separate OOXML Bible proof; never modify its master.

Only word/document.xml is edited. Lexical proposals are held unless explicitly
enabled; a local AV1611 reading and historical imported reading must agree.
"""
from __future__ import annotations

import argparse
from collections import Counter
from copy import deepcopy
from difflib import SequenceMatcher
from hashlib import sha256
import json
from pathlib import Path
import re
import subprocess
import zipfile

from lxml import etree as E

from extract_kjv_witness import CODES

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "TacticalCastle/HistoricalBible/Bible.docx"
REFERENCE = ROOT / "pdf-proof/v0.2.0/reference-verses.json"
OUTPUT = ROOT / "pdf-proof/v0.2.0/Bible-proof-v0.2.0.docx"
MANIFEST = ROOT / "pdf-proof/v0.2.0/repair-manifest-docx.json"
SOURCE_SHA = "dfc741290529d7e966fad46d53d23d92083c5fa74e8b41b070a790eb6fc6fa86"
W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
NS = {"w": W}
SPACE = "{http://www.w3.org/XML/1998/namespace}space"
MARK = re.compile(r"^\{(\d+):(\d+)\}")
WORD = re.compile(r"[^\W\d_]+(?:['\u2019][^\W\d_]+)?|\d+", re.UNICODE)
NAME = re.compile(r"(?<![A-Za-z])(?:LORD|GOD)(?![A-Za-z])")
FURNITURE = re.compile(r"\b(?:(?:Exodus|Numbers|1\s+Kings|Esther|Job|Micah)\s+Page\s+\d+|Page\s+\d+\s+(?:Exodus|Numbers|1\s+Kings|Esther|Job|Micah))\b")
MISSING = ["Phil.4.23", "1Thess.5.28", "Heb.13.25", "Rev.22.21"]


def text(p):
    return "".join(p.xpath(".//w:t/text()", namespaces=NS))


def norm(s):
    return re.sub(r"\s+", " ", s).strip()


def inventory(root):
    result, book = [], -1
    for p in root.findall(".//w:body/w:p", NS):
        match = MARK.match(text(p))
        if not match:
            continue
        if match.groups() == ("1", "1"):
            book += 1
        assert 0 <= book < 66
        result.append((f"{CODES[book]}.{match[1]}.{match[2]}", p))
    assert book == 65
    return result


def splice(p, start, end, replacement):
    """Replace exact text offsets without flattening runs or inline anchors."""
    nodes = p.xpath(".//w:t", namespaces=NS)
    offset, inserted = 0, False
    for node in nodes:
        value = node.text or ""
        limit = offset + len(value)
        if start == end and not inserted and offset <= start <= limit:
            at = start - offset
            node.text = value[:at] + replacement + value[at:]
            node.set(SPACE, "preserve"); inserted = True
        elif start < limit and end > offset:
            a, b = max(0, start - offset), min(len(value), end - offset)
            node.text = value[:a] + (replacement if not inserted else "") + value[b:]
            node.set(SPACE, "preserve"); inserted = True
        offset = limit
    assert inserted, (start, end, replacement)


def signatures(root, tag):
    return [E.tostring(n) for n in root.findall(".//w:" + tag, NS)]


def lexical_proposal(body, witness, imported):
    source = list(WORD.finditer(body)); target = list(WORD.finditer(witness))
    key = lambda m: m.group().casefold().replace("\u2019", "'").replace("æ", "ae")
    a, b = list(map(key, source)), list(map(key, target))
    if a == b:
        return [], "same_lexical_tokens"
    if "".join(a) == "".join(b):
        return [], "hyphenation_or_word_boundary_variant"
    old = [key(m) for m in WORD.finditer(imported)]
    if old != b:
        return [], "comparison_witnesses_do_not_fully_agree"
    operations = [op for op in SequenceMatcher(None, a, b, autojunk=False).get_opcodes() if op[0] != "equal"]
    weight = sum(i2 - i1 + j2 - j1 for _, i1, i2, j1, j2 in operations)
    if len(operations) > 2 or weight > 4 or weight > max(3, len(a) * .35):
        return [], "larger_or_complex_lexical_difference"
    edits = []
    for kind, i1, i2, j1, j2 in operations:
        before = " ".join(a[i1:i2]); after = " ".join(b[j1:j2])
        if before.replace("enquir", "inquir") == after.replace("enquir", "inquir"):
            return [], "legitimate_enquire_inquire_spelling_variant"
        start = source[i1].start() if i1 < len(source) else source[-1].end()
        end = source[i2 - 1].end() if i2 > i1 else start
        if any(c in body[start:end] for c in "[]"):
            return [], "edit_crosses_owner_supplied_word_markers"
        if kind == "delete" and ((start and body[start - 1] == "[") or body[end:end + 1] == "]"):
            return [], "deletion_would_empty_supplied_word_markers"
        if kind == "delete":
            while end < len(body) and body[end].isspace():
                end += 1
        replacement = witness[target[j1].start():target[j2 - 1].end()] if j2 > j1 else ""
        replacement = replacement.replace("\u2019", "'")
        if kind == "insert":
            if i1 == len(source):
                replacement = " " + replacement
                if not body[end:].strip() and target[j2 - 1].end() == len(witness.rstrip(".,;:!?")):
                    replacement += witness[target[j2 - 1].end():]
            else:
                replacement += " "
        edits.append((start, end, replacement))
    return edits, "short_lexical_delta_corroborated_by_two_local_witnesses"


def format_names(p, witness):
    full = text(p); match = MARK.match(full); base = match.end()
    body = full[base:]
    occurrences = list(NAME.finditer(body))
    source_counts = Counter(m.group() for m in occurrences)
    # A chapter-opening GOD printed at full height is display capitalization,
    # not a small-cap divine-name rendering. Keep the owner's ordinary God.
    witness = dict(witness, divine_names=[d for d in witness["divine_names"]
                   if not (d["token"] == "GOD" and d["smallcaps_expected"] is False
                           and source_counts["GOD"] == 0)])
    expected_counts = Counter(d["token"] for d in witness["divine_names"])
    expected = {(d["token"], d["occurrence_index"]): d for d in witness["divine_names"]}
    flags, seen, issues, changed = {}, Counter(), [], []
    for m in occurrences:
        token = m.group(); seen[token] += 1
        d = expected.get((token, seen[token]))
        if source_counts[token] != expected_counts[token] or d is None or d["smallcaps_expected"] is None:
            issues.append({"token": token, "occurrence": seen[token], "reason": "ambiguous_or_unmatched_source_occurrence"})
            continue
        for i in range(m.start(), m.end()):
            flags[base + i] = 16 if d["smallcaps_expected"] and i > m.start() else 20
        changed.append({"token": token, "occurrence": seen[token], "smallcaps_expected": d["smallcaps_expected"], "reference_glyph_sizes": d["glyph_sizes"]})
    for token in expected_counts:
        if expected_counts[token] != source_counts[token]:
            issues.append({"token": token, "reason": "casing_or_occurrence_count_differs_from_reference", "source_count": source_counts[token], "reference_count": expected_counts[token]})
    offset = 0
    node_offsets = {}
    for node in p.xpath(".//w:t", namespaces=NS):
        node_offsets[node] = offset; offset += len(node.text or "")
    for run in list(p.xpath(".//w:r", namespaces=NS)):
        if not any(any(node_offsets[t] + i in flags for i in range(len(t.text or ""))) for t in run.findall("w:t", NS)):
            continue
        replacements = []
        properties = run.find("w:rPr", NS)
        def new_run(size=None):
            fresh = E.Element(run.tag, dict(run.attrib))
            prop = deepcopy(properties) if properties is not None else E.Element("{" + W + "}rPr")
            if size is not None:
                for tag in ["sz", "szCs", "smallCaps", "caps"]:
                    for old in prop.findall("w:" + tag, NS):
                        prop.remove(old)
                for tag in ["sz", "szCs"]:
                    E.SubElement(prop, "{" + W + "}" + tag).set("{" + W + "}val", str(size))
            if len(prop):
                fresh.append(prop)
            return fresh
        for child in run:
            if child.tag == "{" + W + "}rPr":
                continue
            if child.tag != "{" + W + "}t":
                fresh = new_run(); fresh.append(deepcopy(child)); replacements.append(fresh)
                continue
            value = child.text or ""; start = node_offsets[child]; i = 0
            while i < len(value):
                size = flags.get(start + i); j = i + 1
                while j < len(value) and flags.get(start + j) == size:
                    j += 1
                fresh = new_run(size); node = deepcopy(child); node.text = value[i:j]; node.set(SPACE, "preserve")
                fresh.append(node); replacements.append(fresh); i = j
        parent = run.getparent(); at = parent.index(run); parent.remove(run)
        for i, replacement in enumerate(replacements):
            parent.insert(at + i, replacement)
    assert text(p) == full, "Typography modified source characters"
    return changed, issues


def build(apply_lexical=False):
    assert sha256(SOURCE.read_bytes()).hexdigest() == SOURCE_SHA
    refs = json.loads(REFERENCE.read_text(encoding="utf8"))["verses"]
    raw_import = subprocess.check_output(["git", "show", "4ef93ac:public/data/kjv_verses.json"], cwd=ROOT)
    assert sha256(raw_import).hexdigest() == "04eaa83915daf5b8bde0bfb8877104d726a1388a8f46583c24ae133eba7d43d8"
    imported = json.loads(raw_import)["verses"]
    with zipfile.ZipFile(SOURCE) as original:
        root = E.fromstring(original.read("word/document.xml"))
        original_signatures = {tag: signatures(root, tag) for tag in ["bookmarkStart", "bookmarkEnd", "hyperlink", "sectPr"]}
        changes, pending, typographic, typography_issues = [], [], [], []
        seen = {}
        for ref, p in inventory(root):
            if ref in seen:
                assert ref in {"Exod.16.1", "Exod.16.2"} and norm(text(p)) == norm(text(seen[ref]))
                assert not p.xpath(".//w:sectPr|.//w:bookmarkStart|.//w:bookmarkEnd|.//w:hyperlink", namespaces=NS)
                changes.append({"kind": "remove_duplicate_verse_paragraph", "reference": ref, "before": text(p), "after": ""})
                p.getparent().remove(p)
            else:
                seen[ref] = p
        furniture_count = 0
        for ref, p in inventory(root):
            before = text(p)
            for m in reversed(list(FURNITURE.finditer(before))):
                splice(p, m.start(), m.end(), ""); furniture_count += 1
            if before != text(p):
                changes.append({"kind": "remove_embedded_page_furniture", "reference": ref, "before": before, "after": text(p)})
            if ref == "2John.1.13":
                suffix = re.search(r"(?<=Amen\.)\s*The Second Epistle of John\s*$", text(p))
                if suffix:
                    before = text(p); splice(p, suffix.start(), suffix.end(), "")
                    changes.append({"kind": "remove_appended_duplicate_title", "reference": ref, "before": before, "after": text(p)})
        assert furniture_count == 25, furniture_count
        paragraphs = dict(inventory(root))
        for ref in MISSING:
            assert ref not in paragraphs
            book, chapter, verse = ref.split("."); previous = paragraphs[f"{book}.{chapter}.{int(verse) - 1}"]
            fresh = deepcopy(previous)
            for child in list(fresh):
                if child.tag != "{" + W + "}pPr":
                    fresh.remove(child)
            for tag in fresh.xpath(".//w:sectPr", namespaces=NS):
                tag.getparent().remove(tag)
            for attr in list(fresh.attrib):
                if attr.endswith("}paraId") or attr.endswith("}textId"):
                    del fresh.attrib[attr]
            run = E.SubElement(fresh, "{" + W + "}r")
            old_style = previous.find("w:r/w:rPr", NS)
            if old_style is not None:
                run.append(deepcopy(old_style))
            t = E.SubElement(run, "{" + W + "}t"); t.text = f"{{{chapter}:{verse}}} " + refs[ref]["bracketed_text"]
            previous.addnext(fresh)
            changes.append({"kind": "restore_missing_ending", "reference": ref, "before": "", "after": text(fresh), "source_pages": refs[ref]["pages"], "review_status": "pending_owner_review"})
        # Reviewed exceptional repairs: these are exact duplicated clauses and
        # case-sensitive divine-name readings, not automatic case normalization.
        repeated = {
            "1Chr.11.2": ", and thou shalt be ruler over my people Israel",
            "Ezek.17.24": " I the LORD have brought down the high tree, have exalted the low tree, have dried up the green tree, and have made the dry tree to flourish:",
        }
        cases = {
            "1Chr.9.20": ("the Lord [was]", "the LORD [was]"),
            "1Chr.9.23": ("of the Lord,", "of the LORD,"),
            "Ps.7.1": ("O Lord my God", "O LORD my God"),
            "Ps.68.20": ("unto God the Lord", "unto GOD the Lord"),
            "Ps.106.48": ("the Lord God", "the LORD God"),
            "Isa.3.15": ("the LORD GOD", "the Lord GOD"),
            "Isa.3.17": ("Therefore the LORD", "Therefore the Lord"),
            "Amos.9.1": ("I saw the LORD", "I saw the Lord"),
            "Zech.4.14": ("by the LORD of", "by the Lord of"),
            "Zech.9.14": ("the LORD GOD", "the Lord GOD"),
            "Mal.1.14": ("unto the LORD a", "unto the Lord a"),
            "Mark.12.36": ("The Lord said", "The LORD said"),
        }
        if apply_lexical:
            paragraphs = dict(inventory(root))
            for ref, clause in repeated.items():
                p=paragraphs[ref]; before=text(p)
                assert before.count(clause)==2, (ref,before)
                at=before.rfind(clause); splice(p,at,at+len(clause),"")
                changes.append({"kind":"remove_repeated_clause","reference":ref,"before":before,"after":text(p),"source_pages":refs[ref]["pages"],"review_status":"pending_owner_review"})
            for ref,(old,new) in cases.items():
                p=paragraphs[ref];before=text(p);assert before.count(old)==1,(ref,old)
                at=before.index(old);splice(p,at,at+len(old),new)
                changes.append({"kind":"correct_divine_name_case","reference":ref,"before":before,"after":text(p),"source_pages":refs[ref]["pages"],"review_status":"pending_owner_review"})
        for ref, p in inventory(root):
            before = text(p); marker = MARK.match(before); base = marker.end()
            edits, reason = lexical_proposal(before[base:], refs[ref]["text"], imported[ref])
            if reason != "same_lexical_tokens":
                record = {"reference": ref, "before": before, "reference_text": refs[ref]["text"], "source_pages": refs[ref]["pages"], "classification": reason, "review_status": "pending_owner_review"}
                if edits and apply_lexical:
                    for a, b, value in reversed(edits):
                        splice(p, base + a, base + b, value)
                    record.update(kind="corroborated_short_lexical_delta", after=text(p)); changes.append(record)
                else:
                    record["proposed_splices"] = edits; pending.append(record)
            names, issues = format_names(p, refs[ref])
            if names:
                typographic.append({"reference": ref, "source_pages": refs[ref]["pages"], "occurrences": names})
            if issues:
                typography_issues.append({"reference": ref, "issues": issues})
        entries = inventory(root)
        assert [ref for ref, p in entries] == list(refs), "Final verse identifiers/order differ"
        for tag, before in original_signatures.items():
            assert signatures(root, tag) == before, f"Navigation/layout changed: {tag}"
        xml = E.tostring(root, encoding="UTF-8", xml_declaration=True, standalone=True)
        OUTPUT.parent.mkdir(parents=True, exist_ok=True)
        with zipfile.ZipFile(OUTPUT, "w") as out:
            for info in original.infolist():
                out.writestr(info, xml if info.filename == "word/document.xml" else original.read(info.filename))
    with zipfile.ZipFile(SOURCE) as a, zipfile.ZipFile(OUTPUT) as b:
        assert a.namelist() == b.namelist()
        changed_parts = [name for name in a.namelist() if a.read(name) != b.read(name)]
        assert changed_parts == ["word/document.xml"]
    assert sha256(SOURCE.read_bytes()).hexdigest() == SOURCE_SHA
    result = {"version": "0.2.0", "source": str(SOURCE), "source_sha256": SOURCE_SHA,
              "reference_artifact": str(REFERENCE), "reference_artifact_sha256": sha256(REFERENCE.read_bytes()).hexdigest(),
              "comparison_commit": "4ef93ac", "comparison_sha256": sha256(raw_import).hexdigest(),
              "output": str(OUTPUT), "output_sha256": sha256(OUTPUT.read_bytes()).hexdigest(),
              "scope": "Separate owner-review proof; not a canonical/source/site replacement",
              "lexical_edits_enabled": apply_lexical, "changed_zip_parts": changed_parts,
              "counts": {"verses": len(entries), "furniture_strings_removed": furniture_count, "changes": dict(Counter(c["kind"] for c in changes)), "pending_lexical_rows": len(pending), "name_occurrences_styled": sum(len(t["occurrences"]) for t in typographic), "typography_issue_verses": len(typography_issues)},
              "changes": changes, "pending_wording_review": pending, "typography": typographic,
              "typography_issues": typography_issues,
              "verification": {"master_hash_unchanged": True, "only_document_xml_payload_changed": True, "verse_keys_ordered_and_complete": True, "bookmarks_hyperlinks_sections_identical": True, "visual_native_word_export": "pending_root_verification"}}
    recovered = OUTPUT.parent / "recovered-book-sources.json"
    if recovered.exists():
        result["recovered_owner_source_inventory"] = {"path": str(recovered), "sha256": sha256(recovered.read_bytes()).hexdigest(), "role": "Owner-source provenance audit; not an alternative automatic replacement corpus"}
    MANIFEST.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf8")
    print(json.dumps({"output": str(OUTPUT), "manifest": str(MANIFEST), "counts": result["counts"]}))
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--apply-corroborated-lexical", action="store_true", help="Explicitly enable narrowly corroborated lexical proposals")
    args = parser.parse_args()
    build(args.apply_corroborated_lexical)
