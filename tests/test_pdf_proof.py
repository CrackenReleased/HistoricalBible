"""Reader-visible acceptance for the native Word PDF proof. --pdf Bible.pdf reproduces defects."""
import argparse
from hashlib import sha256
import json
from pathlib import Path
import re
import sys
import unittest
import pymupdf as fitz
from pypdf import PdfReader
from pypdf.generic import ContentStream

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from proof_bible_docx import inventory, text, SOURCE, SOURCE_SHA, FURNITURE
from extract_kjv_witness import CODES
from lxml import etree as E
import zipfile

OUT = ROOT / 'pdf-proof/v0.2.0'
parser = argparse.ArgumentParser()
parser.add_argument('--pdf', type=Path, default=OUT / 'Bible-proof-v0.2.0.pdf')
args, remaining = parser.parse_known_args()

def norm(value):
    # A hard hyphen at a line end remains a hyphen, not a lost character.
    value = re.sub(r'(?<=[A-Za-z]-)\s+(?=[A-Za-z])', '', value)
    return re.sub(r'\s+', ' ', value).strip()

def body(page):
    return page.get_text(clip=fitz.Rect(0, 46, 612, 748))

def collect(document):
    entries = []
    books = [r for r in document.get_toc() if r[0] == 1 and r[1] not in ['Table of Contents:', '~ THE OLD TESTAMENT ~', '~ THE NEW TESTAMENT ~']]
    starts = sorted((row[2]-1, code) for code,row in zip(CODES,books))
    active = None
    for number in range(2, len(document)):
        book = next(code for first,code in reversed(starts) if first <= number)
        value = body(document[number])
        matches = list(re.finditer(r'\{(\d+):(\d+)\}', value))
        if active is not None:
            entries[-1]['text'] += '\n' + value[:matches[0].start() if matches else len(value)]
        for index, m in enumerate(matches):
            active = f'{book}.{m[1]}.{m[2]}'
            entries.append({'key': active, 'page': number, 'text': value[m.start():matches[index+1].start() if index+1<len(matches) else len(value)]})
    return entries

