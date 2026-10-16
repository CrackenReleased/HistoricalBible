"""Export the separate repaired Word master, embed its font, and keep copy text clean.

This is a local owner-review proof. It never replaces the original or website.
Run proof_bible_docx.py first; this driver exports and finishes its output.
"""
from __future__ import annotations
import argparse
import ctypes
from hashlib import sha256
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ORIGINAL = ROOT / 'Bible.pdf'
OUT = ROOT / 'pdf-proof/v0.2.0'
FONT = Path('C:/Program Files/Adobe/Adobe Photoshop (Beta)/Required/PDFL/Resource/Fonts/AdobeHeitiStd-Regular.otf')

def export_word_proof(candidate_docx, output, sample_pages=None):
    """Native Word export of a separate repaired master, never the original.

    The original OTF is registered only for this session and removed on exit.
    A new automation application is used; the user's open Word window stays.
    """
    import win32com.client
    candidate_docx, output = Path(candidate_docx).resolve(), Path(output).resolve()
    protected = (ROOT / "TacticalCastle/HistoricalBible/Bible.docx").resolve()
    if candidate_docx == protected:
        raise ValueError("Export the separate proof master; keep the recovered original read-only")
    font = Path("C:/Program Files/Adobe/Adobe Photoshop (Beta)/Required/PDFL/Resource/Fonts/AdobeHeitiStd-Regular.otf")
    if not font.exists():
        raise FileNotFoundError("Original body font is required; do not silently substitute")
    source_hash = sha256(protected.read_bytes()).hexdigest()
    pdf_hash = sha256(ORIGINAL.read_bytes()).hexdigest()
    registered = ctypes.windll.gdi32.AddFontResourceExW(str(font), 0, 0)
    if not registered:
        raise RuntimeError("Could not register original font for isolated Word export")
    word = document = None
    try:
        word = win32com.client.DispatchEx("Word.Application")
        if word.Documents.Count:
            raise RuntimeError("Refuse to change an application containing existing user documents")
        word.Visible = False
        word.DisplayAlerts = 0
        word.AutomationSecurity = 3
        # Positional arguments explicitly bind ReadOnly/AddToRecentFiles/Visible.
        document = word.Documents.Open(str(candidate_docx), False, True, False,
                                       "", "", False, "", "", 0, 0, False)
        if not document.ReadOnly:
            raise RuntimeError("Expected a read-only candidate document")
        print("Opened separate proof master read-only; updating navigation fields", flush=True)
        document.Fields.Update()
        for toc in document.TablesOfContents:
            toc.Update()
        export_range, first, last = (3, *sample_pages) if sample_pages else (0, 1, 1)
        document.ExportAsFixedFormat(str(output), 17, False, 0, export_range,
                                    first, last, 0, True, True, 1, True, False, False)
        print(f"Native Word export saved: {output}", flush=True)
    finally:
        if document is not None:
            document.Close(0)
        if word is not None:
            word.Quit(0)
        ctypes.windll.gdi32.RemoveFontResourceExW(str(font), 0, 0)
    assert sha256(protected.read_bytes()).hexdigest() == source_hash
    assert sha256(ORIGINAL.read_bytes()).hexdigest() == pdf_hash
    return output


def finish_native(source, output):
    from embed_pdf_fonts import embed_font, clean_running_furniture
    source, output = Path(source), Path(output)
    intermediate = OUT / 'word-fonts.pdf'
    embedding = embed_font(source, intermediate, FONT)
    print(json.dumps(embedding), flush=True)
    furniture = clean_running_furniture(intermediate, output)
    manifest = {'version':'0.2.0', 'scope':'Separate owner-review proof; originals and site unchanged',
                'native_export_sha256':sha256(source.read_bytes()).hexdigest(),
                'repaired_master_sha256':sha256((OUT/'Bible-proof-v0.2.0.docx').read_bytes()).hexdigest(),
                'font_sha256':sha256(FONT.read_bytes()).hexdigest(),
                'embedding':embedding, 'running_furniture':furniture,
                'output_sha256':sha256(output.read_bytes()).hexdigest()}
    (OUT/'repair-manifest-pdf.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf8')
    print(json.dumps(furniture),flush=True)
    return output


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--word-master', type=Path, default=OUT/'Bible-proof-v0.2.0.docx')
    parser.add_argument('--finish-native', type=Path, help='Finish an already exported native Word PDF')
    parser.add_argument('--output', type=Path, default=OUT/'Bible-proof-v0.2.0.pdf')
    args = parser.parse_args()
    native = args.finish_native or export_word_proof(args.word_master, OUT/'word-export-final.pdf')
    finish_native(native,args.output)
