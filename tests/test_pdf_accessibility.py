"""Regression checks for the accessibility-only v0.3.1 PDF update."""
import os
from pathlib import Path
import unittest

from pdf_assertions import page_preservation_errors
from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]
_V030 = ROOT / "pdf-proof/v0.3.0/Bible-proof-v0.3.0.pdf"
_V031 = ROOT / "pdf-proof/v0.3.1/Bible-proof-v0.3.1.pdf"
SOURCE = _V030 if _V030.exists() else (ROOT / "pdf-proof/v0.2.0/Bible-proof-v0.2.0.pdf")
OUTPUT = Path(os.environ.get("BIBLE_ACCESSIBLE_PDF",
              _V031 if _V031.exists() else (ROOT / "pdf-proof/v0.3.3/Bible-proof-v0.3.3.pdf")))
LINK_LABEL = "Return to table of contents"


class AccessibilityTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.source = PdfReader(SOURCE, strict=True)
        cls.pdf = PdfReader(OUTPUT, strict=True)
        cls.has_note = len(cls.pdf.pages) == 1163

    def test_cover_has_meaningful_headings_and_figure_text(self):
        document = self.pdf.trailer["/Root"]["/StructTreeRoot"]["/K"][0].get_object()
        cover_ref = self.pdf.pages[0].indirect_reference
        elements = [item.get_object() for item in document["/K"]
                    if item.get_object().get("/Pg") == cover_ref]
        by_mcid = {tuple(item.get("/K", [])): item for item in elements
                   if item.get("/S") in ("/P", "/H1", "/H2")}
        self.assertEqual(by_mcid[(1,)]["/S"], "/H1")
        self.assertEqual(by_mcid[(2,)]["/S"], "/H2")
        figures = [item for item in elements if item.get("/S") == "/Figure"]
        self.assertEqual(len(figures), 2)
        self.assertTrue(all(str(item.get("/Alt", "")).startswith("Decorative pale blue")
                            for item in figures))

    def test_each_return_link_is_named_and_present_in_the_tag_tree(self):
        root = self.pdf.trailer["/Root"]
        structure = root["/StructTreeRoot"].get_object()
        parent_tree = structure["/ParentTree"].get_object()["/Nums"]
        parents = {int(parent_tree[i]): parent_tree[i + 1].get_object()
                   for i in range(0, len(parent_tree), 2)
                   if hasattr(parent_tree[i + 1], "get_object") and isinstance(parent_tree[i + 1].get_object(), dict)}
        document = structure["/K"][0].get_object()
        first_tag_on_page = {}
        for tag_ref in document["/K"]:
            page_ref = tag_ref.get_object().raw_get("/Pg")
            if page_ref is not None:
                first_tag_on_page.setdefault(page_ref.idnum, tag_ref)
        self.assertEqual(str(root["/Lang"]), "en")
        self.assertTrue(root["/MarkInfo"]["/Marked"])
        self.assertTrue(root["/ViewerPreferences"]["/DisplayDocTitle"])
        seen = set()
        start_page = 3 if self.has_note else 2
        for page_index in range(start_page, start_page + 1160):
            page = self.pdf.pages[page_index]
            self.assertEqual(page["/Tabs"], "/S")
            links = [ref for ref in page["/Annots"]
                     if ref.get_object().get("/Subtype") == "/Link"]
            self.assertGreaterEqual(len(links), 1, page_index + 1)
            annotation = links[0].get_object()
            key = int(annotation["/StructParent"])
            self.assertNotIn(key, seen)
            seen.add(key)
            self.assertEqual(annotation["/Contents"], LINK_LABEL)
            tag = parents[key]
            self.assertEqual(tag["/S"], "/Link")
            self.assertEqual(tag["/Alt"], LINK_LABEL)
            self.assertEqual(tag.raw_get("/Pg"), page.indirect_reference)
            self.assertEqual(first_tag_on_page[page.indirect_reference.idnum].get_object(), tag)
            reference = tag["/K"][0].get_object()
            self.assertEqual(reference["/Type"], "/OBJR")
            self.assertEqual(reference.raw_get("/Obj"), links[0])
        self.assertEqual(len(seen), 1160)

    def test_page_content_and_navigation_are_unchanged(self):
        expected_labels = (
            ["Cover", "Note", "Contents"] + [str(n) for n in range(1, 1161)]
            if self.has_note
            else ["Cover", "Contents"] + [str(n) for n in range(1, 1161)]
        )
        self.assertEqual(self.pdf.page_labels, expected_labels)
        self.assertEqual(page_preservation_errors(SOURCE, OUTPUT), ())

if __name__ == "__main__":
    unittest.main()
