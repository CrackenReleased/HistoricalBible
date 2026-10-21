"""Regression checks for clickable book names in the Bible running header."""
from bisect import bisect_right
import os
from pathlib import Path
import unittest

import pymupdf
from pdf_assertions import page_preservation_errors
from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]
_V032 = ROOT / "pdf-proof/v0.3.2/Bible-proof-v0.3.2.pdf"
SOURCE = _V032 if _V032.exists() else (ROOT / "pdf-proof/v0.2.0/Bible-proof-v0.2.0.pdf")
OUTPUT = Path(os.environ.get("BIBLE_BOOK_LINK_PDF",
                          ROOT / "pdf-proof/v0.3.3/Bible-proof-v0.3.3.pdf"))
EXCEPTIONS = {3, 882}  # Running header reads OLD/NEW TESTAMENT, not a book.


class BookHeaderLinks(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.source = pymupdf.open(SOURCE)
        cls.output = pymupdf.open(OUTPUT)
        cls.reader = PdfReader(OUTPUT, strict=True)
        cls.roots = [(row[2] - 1, row[1]) for row in cls.output.get_toc()
                     if row[0] == 1 and row[1] not in
                     ("Table of Contents:", "~ THE OLD TESTAMENT ~", "~ THE NEW TESTAMENT ~")]
        cls.starts = [page for page, _ in cls.roots]
        cls.book_destinations = {}
        node = cls.reader.trailer["/Root"]["/Outlines"]["/First"]
        while node is not None:
            outline = node.get_object()
            if outline.get("/Title") in {title for _, title in cls.roots}:
                cls.book_destinations[str(outline["/Title"])] = outline["/Dest"]
            node = outline.get("/Next")

    @classmethod
    def tearDownClass(cls):
        cls.source.close()
        cls.output.close()

    def test_each_visible_book_name_opens_its_chapter_one_page(self):
        self.assertEqual(len(self.roots), 66)
        count = 0
        for index in range(3, 1163):
            book_start, title = self.roots[bisect_right(self.starts, index) - 1]
            links = self.output[index].get_links()
            self.assertEqual(len(links), 1 if index in EXCEPTIONS else 2, index)
            self.assertEqual(links[0]["page"], 2, index)  # Existing Contents link.
            if index in EXCEPTIONS:
                continue
            book_link = links[1]
            self.assertEqual(book_link["page"], book_start, (index, title))
            self.assertEqual(book_link["kind"], pymupdf.LINK_GOTO)
            self.assertGreater(book_link["from"].x0, 400)
            self.assertLess(book_link["from"].y0, 30)
            self.assertLess(book_link["from"].x1, 600)
            count += 1
        self.assertEqual(count, 1158)

    def test_new_links_are_tagged_and_existing_return_links_remain(self):
        structure = self.reader.trailer["/Root"]["/StructTreeRoot"]
        numbers = structure["/ParentTree"]["/Nums"]
        parents = {int(numbers[i]): numbers[i + 1].get_object()
                   for i in range(0, len(numbers), 2)}
        document = structure["/K"][0].get_object()
        children = document["/K"]
        positions = {ref.idnum: i for i, ref in enumerate(children)}
        count = 0
        for index in range(3, 1163):
            page = self.reader.pages[index]
            refs = [ref for ref in page["/Annots"]
                    if ref.get_object().get("/Subtype") == "/Link"]
            self.assertEqual(len(refs), 1 if index in EXCEPTIONS else 2, index)
            first = refs[0].get_object()
            self.assertEqual(first["/Contents"], "Return to table of contents")
            self.assertEqual(first["/Dest"][0], self.reader.pages[2].indirect_reference)
            if index in EXCEPTIONS:
                continue
            _, title = self.roots[bisect_right(self.starts, index) - 1]
            second = refs[1].get_object()
            self.assertEqual(second["/Contents"], f"Go to chapter 1 of {title}")
            self.assertEqual(second["/Dest"], self.book_destinations[title])
            tag = parents[int(second["/StructParent"])]
            self.assertEqual(tag["/S"], "/Link")
            self.assertEqual(tag["/Alt"], second["/Contents"])
            self.assertEqual(tag.raw_get("/Pg"), page.indirect_reference)
            self.assertEqual(tag["/K"][0].get_object().raw_get("/Obj"), refs[1])
            first_tag = parents[int(first["/StructParent"])]
            self.assertEqual(positions[tag.indirect_reference.idnum],
                             positions[first_tag.indirect_reference.idnum] + 1)
            count += 1
        self.assertEqual(count, 1158)

    def test_source_pages_and_navigation_are_unchanged(self):
        note_shift = 1 if len(self.source) == 1162 else 0
        self.assertEqual(len(self.source) + note_shift, len(self.output))
        if note_shift == 0:
            self.assertEqual(self.source.get_toc(), self.output.get_toc())
            self.assertEqual(self.source.get_page_labels(), self.output.get_page_labels())
        self.assertEqual(page_preservation_errors(SOURCE, OUTPUT), ())
        for index in (4, 640, 1150):
            src_idx = index - note_shift
            self.assertEqual(self.source[src_idx].get_pixmap().samples,
                             self.output[index].get_pixmap().samples, index)


if __name__ == "__main__":
    unittest.main()
