"""Regression checks for version 0.3 PDF navigation additions."""
from pathlib import Path
import sys
import unittest
import pymupdf as fitz
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'pdf-proof/v0.2.0/Bible-proof-v0.2.0.pdf'
_V030 = ROOT / 'pdf-proof/v0.3.0/Bible-proof-v0.3.0.pdf'
PDF = _V030 if _V030.exists() else (ROOT / 'pdf-proof/v0.3.3/Bible-proof-v0.3.3.pdf')
sys.path.insert(0, str(ROOT / 'tests'))
sys.path.insert(0, str(ROOT / 'scripts'))
from test_pdf_proof import collect
from add_pdf_navigation import CODES, BOOK_TITLES

class NavigationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.old = fitz.open(SOURCE)
        cls.new = fitz.open(PDF)
        cls.reader = PdfReader(PDF, strict=True)
        cls.verses = {v['key']:v for v in collect(cls.new)}
        cls.toc = cls.new.get_toc()
        cls.has_note = len(cls.new) == 1163

    def test_labels_match_printed_folios(self):
        labels = self.reader.page_labels
        if self.has_note:
            self.assertEqual(labels[0:4], ['Cover','Note','Contents','1'])
            self.assertEqual(labels[-1], '1160')
            self.assertEqual(len(labels), 1163)
            self.assertEqual(labels[3:], [str(n) for n in range(1,1161)])
        else:
            self.assertEqual(labels[0:3], ['Cover','Contents','1'])
            self.assertEqual(labels[-1], '1160')
            self.assertEqual(len(labels), 1162)
            self.assertEqual(labels[2:], [str(n) for n in range(1,1161)])

    def test_complete_chapter_outline_is_nested_by_book(self):
        roots = [row for row in self.toc if row[0] == 1]
        chapters = [row for row in self.toc if row[0] == 2 and row[1].startswith('Chapter ')]
        self.assertEqual(len(roots), 69)
        self.assertEqual(len(chapters), 1189)
        non_chapters = [
            [row[0], row[1], row[2] - (1 if self.has_note and row[2] > 1 else 0)]
            for row in self.toc if not row[1].startswith('Chapter ')
        ]
        self.assertEqual(non_chapters, self.old.get_toc())
        self.assertTrue(all(row[1].startswith('Chapter ') for row in chapters))

    def test_every_chapter_bookmark_targets_its_first_verse(self):
        expected = {}
        for key,value in self.verses.items():
            book,chapter,verse = key.rsplit('.',2)
            if verse == '1': expected[(book,chapter)] = value['page']
        self.assertEqual(len(expected),1189)
        title_to_code=dict(zip(BOOK_TITLES,CODES))
        current_book=None;checked=0
        for level,title,page in self.toc:
            if level==1:
                current_book=title_to_code.get(title)
            elif level==2 and title.startswith('Chapter '):
                chapter=title.removeprefix('Chapter ')
                self.assertIsNotNone(current_book,title)
                self.assertEqual(expected[(current_book,chapter)],page-1,(current_book,chapter))
                checked+=1
        self.assertEqual(checked,1189)

    def test_books_start_collapsed_and_chapter_destinations_land_on_verse_one(self):
        outlines=self.reader.trailer['/Root']['/Outlines'].get_object()
        node=outlines.get('/First');books={}
        while node is not None:
            current=node.get_object();books[str(current.get('/Title'))]=current
            node=current.get('/Next')
        for title in BOOK_TITLES:
            self.assertLess(int(books[title].get('/Count',0)),0,title)
        title_to_code=dict(zip(BOOK_TITLES,CODES))
        for title,chapter in [('GENESIS','2'),('PSALMS','119'),('REVELATION','22')]:
            node=books[title].get('/First')
            while node is not None and node.get_object().get('/Title') != 'Chapter '+chapter:
                node=node.get_object().get('/Next')
            self.assertIsNotNone(node,(title,chapter))
            destination=node.get_object()['/A']['/D']
            key=f"{title_to_code[title]}.{chapter}.1"
            page_index=self.reader.get_page_number(destination[0])
            self.assertEqual(page_index,self.verses[key]['page'],key)
            marker_rect=self.new[page_index].search_for('{'+chapter+':1}')[0]
            expected_top=self.new[page_index].rect.height-marker_rect.y0
            self.assertAlmostEqual(float(destination[3]),expected_top,places=1,msg=key)

    def test_page_content_geometry_links_and_tag_tree_are_unchanged(self):
        self.assertEqual(len(self.old) + (1 if self.has_note else 0), len(self.new))
        self.assertIn('/StructTreeRoot',self.reader.trailer['/Root'])
        for i in range(len(self.old)):
            before = self.old[i]
            after = self.new[i + (1 if self.has_note and i >= 1 else 0)]
            self.assertEqual(before.rect,after.rect)
            self.assertEqual(before.get_text(),after.get_text(),f'page {i+1}')
            before_links = normalized_links(before)
            after_links = normalized_links(after)[:len(before_links)]
            if self.has_note:
                for lnk in before_links:
                    if isinstance(lnk.get('page'), int) and lnk['page'] >= 1:
                        lnk['page'] += 1
            self.assertEqual(before_links, after_links, f'page {i+1}')

def normalized_links(page):
    keys=('kind','from','page','to','zoom','uri','nameddest','file','page_from')
    return [{k:tuple(round(x,3) for x in v) if k in ('from','to') and v is not None else v
             for k,v in link.items() if k in keys} for link in page.get_links()]

if __name__ == '__main__':
    unittest.main()
