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
import zipfile

ROOT = Path(__file__).resolve().parents[1]
VAULT = Path(r"E:\AI_Hub\Vault\Bible")
ARCHIVE = Path(r"E:\AI_Hub\Tools\bible-network\sources\cross-references.zip")
SPEC = importlib.util.spec_from_file_location("crossref_builder", ROOT / "scripts/build-crossref-data.py")
BUILDER = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(BUILDER)


class NetworkExportTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.network = json.loads((ROOT / "public/data/bible_network.json").read_text(encoding="utf-8"))
        cls.bundle = json.loads((ROOT / "public/data/cross_references_bundle.json").read_text(encoding="utf-8"))

    def test_default_threshold_and_all_votes_preserve_range(self):
        source = "From Verse\tTo Verse\tVotes\nGen.1.1\tJohn.1.1-John.1.3\t-2\nGen.1.2\tPs.1.1\t0\n"
        links, _ = BUILDER.process_tsv(io.StringIO(source))
        self.assertEqual(len(links), 1)
        links, meta = BUILDER.process_tsv(io.StringIO(source), all_votes=True)
        self.assertEqual(links[0], {"s": "Gen.1.1", "t": "John.1.1", "r": "John.1.1-John.1.3", "v": -2})
        self.assertEqual(meta["negative_vote_records"], 1)
        self.assertIsNone(meta["min_votes"])

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
        self.assertEqual(network["meta"]["siteVerseCount"], 31098)
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
