"""Regression checks for the illustrated, selectable KJV reading note."""
from pathlib import Path
import re
import unittest

import pymupdf
from pypdf import PdfReader
from pypdf.generic import ContentStream

ROOT = Path(__file__).resolve().parents[1]
OLD = ROOT / "pdf-proof/v0.3.1/Bible-proof-v0.3.1.pdf"
NEW = ROOT / "pdf-proof/v0.3.2/Bible-proof-v0.3.2.pdf"


class ReadingNote(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.old = pymupdf.open(OLD)
        cls.new = pymupdf.open(NEW)
        cls.reader = PdfReader(NEW, strict=True)

    @classmethod
    def tearDownClass(cls):
        cls.old.close()
        cls.new.close()

    def test_note_layout_and_clean_copy(self):
        self.assertEqual(len(self.new), 1163)
        self.assertEqual([self.new[i].get_label() for i in [0, 1, 2, 3, 1162]],
                         ["Cover", "Note", "Contents", "1", "1160"])
        note = self.new[1]
        text = note.get_text()
        self.assertIn("A Note on This Edition", text)
        self.assertIn("{1:1}", text)
        self.assertIn("[was]", text)
        self.assertIn("italic in most printed KJVs; here bracketed for search, copying, and machine learning.", text)
        self.assertIn("Thou, thee, thy, thine", text)
        self.assertIn("Ye, you, your", text)
        self.assertEqual(len(re.findall(r"(?m)^LORD$", text)), 2)
        self.assertIn("\nLord\n", text)
        self.assertIn("\nlord\n", text)
        self.assertEqual(len(note.get_images()), 0)
        for xref, _, _, font_name, *_ in note.get_fonts():
            if "Calibri" in font_name:
                self.assertTrue(self.new.extract_font(xref)[3])

        # The two copies of LORD have the same clean ASCII text, but visibly
        # different glyph sizes. This catches a font fallback or raster export.
        examples = []
        for block in note.get_text("rawdict")["blocks"]:
            for line in block.get("lines", []):
                chars = [(char["c"], span["size"])
                         for span in line["spans"] for char in span["chars"]]
                if "".join(c for c, _ in chars) == "LORD":
                    examples.append([size for _, size in chars])
        self.assertEqual(len(examples), 2)
        self.assertLess(max(examples[0][1:]), examples[0][0] * .85)
        self.assertTrue(all(abs(size - examples[1][0]) < .1 for size in examples[1]))

    def test_existing_pages_and_navigation_survive_insertion(self):
        self.assertEqual(len(self.new), len(self.old) + 1)
        old_toc, new_toc = self.old.get_toc(), self.new.get_toc()
        self.assertEqual(len(old_toc), 1263)
        self.assertEqual([[level, title, page + 1 if page > 1 else page]
                          for level, title, page in old_toc], new_toc)
        for old_index, old_page in enumerate(self.old):
            new_page = self.new[old_index + (old_index >= 1)]
            self.assertEqual(old_page.rect, new_page.rect)
            self.assertEqual(old_page.get_text(), new_page.get_text(), old_index)
            old_links, new_links = old_page.get_links(), new_page.get_links()
            self.assertEqual(len(old_links), len(new_links), old_index)
            for old_link, new_link in zip(old_links, new_links):
                self.assertEqual(old_link["from"], new_link["from"])
                if "page" in old_link:
                    self.assertEqual(new_link["page"], old_link["page"] +
                                     (old_link["page"] >= 1), old_index)

    def test_note_has_real_structure_tags(self):
        page = self.reader.pages[1]
        self.assertEqual(page["/Tabs"], "/S")
        key = int(page["/StructParents"])
        root = self.reader.trailer["/Root"]["/StructTreeRoot"]
        parent_numbers = root["/ParentTree"]["/Nums"]
        index = next(i for i in range(0, len(parent_numbers), 2)
                     if int(parent_numbers[i]) == key)
        tags = parent_numbers[index + 1]
        self.assertEqual(len(tags), 19)
        self.assertEqual(tags[0].get_object()["/S"], "/H1")
        self.assertEqual([int(tag.get_object()["/K"]) for tag in tags],
                         list(range(19)))
        mcids = [int(operands[1]["/MCID"])
                 for operands, operation in ContentStream(page.get_contents(), self.reader).operations
                 if operation == b"BDC" and len(operands) > 1
                 and isinstance(operands[1], dict) and "/MCID" in operands[1]]
        self.assertEqual(mcids, list(range(19)))
        document = root["/K"][0].get_object()
        self.assertTrue(all(tag in document["/K"] for tag in tags))

    def test_original_tagged_return_links_and_source_lettering_survive(self):
        root = self.reader.trailer["/Root"]["/StructTreeRoot"]
        numbers = root["/ParentTree"]["/Nums"]
        parents = {int(numbers[i]): numbers[i + 1].get_object()
                   for i in range(0, len(numbers), 2)}
        contents_ref = self.reader.pages[2].indirect_reference
        for index in range(3, 1163):
            page = self.reader.pages[index]
            links = [ref for ref in page["/Annots"]
                     if ref.get_object().get("/Subtype") == "/Link"]
            self.assertEqual(len(links), 1, index)
            annotation = links[0].get_object()
            self.assertEqual(annotation["/Dest"][0], contents_ref)
            tag = parents[int(annotation["/StructParent"])]
            self.assertEqual(tag["/S"], "/Link")
            self.assertEqual(tag["/Alt"], "Return to table of contents")
            self.assertEqual(tag["/K"][0].get_object().raw_get("/Obj"), links[0])

        # Genesis 2:4 has small-cap LORD; Revelation 19:16 has full capitals.
        # Compare glyph-level data, including each character's actual font size.
        for old_index in (3, 1158):
            self.assertEqual(self.old[old_index].get_text("rawdict"),
                             self.new[old_index + 1].get_text("rawdict"))


if __name__ == "__main__":
    unittest.main()
