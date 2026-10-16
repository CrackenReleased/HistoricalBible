#!/usr/bin/env python3
"""
Builds the optimized cross-reference JSON bundle from OpenBible.info TSV data
for HistoricalBible.com.

License Compliance:
- Treasury of Scripture Knowledge (Public Domain)
- OpenBible.info dataset by Stephen Smith (Creative Commons Attribution 4.0 - CC BY 4.0)
- Scripture text: King James Version (Public Domain)
"""
import argparse
import csv
import hashlib
import io
import json
import re
import sys
import urllib.request
import zipfile
from pathlib import Path

OPENBIBLE_URL = "https://a.openbible.info/data/cross-references.zip"
DEFAULT_OUTPUT = Path("public/data/cross_references_bundle.json")
DEFAULT_NETWORK_OUTPUT = Path("public/data/bible_network.json")

CANON_DIVISIONS = {
    "Gen": "Law", "Exod": "Law", "Lev": "Law", "Num": "Law", "Deut": "Law",
    "Josh": "History", "Judg": "History", "Ruth": "History", "1Sam": "History",
    "2Sam": "History", "1Kgs": "History", "2Kgs": "History", "1Chr": "History",
    "2Chr": "History", "Ezra": "History", "Neh": "History", "Esth": "History",
    "Job": "Poetry & Wisdom", "Ps": "Poetry & Wisdom", "Prov": "Poetry & Wisdom",
    "Eccl": "Poetry & Wisdom", "Song": "Poetry & Wisdom",
    "Isa": "Major Prophets", "Jer": "Major Prophets", "Lam": "Major Prophets",
    "Ezek": "Major Prophets", "Dan": "Major Prophets",
    "Hos": "Minor Prophets", "Joel": "Minor Prophets", "Amos": "Minor Prophets",
    "Obad": "Minor Prophets", "Jonah": "Minor Prophets", "Mic": "Minor Prophets",
    "Nah": "Minor Prophets", "Hab": "Minor Prophets", "Zeph": "Minor Prophets",
    "Hag": "Minor Prophets", "Zech": "Minor Prophets", "Mal": "Minor Prophets",
    "Matt": "Gospels", "Mark": "Gospels", "Luke": "Gospels", "John": "Gospels",
    "Acts": "Acts",
    "Rom": "Pauline Epistles", "1Cor": "Pauline Epistles", "2Cor": "Pauline Epistles",
    "Gal": "Pauline Epistles", "Eph": "Pauline Epistles", "Phil": "Pauline Epistles",
    "Col": "Pauline Epistles", "1Thess": "Pauline Epistles", "2Thess": "Pauline Epistles",
    "1Tim": "Pauline Epistles", "2Tim": "Pauline Epistles", "Titus": "Pauline Epistles",
    "Phlm": "Pauline Epistles",
    "Heb": "General Epistles", "Jas": "General Epistles", "1Pet": "General Epistles",
    "2Pet": "General Epistles", "1John": "General Epistles", "2John": "General Epistles",
    "3John": "General Epistles", "Jude": "General Epistles",
    "Rev": "Revelation"
}

OT_BOOKS = set(list(CANON_DIVISIONS.keys())[:39])
NT_BOOKS = set(list(CANON_DIVISIONS.keys())[39:])

def parse_ref(ref_str: str) -> str:
    """Normalizes range references (e.g. Matt.4.23-Matt.4.24 -> Matt.4.23)."""
    return ref_str.split("-")[0].strip()

def get_book(ref_str: str) -> str:
    """Extracts book code from ref (e.g. Acts.1.1 -> Acts)."""
    parts = parse_ref(ref_str).split(".")
    return parts[0] if parts else ""

