#!/usr/bin/env python3
"""
Compiles Hitchcock's Bible Names Dictionary and ChatGPT's theological audit batches
into optimized JSON bundles for HistoricalBible.com/Interact.
"""
import csv
import json
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

if __name__ == "__main__":
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    compile_names()
    compile_audit_relations()
    compile_identities()
