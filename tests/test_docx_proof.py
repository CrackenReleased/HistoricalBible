"""Executable regression gate for the separately versioned DOCX proof.

Set BIBLE_PROOF_UNDER_TEST to the original master to reproduce the old defects.
"""
import os
from pathlib import Path
import re
import sys
import unittest
import zipfile
from hashlib import sha256

from lxml import etree as E

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from extract_kjv_witness import CODES

SOURCE = ROOT / "TacticalCastle/HistoricalBible/Bible.docx"
CANDIDATE = ROOT / "pdf-proof/v0.2.0/Bible-proof-v0.2.0.docx"
TARGET = Path(os.environ.get("BIBLE_PROOF_UNDER_TEST", CANDIDATE))
NS = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
FURNITURE = re.compile(r"\b(?:(?:Exodus|Numbers|1\s+Kings|Esther|Job|Micah)\s+Page\s+\d+|Page\s+\d+\s+(?:Exodus|Numbers|1\s+Kings|Esther|Job|Micah))\b")


def load(path):
    with zipfile.ZipFile(path) as z:
        return E.fromstring(z.read("word/document.xml"))


def text(p):
    return "".join(p.xpath(".//w:t/text()", namespaces=NS))


def inventory(root):
    result, index = [], -1
    for p in root.findall(".//w:body/w:p", NS):
        t = text(p)
        m = re.match(r"\{(\d+):(\d+)\}", t)
        if m:
            if m.groups() == ("1", "1"):
                index += 1
            result.append((f"{CODES[index]}.{m[1]}.{m[2]}", p))
    assert index == 65
    return result


class DocxProofTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.root = load(TARGET)
        cls.entries = inventory(cls.root)
        cls.verses = {k: text(p) for k, p in cls.entries}

    def test_complete_unique_verse_inventory(self):
        self.assertEqual(len(self.entries), 31102)
        self.assertEqual(len(self.verses), 31102)
        for key in ["Phil.4.23", "1Thess.5.28", "Heb.13.25", "Rev.22.21"]:
            self.assertIn(key, self.verses)

    def test_duplicate_class_removed(self):
        for key in ["Exod.16.1", "Exod.16.2"]:
            self.assertEqual(sum(k == key for k, _ in self.entries), 1)

    def test_corroborated_omissions_and_typo_preserve_owner_brackets(self):
        for ref, required in [("Num.10.17", "bearing the tabernacle."),
                              ("Deut.22.10", "an ass together."),
                              ("Gen.21.17", "called to Hagar"),
                              ("Gen.50.23", "son of Manasseh"),
                              ("Lev.17.8", "offering or sacrifice")]:
            self.assertIn(required, self.verses[ref])
        self.assertIn("[there be]", self.verses["Lev.17.8"])
        self.assertIn("[generation:]", self.verses["Gen.50.23"])
        self.assertIn("[is.]", self.verses["Gen.21.17"])

    def test_embedded_furniture_and_appended_title_removed(self):
        self.assertFalse(FURNITURE.search(" ".join(self.verses.values())))
        self.assertNotIn("Second Epistle", self.verses["2John.1.13"])

    def test_repeated_clauses_and_case_sensitive_names(self):
        self.assertEqual(self.verses['1Chr.11.2'].count('and thou shalt be ruler over my people Israel'), 1)
        self.assertEqual(self.verses['Ezek.17.24'].count('I the LORD have brought down the high tree'), 1)
        for key, value in [('1Chr.9.20', 'the LORD [was]'), ('Ps.68.20', 'unto GOD the Lord'),
                           ('Isa.3.15', 'the Lord GOD'), ('Amos.9.1', 'I saw the Lord'),
                           ('Mark.12.36', 'The LORD said')]:
            self.assertIn(value, self.verses[key])
        self.assertIn('Caesar', self.verses['Luke.2.1'])

    def test_witness_gap_and_ligature_variants_cannot_change_words(self):
        from proof_bible_docx import lexical_proposal
        self.assertEqual(lexical_proposal('Caesar', 'Cæsar', 'Cæsar'), ([], 'same_lexical_tokens'))
        import json
        witness = json.loads((ROOT / 'pdf-proof/v0.2.0/reference-verses.json').read_text(encoding='utf8'))['verses']
        for key, phrase in [('Judg.11.29','LORD came'), ('1Sam.23.10','LORD God'),
                            ('1Kgs.18.21','LORD be'), ('2Kgs.14.6','LORD commanded')]:
            self.assertIn(phrase, witness[key]['text'])

    def test_reference_specific_smallcaps(self):
        def token_sizes(key, token):
            p = next(p for k, p in self.entries if k == key)
            full, sizes = "", []
            for run in p.xpath(".//w:r", namespaces=NS):
                value = "".join(run.xpath("./w:t/text()", namespaces=NS))
                sz = run.find("w:rPr/w:sz", NS)
                full += value
                sizes.extend([int(sz.get("{" + NS["w"] + "}val")) if sz is not None else None] * len(value))
            at = full.index(token)
            return sizes[at:at + len(token)]
        self.assertEqual(token_sizes("Gen.2.4", "LORD"), [20, 16, 16, 16])
        self.assertEqual(token_sizes("Gen.15.2", "GOD"), [20, 16, 16])
        self.assertEqual(token_sizes("Acts.17.23", "GOD"), [20, 20, 20])

    def test_original_and_all_other_parts_preserved(self):
        self.assertEqual(sha256(SOURCE.read_bytes()).hexdigest(), "dfc741290529d7e966fad46d53d23d92083c5fa74e8b41b070a790eb6fc6fa86")
        with zipfile.ZipFile(SOURCE) as a, zipfile.ZipFile(TARGET) as b:
            self.assertEqual(a.namelist(), b.namelist())
            self.assertEqual([name for name in a.namelist() if a.read(name) != b.read(name)], [] if TARGET == SOURCE else ["word/document.xml"])
        original = load(SOURCE)
        for tag, expected in [("bookmarkStart", 145), ("hyperlink", 66), ("sectPr", 8)]:
            old = original.findall(".//w:" + tag, NS)
            new = self.root.findall(".//w:" + tag, NS)
            self.assertEqual(len(new), expected)
            self.assertEqual([E.tostring(n) for n in new], [E.tostring(n) for n in old])


if __name__ == "__main__":
    unittest.main()