class PDFProof(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.pdf = fitz.open(args.pdf)
        cls.reader = PdfReader(args.pdf)
        cls.original = fitz.open(ROOT / 'Bible.pdf')
        cls.entries = collect(cls.pdf)
        cls.verses = {e['key']: e for e in cls.entries}
        with zipfile.ZipFile(OUT / 'Bible-proof-v0.2.0.docx') as z:
            cls.golden = dict((k,text(p)) for k,p in inventory(E.fromstring(z.read('word/document.xml'))))

    def test_originals_unchanged(self):
        self.assertEqual(sha256(SOURCE.read_bytes()).hexdigest(), SOURCE_SHA)
        self.assertEqual(sha256((ROOT/'Bible.pdf').read_bytes()).hexdigest(), '350c32f5e611917ef3d58942dc50802cc9c9119904b6094c37ebb3e07afc9aad')

    def test_complete_unique_ordered_inventory(self):
        self.assertEqual(len(self.entries), 31102)
        self.assertEqual([e['key'] for e in self.entries], list(self.golden))
        self.assertEqual(len({k.rsplit('.',1)[0] for k in self.verses}), 1189)

    def test_all_scripture_copies_match_repaired_master(self):
        errors = []
        for key, expected in self.golden.items():
            actual = norm(self.verses.get(key, {}).get('text',''))
            if not actual.startswith(norm(expected)):
                errors.append((key,actual[:160],norm(expected)[:160]))
        self.assertEqual(len(errors), 0, repr(errors[:8]))

    def test_restored_endings_and_repeated_clauses(self):
        for key in ['Phil.4.23','1Thess.5.28','Heb.13.25','Rev.22.21']:
            self.assertEqual(sum(e['key']==key for e in self.entries), 1)
            self.assertIn('[be] with you', norm(self.verses[key]['text']))
        self.assertEqual(norm(self.verses['1Chr.11.2']['text']).count('and thou shalt be ruler over my people Israel'),1)
        self.assertEqual(norm(self.verses['Ezek.17.24']['text']).count('I the LORD have brought down the high tree'),1)

    def test_bookmarks_and_navigation(self):
        # Native Word pagination is allowed; logical destinations must survive.
        self.assertEqual([(r[0],r[1]) for r in self.pdf.get_toc()],[(r[0],r[1]) for r in self.original.get_toc()])
        toc = {row[1]:row[2]-1 for row in self.pdf.get_toc()}
        book_rows = [r for r in self.pdf.get_toc() if r[1] not in ['Table of Contents:','~ THE OLD TESTAMENT ~','~ THE NEW TESTAMENT ~'] and r[0]==1]
        self.assertEqual(len(book_rows),66)
        toc_links = self.pdf[1].get_links()
        for code,row in zip(CODES,book_rows):
            self.assertEqual(self.verses[code+'.1.1']['page'],row[2]-1, row[1])
            self.assertTrue(any(l.get('page')==row[2]-1 and not l['from'].is_empty for l in toc_links),row[1])
        for number,page in enumerate(self.pdf):
            for link in page.get_links():
                if link['kind']==fitz.LINK_GOTO:
                    self.assertTrue(0<=link['page']<len(self.pdf))
            if number>=2:
                self.assertTrue(any(l.get('page')==toc['Table of Contents:'] for l in page.get_links()), f'header p{number+1}')

    def test_furniture_does_not_pollute_copy(self):
        for page in list(self.pdf)[2:]:
            value = page.get_text()
            self.assertNotIn('Go Back -', value)
            self.assertNotIn('HistoricalBible.com',value)
            self.assertNotRegex(value,r'P\s+a\s+g\s+e')
        self.assertFalse(FURNITURE.search(' '.join(v['text'] for v in self.entries)))

    def test_independent_reader_selection(self):
        for key in ['Gen.21.17','Num.10.17','Deut.22.10','Gen.2.4','Isa.3.15','Mark.12.36','Phil.4.23','1Thess.5.28','Heb.13.25','Rev.22.21']:
            page = self.verses[key]['page']
            value = norm(self.reader.pages[page].extract_text())
            self.assertIn(norm(self.golden[key]),value,key)
            self.assertNotIn('Go Back -',value)
            self.assertNotIn('HistoricalBible.com',value)

    def test_fonts_embedded_and_scripture_native(self):
        checked=set()
        for page in self.pdf:
            for xref,ext,kind,name,*_ in page.get_fonts():
                if xref in checked: continue
                checked.add(xref)
                self.assertTrue(self.pdf.extract_font(xref)[3],name)
        self.assertGreater(len(self.pdf[3].get_text()),1500)
        self.assertFalse(self.pdf[3].get_images())

    def test_smallcaps_and_fullcap_exception(self):
        for key,token,small in [('Gen.2.4','LORD',True),('Gen.15.2','GOD',True),('Acts.17.23','GOD',False)]:
            page=self.pdf[self.verses[key]['page']]
            found=[]
            for block in page.get_text('rawdict')['blocks']:
                for line in block.get('lines',[]):
                    chars=[(c['c'],s['size']) for s in line['spans'] for c in s['chars']]
                    value=''.join(c[0] for c in chars)
                    for match in re.finditer(r'\b'+token+r'\b',value):
                        sizes=[c[1] for c in chars[match.start():match.end()]]
                        found.append(sizes)
            self.assertTrue(found,key)
            self.assertTrue(any((s[1]<s[0]*.85) if small else abs(s[1]-s[0])<.1 for s in found),key)

    def test_tagged_scripture_survives(self):
        page=self.reader.pages[14]
        stack=[]; count=0
        for operands,op in ContentStream(page.get_contents(),self.reader).operations:
            if op in (b'BMC',b'BDC'):
                stack.append((stack[-1] if stack else False) or (len(operands)>1 and isinstance(operands[1],dict) and '/MCID' in operands[1]))
            elif op==b'EMC': stack.pop()
            elif op in (b'Tj',b'TJ') and stack and stack[-1] and operands:
                count+=1
        self.assertGreater(count,30)
        self.assertIn('/StructTreeRoot',self.reader.trailer['/Root'])

if __name__=='__main__':
    unittest.main(argv=[sys.argv[0]]+remaining)
