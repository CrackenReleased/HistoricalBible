#!/usr/bin/env python3
"""
Compiles Hitchcock's Bible Names Dictionary and ChatGPT's theological audit batches
into optimized JSON bundles for HistoricalBible.com/Interact.
"""
import csv
import json
import argparse
import hashlib
import re
import importlib.util
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
TOOLS_DIR = Path(r"E:\AI_Hub\Tools\bible-network")
OUTPUT_DIR = ROOT / "public" / "data"

def compile_names():
    csv_path = TOOLS_DIR / "sources" / "HitchcocksBibleNamesDictionary.csv"
    if not csv_path.exists():
        print(f"Hitchcock CSV not found at {csv_path}")
        return

    names_dict = {}
    with open(csv_path, mode="r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            name = row["Name"].strip()
            meaning = row["Meaning"].strip()
            if name:
                if name not in names_dict:
                    names_dict[name] = {"name": name, "meanings": [meaning]}
                elif meaning not in names_dict[name]["meanings"]:
                    names_dict[name]["meanings"].append(meaning)

    out_file = OUTPUT_DIR / "hitchcock_names.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(names_dict, f, separators=(',', ':'))
    print(f"Compiled {len(names_dict)} names into {out_file} ({out_file.stat().st_size} bytes)")

def compile_audit_relations():
    relations = {}
    
    # Ingest Genesis batch
    gen_file = TOOLS_DIR / "audit-batch-genesis.jsonl"
    if gen_file.exists():
        with open(gen_file, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line:
                    item = json.loads(line)
                    key = f"{item['source']}->{item['target']}"
                    relations[key] = {
                        "source": item.get("source"),
                        "target": item.get("target"),
                        "votes": item.get("votes"),
                        "status": item.get("status"),
                        "classification": item.get("classification"),
                        "relation": item.get("relation"),
                        "reason": item.get("reason"),
                        "evidence": item.get("evidence", []),
                        "limitations": item.get("limitations"),
                        "reviewer": item.get("reviewer")
                    }

    # Ingest Primary batch
    prim_file = TOOLS_DIR / "audit-batch-primary.jsonl"
    if prim_file.exists():
        with open(prim_file, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line:
                    item = json.loads(line)
                    key = f"{item['source']}->{item['target']}"
                    relations[key] = {
                        "source": item.get("source"),
                        "target": item.get("target"),
                        "votes": item.get("votes"),
                        "status": item.get("status"),
                        "classification": item.get("classification"),
                        "relation": item.get("relation"),
                        "reason": item.get("reason"),
                        "evidence": item.get("evidence", []),
                        "limitations": item.get("limitations"),
                        "reviewer": item.get("reviewer")
                    }

    out_file = OUTPUT_DIR / "theological_relations.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(relations, f, indent=2)
    print(f"Compiled {len(relations)} audited theological relations into {out_file} ({out_file.stat().st_size} bytes)")

def compile_identities():
    id_file = TOOLS_DIR / "audit-batch-identities.json"
    if id_file.exists():
        with open(id_file, "r", encoding="utf-8") as f:
            data = json.load(f)
        out_file = OUTPUT_DIR / "name_identities_audit.json"
        with open(out_file, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        print(f"Exported name identity audit findings into {out_file} ({out_file.stat().st_size} bytes)")


def compile_name_review():
    """Publish the complete reviewed ledger, keeping source texts immutable."""
    audit_dir = ROOT / 'audit'
    review = json.loads((audit_dir / 'name-review.json').read_text(encoding='utf-8'))
    context = json.loads((audit_dir / 'name-context-corrections.json').read_text(encoding='utf-8'))
    original = json.loads((OUTPUT_DIR / 'hitchcock_names.json').read_text(encoding='utf-8'))
    network = json.loads((OUTPUT_DIR / 'bible_network.json').read_text(encoding='utf-8'))
    network_names = {entry['name']: entry for entry in network['names']}
    expected = set(original) | set(network_names)
    entries = review['entries']
    if len(entries) != len(expected) or {entry['name'] for entry in entries} != expected:
        raise ValueError('Name review must contain every dictionary and network spelling exactly once')
    lexicon = {}
    for language in ('hebrew', 'greek'):
        text = (audit_dir / 'name-sources' / f'strongs-{language}-dictionary.js').read_text(encoding='utf-8-sig')
        match = re.search(r'(?:var|const)\s+strongs\w+Dictionary\s*=\s*', text)
        lexicon.update(json.JSONDecoder().raw_decode(text[match.end():].lstrip())[0])
    sources = json.loads((audit_dir / 'name-sources' / 'sources.json').read_text(encoding='utf-8'))
    for source in sources['files']:
        path = audit_dir / 'name-sources' / source['path']
        if hashlib.sha256(path.read_bytes()).hexdigest() != source['sha256']:
            raise ValueError(f"Source snapshot changed: {source['path']}")
    known_refs = {ref for name in network['names'] for ref in name['refs']}
    corpus = json.loads((OUTPUT_DIR / 'kjv_verses.json').read_text(encoding='utf-8'))
    # Reuse the existing canonical mapping instead of a competing inventory.
    spec = importlib.util.spec_from_file_location('crossref_builder', HERE / 'build-crossref-data.py')
    crossref_builder = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(crossref_builder)
    book_codes = dict(zip(dict.fromkeys(verse['book'] for verse in corpus), crossref_builder.CANON_DIVISIONS))
    current_refs = {f"{book_codes[v['book']]}.{v['chapter']}.{v['verse']}": v for v in corpus}
    known_refs.update(current_refs)
    enriched = []
    statuses = {}
    allowed = {'corroborated', 'disputed', 'uncertain', 'ambiguous', 'unmatched', 'not-name'}
    for entry in sorted(entries, key=lambda item: item['name'].casefold()):
        name = entry['name']
        if entry['status'] not in allowed or not entry['displayMeaning'] or not entry['note']:
            raise ValueError(f'Incomplete or unrecognized review: {name}')
        ids = list(dict.fromkeys(entry['strongsIds']))
        if any(key not in lexicon for key in ids):
            raise ValueError(f'Unknown Strong identifier: {name}')
        refs = list(dict.fromkeys(entry.get('scriptureRefs', [])))
        identity = context['identities'].get(name)
        if identity:
            refs = list(dict.fromkeys(identity['refs'] + refs))
        if any(ref not in known_refs for ref in refs):
            raise ValueError(f'Unknown Scripture reference in review: {name}')
        # Phalti is an explicitly split spelling from the original CSV's Phalti Palti entry.
        source_name = name if name in original else 'Phalti Palti'
        historical = original.get(source_name, {}).get('meanings', [network_names[name]['meaning']] if name in network_names else [])
        row = {**entry, 'scriptureRefs': refs, 'hitchcock': historical,
               'hitchcockEntry': source_name, 'claimClass': 'LEXICAL_NOTE',
               'strongs': [{'id': key, **lexicon[key]} for key in ids]}
        if identity:
            row['identity'] = {**identity, 'claimClass': 'SCRIPTURAL_INFERENCE'}
        enriched.append(row)
        statuses[entry['status']] = statuses.get(entry['status'], 0) + 1
    for name, refs in context['addedRefs'].items():
        if name not in expected or any(ref not in current_refs for ref in refs):
            raise ValueError(f'Unverified occurrence correction: {name}')
    for name, refs in context['excludedRefs'].items():
        if not set(refs).issubset(network_names[name]['refs']):
            raise ValueError(f'Excluded reference not in source node: {name}')
    payload = {'meta': {'revision': review['revision'], 'sourceStandard': review['sourceStandard'],
        'dictionaryEntries': len(original), 'sourceNetworkNames': len(network_names), 'reviewedEntries': len(enriched),
        'statuses': statuses, 'sources': sources, 'sourceHitchcockSha256': hashlib.sha256((OUTPUT_DIR / 'hitchcock_names.json').read_bytes()).hexdigest(),
        'sourceNetworkSha256': hashlib.sha256((OUTPUT_DIR / 'bible_network.json').read_bytes()).hexdigest(),
        'coverageNote': 'Every entry compared against the pinned lexical records; unresolved entries remain unresolved. Digital transcription, not a facsimile verification of every original printed page.',
        'license': 'Review annotations: CC BY-SA; OpenScriptures source excerpts retain their original CC-BY-SA headers and attribution. Original Strong dictionary text is public domain; Hitchcock digital source: CC BY 4.0.'},
        'entries': enriched, 'occurrences': {'added': context['addedRefs'], 'excluded': context['excludedRefs']}}
    encoded = json.dumps(payload, ensure_ascii=False, separators=(',', ':')).encode('utf-8')
    if len(encoded) > 5 * 1024 * 1024:
        raise ValueError('Published name audit exceeds 5 MiB size bound')
    (OUTPUT_DIR / 'name_audit.json').write_bytes(encoded)
    with (audit_dir / 'name-review.csv').open('w', newline='', encoding='utf-8-sig') as target:
        writer = csv.writer(target)
        writer.writerow(['Name', 'Review status', 'Display lexical note', 'KJV identity or context', 'Historical Hitchcock gloss', 'Review findings', 'Strong identifiers', 'KJV references'])
        for row in enriched:
            writer.writerow([row['name'], row['status'], row['displayMeaning'], row.get('identity', {}).get('text', ''), '; '.join(row['hitchcock']), row['note'], ', '.join(row['strongsIds']), ', '.join(row['scriptureRefs'])])
    print(f'Published {len(enriched)} name reviews ({len(encoded):,} bytes): {statuses}')

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--name-review', action='store_true', help='Compile only the complete name-review ledger')
    args = parser.parse_args()
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    if args.name_review:
        compile_name_review()
    else:
        compile_names()
        compile_audit_relations()
        compile_identities()
