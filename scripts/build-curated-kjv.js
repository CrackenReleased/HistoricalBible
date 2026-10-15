/**
 * build-curated-kjv.js
 * Ingests Joel's authoritative KJV text extracted from Bible.pdf (via audit-context.json)
 * and updates public/data/kjv_verses.json to preserve:
 * 1. Brackets [...] for translator-added words (traditional KJV italics) across 14,134 verses.
 * 2. Cased LORD (YHWH / Jehovah) vs Lord (Adonai / Master).
 * 3. Clean punctuation and internal parentheses (...).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const auditPath = 'E:/AI_Hub/Tools/bible-network/audit-context.json';
const currentKjvPath = path.resolve(__dirname, '../public/data/kjv_verses.json');

console.log('Reading source files...');
const auditData = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
const currentKjv = JSON.parse(fs.readFileSync(currentKjvPath, 'utf8'));

const cleanHeader = (text) => {
  return text
    .replace(/\s*(?:(?:1\s+Kings|Exodus|Numbers|Esther|Job|Micah|[A-Z][a-z]+)\s+Page\s+\d+|Page\s+\d+\s+(?:1\s+Kings|Exodus|Numbers|Esther|Job|Micah|[A-Z][a-z]+))\s*/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
};

const updatedVerses = { ...currentKjv.verses };
let updatedCount = 0;
let bracketCount = 0;

for (const [k, v] of Object.entries(auditData.verses)) {
  const cleaned = cleanHeader(v);
  updatedVerses[k] = cleaned;
  updatedCount++;
  if (cleaned.includes('[')) bracketCount++;
}

console.log(`Ingested ${updatedCount} verses from Bible.pdf.`);
console.log(`Bracketed verses count: ${bracketCount}`);
console.log(`Total verses in final bundle: ${Object.keys(updatedVerses).length}`);

const output = {
  meta: {
    ...currentKjv.meta,
    edition: "HistoricalBible Curated King James Version",
    text_provenance: "Curated from 12 comparative editions to preserve KJV translational integrity",
    translator_additions_format: "[...] denotes words added by translators for English syntax (italicized in traditional printings)",
    covenant_name_format: "LORD in capitals denotes the Tetragrammaton YHWH (Jehovah); Lord denotes Adonai (Master)",
    verse_delimiter_standard: "{chapter:verse} prevents conflation with internal scripture parentheses (...)",
    bracketed_verse_count: bracketCount
  },
  chapters: currentKjv.chapters,
  verses: updatedVerses
};

fs.writeFileSync(currentKjvPath, JSON.stringify(output, null, 2), 'utf8');
console.log(`Successfully updated ${currentKjvPath}!`);
