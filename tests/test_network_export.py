"""Focused checks for the actual source snapshot consumed by Interact.

Run: python -m unittest discover -s tests -p test_network_export.py
No source files or Scripture are modified.
"""
import csv
import hashlib
import importlib.util
import io
import json
from pathlib import Path
import re
import unittest
from unittest.mock import Mock, patch
import zipfile

ROOT = Path(__file__).resolve().parents[1]
VAULT = Path(r"E:\AI_Hub\Vault\Bible")
ARCHIVE = Path(r"E:\AI_Hub\Tools\bible-network\sources\cross-references.zip")
SPEC = importlib.util.spec_from_file_location("crossref_builder", ROOT / "scripts/build-crossref-data.py")
BUILDER = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(BUILDER)


class CrossrefUnitTests(unittest.TestCase):
    def test_default_threshold_and_all_votes_preserve_range(self):
        source = "From Verse\tTo Verse\tVotes\nGen.1.1\tJohn.1.1-John.1.3\t-2\nGen.1.2\tPs.1.1\t0\n"
        links, _ = BUILDER.process_tsv(io.StringIO(source))
        self.assertEqual(len(links), 1)
        links, meta = BUILDER.process_tsv(io.StringIO(source), all_votes=True)
        self.assertEqual(links[0], {"s": "Gen.1.1", "t": "John.1.1", "r": "John.1.1-John.1.3", "v": -2})
        self.assertEqual(meta["negative_vote_records"], 1)
        self.assertIsNone(meta["min_votes"])

    def test_threshold_boundary_and_cross_testament_counts(self):
        rows = "From Verse\tTo Verse\tVotes\nGen.1.1\tJohn.1.1-John.1.3\t2\nJohn.1.1\tGen.1.1\t3\nGen.1.1\tPs.1.1\t4\nGen.1.2\tPs.1.1\t1\n"
        links, meta = BUILDER.process_tsv(io.StringIO(rows), min_votes=2)
        self.assertEqual([link["v"] for link in links], [2, 3, 4])
        self.assertEqual(links[0]["r"], "John.1.1-John.1.3")
        self.assertEqual(meta["source_verses_count"], 2)
        self.assertEqual(meta["target_verses_count"], 3)
        self.assertEqual(meta["inter_testament_links"], 2)
        self.assertEqual(meta["total_links"], 3)

    def test_empty_header_only_and_truncated_rows(self):
        for source in ("", "From Verse\tTo Verse\tVotes\n", "From Verse\tTo Verse\tVotes\nGen.1.1\nGen.1.1\tJohn.1.1\n"):
            with self.subTest(source=source):
                links, meta = BUILDER.process_tsv(io.StringIO(source))
                self.assertEqual(links, [])
                for field in ("total_links", "source_verses_count", "target_verses_count", "inter_testament_links"):
                    self.assertEqual(meta[field], 0)

    def test_personal_notes_and_missing_ownership_are_rejected(self):
        for content in ("Personal study", "---\ntitle: Jonah\n---\nMy notes", '---\ngenerator: "someone-else"\n---', '---\ngenerator: "historicalbible-obsidian"'):
            with self.subTest(content=content):
                note = Mock(spec=Path)
                note.read_text.return_value = content
                with self.assertRaisesRegex(ValueError, "Not an owned generated note"):
                    BUILDER.generated_note(note)

    def test_generated_note_retains_text_and_requests_bom_safe_decoding(self):
        for newline in ("\n", "\r\n"):
            content = newline.join(('---', 'generator: "historicalbible-obsidian"', '---', 'Original study text'))
            note = Mock(spec=Path)
            note.read_text.return_value = content
            self.assertEqual(BUILDER.generated_note(note), content)
            note.read_text.assert_called_once_with(encoding="utf-8-sig")


class NetworkValidationUnitTests(unittest.TestCase):
    def export_fixture(self, change=None):
        # Simulate owned vault notes in memory; the exporter never touches a real vault.
        vault = ROOT / 'test-results' / 'virtual-vault'
        corpus = json.loads((ROOT / 'public/data/kjv_verses.json').read_text(encoding='utf-8'))
        books = list(dict.fromkeys(verse['book'] for verse in corpus))
        owner = '---\ngenerator: "historicalbible-obsidian"\n'
        verse = '[[Bible/Verses/Genesis/Genesis 001-001|Genesis 1:1]]'
        def note(name, target):
            return (owner + f'title: "{name}"\nverse_count: 1\nconnection_count: 1\n---\n'
                    + verse + f'\n| [[Bible/Names/{target}|{target}]] | 1 |\n')
        files = {vault / 'Books' / f'{book}.md': owner + '---\n' +
                 f'[[Bible/Verses/{book}/{book} 001-001|{book} 1:1]]' for book in books}
        files[vault / 'Names/Adam.md'] = note('Adam', 'Eve')
        files[vault / 'Names/Eve.md'] = note('Eve', 'Adam')
        if change:
            path = vault / 'Names/Adam.md'
            files[path] = change(files[path])
        original_text, original_bytes = Path.read_text, Path.read_bytes
        output = Mock(spec=Path)
        output.parent = Mock(spec=Path)
        def read_text(path, *args, **kwargs):
            return files[path] if path in files else original_text(path, *args, **kwargs)
        def read_bytes(path, *args, **kwargs):
            return files[path].encode() if path in files else original_bytes(path, *args, **kwargs)
        with patch.object(Path, 'glob', lambda path, pattern: (p for p in files if p.parent == path)), \
             patch.object(Path, 'read_text', read_text), patch.object(Path, 'read_bytes', read_bytes):
            try:
                result = BUILDER.export_network(vault, {'total_links': 0}, output)
            except ValueError:
                output.write_bytes.assert_not_called()
                output.parent.mkdir.assert_not_called()
                raise
        output.write_bytes.assert_called_once()
        return result

    def test_valid_reciprocal_edges_export_once_without_scripture_text(self):
        result = self.export_fixture()
        self.assertEqual(result['edges'], [[0, 1, 1]])
        self.assertEqual([name['name'] for name in result['names']], ['Adam', 'Eve'])
        self.assertTrue(all(name['refs'] == ['Gen.1.1'] for name in result['names']))
        self.assertTrue(all('text' not in name for name in result['names']))

    def test_invalid_notes_are_rejected_before_output_is_written(self):
        cases = [
            ('Duplicate verse links', lambda t: t + '[[Bible/Verses/Genesis/Genesis 001-001|Genesis 1:1]]'),
            ('verse_count mismatch', lambda t: t.replace('verse_count: 1', 'verse_count: 2')),
            ('connection_count mismatch', lambda t: t.replace('connection_count: 1', 'connection_count: 2')),
            ('unknown snapshot verses', lambda t: t.replace('Genesis 001-001', 'Genesis 001-002')),
            ('Duplicate, self, or nonpositive', lambda t: t.replace('Names/Eve|Eve', 'Names/Adam|Adam')),
            ('Duplicate, self, or nonpositive', lambda t: t.replace('connection_count: 1', 'connection_count: 2') + '| [[Bible/Names/Eve|Eve]] | 1 |\n'),
            ('Missing or inconsistent reciprocal', lambda t: t.replace(']] | 1 |', ']] | 2 |')),
            ('Missing or inconsistent reciprocal', lambda t: t.replace('Names/Eve|Eve', 'Names/Unknown|Unknown')),
        ]
        for message, change in cases:
            with self.subTest(message=message), self.assertRaisesRegex(ValueError, message):
                self.export_fixture(change)


class NetworkExportTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.network = json.loads((ROOT / "public/data/bible_network.json").read_text(encoding="utf-8"))
        cls.bundle = json.loads((ROOT / "public/data/cross_references_bundle.json").read_text(encoding="utf-8"))

    def test_full_bundle_matches_every_original_source_record(self):
        self.assertTrue(ARCHIVE.is_file(), "Actual Obsidian source archive required")
        with zipfile.ZipFile(ARCHIVE) as archive:
            rows = list(csv.DictReader(io.StringIO(archive.read("cross_references.txt").decode("utf-8-sig")), delimiter="\t"))
        expected = [(r["From Verse"], r["To Verse"].split("-")[0].strip(), r["To Verse"], int(r["Votes"])) for r in rows]
        actual = [(r["s"], r["t"], r["r"], r["v"]) for r in self.bundle["links"]]
        self.assertEqual(actual, expected)
        self.assertEqual(len(actual), 344799)
        self.assertEqual(sum(r[3] < 0 for r in actual), 1229)
        self.assertEqual(len(set((r[0], r[2]) for r in actual)), len(actual))
        self.assertEqual(self.bundle["meta"]["source_sha256"], hashlib.sha256(ARCHIVE.read_bytes()).hexdigest())
        self.assertLess((ROOT / "public/data/cross_references_bundle.json").stat().st_size, 25 * 1024 * 1024)

    def test_exported_names_and_edges_match_existing_vault_notes(self):
        network = self.network
        self.assertEqual(len(network["names"]), 2408)
        self.assertEqual(len(network["edges"]), 12058)
        self.assertEqual(network["meta"]["sourceVerseCount"], 31102)
        self.assertEqual(network["meta"]["siteVerseCount"], 31102)
        self.assertEqual(network["meta"]["crossReferences"], 344799)
        self.assertEqual(network["meta"]["sourceCrossReferencesSha256"], self.bundle["meta"]["source_sha256"])
        self.assertEqual([n["name"] for n in network["names"]], sorted(p.stem for p in (VAULT / "Names").glob("*.md")))
        indexes = {n["name"]: i for i, n in enumerate(network["names"])}
        actual_edges = {tuple(edge) for edge in network["edges"]}
        self.assertEqual(len(actual_edges), len(network["edges"]))
        digest = hashlib.sha256()
        for name in network["names"]:
            path = VAULT / "Names" / (name["name"] + ".md")
            raw = path.read_bytes()
            digest.update(path.name.encode() + b"\0" + raw)
            text = raw.decode("utf-8-sig").replace("\r\n", "\n")
            self.assertIn('generator: "historicalbible-obsidian"', text)
            self.assertEqual(len(name["refs"]), int(re.search(r"^verse_count: (\d+)$", text, re.MULTILINE)[1]))
            self.assertEqual(len(set(name["refs"])), len(name["refs"]))
            i = indexes[name["name"]]
            links = re.findall(r"\[\[Bible/Names/([^|]+)\|[^\]]+\]\] \| (\d+)", text)
            self.assertEqual(len(links), int(re.search(r"^connection_count: (\d+)$", text, re.MULTILINE)[1]))
            for target, weight in links:
                j = indexes[target]
                self.assertGreater(int(weight), 0)
                self.assertIn((min(i, j), max(i, j), int(weight)), actual_edges)
        self.assertEqual(network["meta"]["nameNotesSha256"], digest.hexdigest())
        gideon = network["names"][indexes["Gideon"]]
        self.assertEqual(len(gideon["refs"]), 37)
        self.assertEqual(gideon["meaning"], "he that bruises or breaks; a destroyer")
        self.assertEqual(sum(indexes["Gideon"] in edge[:2] for edge in network["edges"]), 20)
        self.assertIn("Judg.6.11", gideon["refs"])
        self.assertNotIn("text", gideon)
        self.assertLess((ROOT / "public/data/bible_network.json").stat().st_size, 5 * 1024 * 1024)


if __name__ == "__main__":
    unittest.main()