def build_dataset(source_file: Path | None = None, min_votes: int = 0,
                  output_path: Path = DEFAULT_OUTPUT, all_votes: bool = False):
    print("=== HistoricalBible Cross-Reference Data Compiler ===")
    
    if source_file and source_file.exists():
        print(f"Reading from local source: {source_file}")
        if source_file.suffix == ".zip":
            with zipfile.ZipFile(source_file) as z:
                txt_candidates = [f for f in z.namelist() if f.endswith(".txt")]
                if not txt_candidates:
                    print("Error: No .txt file found in ZIP.", file=sys.stderr)
                    sys.exit(1)
                tsv_file = txt_candidates[0]
                with z.open(tsv_file) as raw_f:
                    text_content = io.TextIOWrapper(raw_f, encoding="utf-8")
                    links, meta = process_tsv(text_content, min_votes, all_votes)
        else:
            with source_file.open("r", encoding="utf-8") as f:
                links, meta = process_tsv(f, min_votes, all_votes)
    else:
        print(f"Fetching OpenBible.info dataset from {OPENBIBLE_URL}...")
        req = urllib.request.Request(
            OPENBIBLE_URL,
            headers={"User-Agent": "HistoricalBible-DataCompiler/1.0 (historicalbible.com)"}
        )
        try:
            with urllib.request.urlopen(req) as resp:
                data = resp.read()
                print(f"Downloaded {len(data):,} bytes.")
                with zipfile.ZipFile(io.BytesIO(data)) as z:
                    txt_candidates = [f for f in z.namelist() if f.endswith(".txt")]
                    if not txt_candidates:
                        print("Error: No .txt file found in downloaded ZIP.", file=sys.stderr)
                        sys.exit(1)
                    tsv_file = txt_candidates[0]
                    with z.open(tsv_file) as raw_f:
                        text_content = io.TextIOWrapper(raw_f, encoding="utf-8")
                        links, meta = process_tsv(text_content, min_votes, all_votes)
        except Exception as e:
            print(f"Network fetch failed: {e}. Falling back to generating seed dataset...", file=sys.stderr)
            links, meta = generate_fallback_seed()

    if source_file and source_file.exists():
        meta["source_sha256"] = hashlib.sha256(source_file.read_bytes()).hexdigest()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "meta": meta,
        "links": links
    }
    with output_path.open("w", encoding="utf-8") as out:
        json.dump(payload, out, separators=(",", ":"))
    print(f"Successfully compiled {len(links):,} links to {output_path}")
    return meta

def process_tsv(file_obj, min_votes: int = 0, all_votes: bool = False):
    reader = csv.reader(file_obj, delimiter="\t")
    header = next(reader, None)
    
    links = []
    source_verses = set()
    target_verses = set()
    inter_testament_count = 0

    for row in reader:
        if len(row) < 3:
            continue
        raw_src, raw_dst, votes_str = row[0], row[1], row[2]
        try:
            votes = int(votes_str)
        except ValueError:
            votes = 0

        if all_votes or votes >= min_votes:
            src = parse_ref(raw_src)
            dst = parse_ref(raw_dst)
            src_book = get_book(src)
            dst_book = get_book(dst)

            if src_book and dst_book:
                source_verses.add(src)
                target_verses.add(dst)
                
                is_ot_to_nt = (src_book in OT_BOOKS and dst_book in NT_BOOKS)
                is_nt_to_ot = (src_book in NT_BOOKS and dst_book in OT_BOOKS)
                if is_ot_to_nt or is_nt_to_ot:
                    inter_testament_count += 1

                links.append({
                    "s": src,
                    "t": dst,
                    "r": raw_dst,
                    "v": votes
                })

    meta = {
        "total_links": len(links),
        "source_verses_count": len(source_verses),
        "target_verses_count": len(target_verses),
        "inter_testament_links": inter_testament_count,
        "min_votes": None if all_votes else min_votes,
        "all_votes": all_votes,
        "negative_vote_records": sum(link["v"] < 0 for link in links),
        "license": "CC BY 4.0",
        "attribution": "OpenBible.info by Stephen Smith / Treasury of Scripture Knowledge"
    }
    return links, meta


def generated_note(path: Path):
    """Read only exporter-owned Markdown, never personal study notes."""
    text = path.read_text(encoding="utf-8-sig")
    frontmatter = text.split("---", 2)
    if len(frontmatter) < 3 or not re.search(
            r'^generator: "?historicalbible-obsidian"?\s*$',
            frontmatter[1], re.MULTILINE):
        raise ValueError(f"Not an owned generated note: {path}")
    return text


