#!/usr/bin/env python3
"""
Fetches public-domain KJV scripture text (31,102 verses) and compiles an optimized
lookup dictionary into public/data/kjv_verses.json for instant client-side inspection.
"""
import json
import urllib.request
from pathlib import Path

KJV_URL = "https://raw.githubusercontent.com/thiagobodruk/bible/master/json/en_kjv.json"
OUTPUT_PATH = Path("public/data/kjv_verses.json")

BOOK_KEYS = [
    "Gen", "Exod", "Lev", "Num", "Deut", "Josh", "Judg", "Ruth", "1Sam", "2Sam",
    "1Kgs", "2Kgs", "1Chr", "2Chr", "Ezra", "Neh", "Esth", "Job", "Ps", "Prov",
    "Eccl", "Song", "Isa", "Jer", "Lam", "Ezek", "Dan", "Hos", "Joel", "Amos",
    "Obad", "Jonah", "Mic", "Nah", "Hab", "Zeph", "Hag", "Zech", "Mal",
    "Matt", "Mark", "Luke", "John", "Acts", "Rom", "1Cor", "2Cor", "Gal", "Eph",
    "Phil", "Col", "1Thess", "2Thess", "1Tim", "2Tim", "Titus", "Phlm", "Heb",
    "Jas", "1Pet", "2Pet", "1John", "2John", "3John", "Jude", "Rev"
]

BOOK_FULL_NAMES = [
    "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth",
    "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra",
    "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon",
    "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
    "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi",
    "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians",
    "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians",
    "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter",
    "1 John", "2 John", "3 John", "Jude", "Revelation"
]

def build_kjv_cache():
    print(f"Downloading KJV text from {KJV_URL}...")
    req = urllib.request.Request(KJV_URL, headers={"User-Agent": "HistoricalBible-Builder/1.0"})
    with urllib.request.urlopen(req) as r:
        raw = r.read().decode("utf-8")
        raw_books = json.loads(raw)

    verse_dict = {}
    chapter_counts = {}
    verse_counts_per_chapter = []

    for b_idx, book_data in enumerate(raw_books):
        book_key = BOOK_KEYS[b_idx]
        book_name = BOOK_FULL_NAMES[b_idx]
        chapters = book_data.get("chapters", [])
        chapter_counts[book_key] = len(chapters)

        for c_idx, chapter in enumerate(chapters):
            ch_num = c_idx + 1
            verse_counts_per_chapter.append({
                "book": book_key,
                "bookName": book_name,
                "ch": ch_num,
                "count": len(chapter)
            })
            for v_idx, verse_text in enumerate(chapter):
                v_num = v_idx + 1
                key = f"{book_key}.{ch_num}.{v_num}"
                verse_dict[key] = verse_text.strip()

    print(f"Indexed {len(verse_dict):,} verses across {len(verse_counts_per_chapter):,} chapters.")
    
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "meta": {
            "version": "King James Version (KJV)",
            "license": "Public Domain",
            "verse_count": len(verse_dict),
            "chapter_count": len(verse_counts_per_chapter)
        },
        "chapters": verse_counts_per_chapter,
        "verses": verse_dict
    }

    with OUTPUT_PATH.open("w", encoding="utf-8") as out:
        json.dump(payload, out, separators=(",", ":"))
    print(f"Saved complete KJV index to {OUTPUT_PATH}")

if __name__ == "__main__":
    build_kjv_cache()