def export_network(vault: Path, crossref_meta: dict,
                   output_path: Path = DEFAULT_NETWORK_OUTPUT):
    """Export existing name occurrences and edges without deriving new claims.

    Scripture text is deliberately excluded. Consumers resolve OSIS references
    against the site's existing canonical corpus and disclose missing passages.
    """
    kjv_path = Path(__file__).resolve().parents[1] / "public/data/kjv_verses.json"
    site_verses = json.loads(kjv_path.read_text(encoding="utf-8"))
    book_names = list(dict.fromkeys(v["book"] for v in site_verses))
    if len(book_names) != len(CANON_DIVISIONS):
        raise ValueError("Canonical book mapping must contain 66 books")
    book_codes = dict(zip(book_names, CANON_DIVISIONS))
    verse_links = re.compile(r'\[\[Bible/Verses/([^/]+)/([^|\]]+)\|[^\]]+\]\]')
    edges_pattern = re.compile(r'^\| \[\[Bible/Names/([^|]+)\|[^\]]+\]\] \| (\d+) \|$', re.MULTILINE)
    names_digest, books_digest = hashlib.sha256(), hashlib.sha256()

    def refs_from(text):
        refs = []
        for book, filename in verse_links.findall(text):
            match = re.fullmatch(re.escape(book) + r' (\d{3})-(\d{3})', filename)
            if book not in book_codes or not match:
                raise ValueError(f"Invalid verse link: {book}/{filename}")
            chapter, verse = map(int, match.groups())
            refs.append(f"{book_codes[book]}.{chapter}.{verse}")
        if len(refs) != len(set(refs)):
            raise ValueError("Duplicate verse links in generated note")
        return refs

    source_refs = set()
    book_files = sorted((vault / "Books").glob("*.md"))
    if {p.stem for p in book_files} != set(book_names):
        raise ValueError("Vault book notes do not match canonical 66-book mapping")
    for path in book_files:
        text = generated_note(path)
        books_digest.update(path.name.encode() + b"\0" + path.read_bytes())
        refs = refs_from(text)
        if source_refs.intersection(refs):
            raise ValueError(f"Duplicate source verse identifiers: {path}")
        source_refs.update(refs)

    names, adjacency = [], []
    for path in sorted((vault / "Names").glob("*.md"), key=lambda p: p.stem):
        text = generated_note(path)
        names_digest.update(path.name.encode() + b"\0" + path.read_bytes())
        title = re.search(r'^title: (.+)$', text, re.MULTILINE)
        name = json.loads(title[1]) if title else path.stem
        if name != path.stem:
            raise ValueError(f"Name title/path mismatch: {path}")
        refs = refs_from(text)
        connections = edges_pattern.findall(text)
        for field, actual in (("verse_count", len(refs)), ("connection_count", len(connections))):
            expected = re.search(r'^' + field + r': (\d+)\s*$', text, re.MULTILINE)
            if not expected or int(expected[1]) != actual:
                raise ValueError(f"{field} mismatch: {path}")
        if not set(refs).issubset(source_refs):
            raise ValueError(f"Name references unknown snapshot verses: {path}")
        meaning = re.search(r'^\*\*Hitchcock dictionary meaning:\*\* (.*)$', text, re.MULTILINE)
        names.append({"name": name, "meaning": meaning[1] if meaning else "", "refs": refs})
        neighbors = {target: int(count) for target, count in connections}
        if len(neighbors) != len(connections) or name in neighbors or any(n <= 0 for n in neighbors.values()):
            raise ValueError(f"Duplicate, self, or nonpositive name edge: {path}")
        adjacency.append(neighbors)
    indexes = {entry["name"]: i for i, entry in enumerate(names)}
    edges = []
    for i, neighbors in enumerate(adjacency):
        for target, weight in neighbors.items():
            j = indexes.get(target)
            if j is None or adjacency[j].get(names[i]["name"]) != weight:
                raise ValueError(f"Missing or inconsistent reciprocal edge: {names[i]['name']} / {target}")
            if i < j:
                edges.append([i, j, weight])
    edges.sort()
    payload = {
        "meta": {
            "version": "0.01.00", "source": "Obsidian Bible network snapshot",
            "names": len(names), "nameEdges": len(edges), "books": len(book_files),
            "crossReferences": crossref_meta["total_links"], "sourceVerseCount": len(source_refs),
            "siteVerseCount": len(site_verses), "sourceCrossReferencesSha256": crossref_meta.get("source_sha256"),
            "unavailableSiteRefs": sorted(source_refs - {f"{book_codes[v['book']]}.{v['chapter']}.{v['verse']}" for v in site_verses}),
            "nameNotesSha256": names_digest.hexdigest(), "bookNotesSha256": books_digest.hexdigest(),
            "siteScriptureSha256": hashlib.sha256(kjv_path.read_bytes()).hexdigest(),
            "edgeMeaning": "Name spellings co-occurring in a verse; not disambiguated individuals or proof of kinship or a meeting.",
            "scripturePolicy": "References preserve the historical vault snapshot. Verse text comes only from the site's current KJV corpus; unavailable references must be disclosed.",
            "attribution": [
                "Existing HistoricalBible Obsidian network, generator historicalbible-obsidian (snapshot 2026-10-15).",
                "Hitchcock's Bible Names Dictionary, digitized by Brady Stephenson, https://github.com/BradyStephenson/bible-data (CC BY 4.0). Meanings are historical dictionary glosses.",
                "OpenBible.info by Stephen Smith / Treasury of Scripture Knowledge, https://www.openbible.info/labs/cross-references/ (CC BY 4.0). All vote scores retained.",
                "Name co-occurrence method inspired by Chris Harrison, https://www.chrisharrison.net/index.php/Visualizations/BibleViz; existing independently generated edges."
            ]
        }, "names": names, "edges": edges
    }
    encoded = json.dumps(payload, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    if len(encoded) > 5 * 1024 * 1024:
        raise ValueError("Network export exceeds 5 MiB size limit")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_bytes(encoded)
    print(f"Exported {len(names):,} names / {len(edges):,} existing edges to {output_path} ({len(encoded):,} bytes)")
    return payload

def generate_fallback_seed():
    # Basic seed in case network access is restricted
    seed = [
        {"s": "Acts.1.1", "t": "Luke.1.3", "r": "Luke.1.3", "v": 10},
        {"s": "Acts.1.1", "t": "Matt.4.23", "r": "Matt.4.23-Matt.4.24", "v": 8},
        {"s": "Acts.1.8", "t": "Isa.49.6", "r": "Isa.49.6", "v": 25},
        {"s": "Acts.1.8", "t": "Luke.24.49", "r": "Luke.24.49", "v": 30},
        {"s": "Gen.1.1", "t": "John.1.1", "r": "John.1.1-John.1.3", "v": 45},
        {"s": "Gen.1.1", "t": "Ps.33.6", "r": "Ps.33.6", "v": 20},
        {"s": "John.3.16", "t": "Rom.5.8", "r": "Rom.5.8", "v": 50}
    ]
    meta = {
        "total_links": len(seed),
        "source_verses_count": 4,
        "target_verses_count": 7,
        "inter_testament_links": 3,
        "min_votes": 0,
        "license": "CC BY 4.0",
        "attribution": "OpenBible.info / Treasury of Scripture Knowledge (Fallback Seed)"
    }
    return seed, meta

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Compile OpenBible.info cross-references into HistoricalBible bundle.")
    parser.add_argument("--file", type=Path, default=None, help="Path to local cross-references.zip or cross_references.txt")
    parser.add_argument("--min-votes", type=int, default=0, help="Minimum vote threshold (default 0)")
    parser.add_argument("--all-votes", action="store_true", help="Retain every source record, including negative votes")
    parser.add_argument("--vault", type=Path, help="Read-only generated Obsidian Bible folder to export")
    parser.add_argument("--network-out", type=Path, default=DEFAULT_NETWORK_OUTPUT, help="Name network JSON output path")
    parser.add_argument("--out", type=Path, default=DEFAULT_OUTPUT, help="Output JSON path")
    args = parser.parse_args()
    if args.file and not args.file.is_file():
        parser.error(f"Local source does not exist: {args.file}")
    meta = build_dataset(source_file=args.file, min_votes=args.min_votes, output_path=args.out, all_votes=args.all_votes)
    if args.vault:
        export_network(args.vault, meta, args.network_out)
