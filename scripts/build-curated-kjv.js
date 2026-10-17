/**
 * scripts/build-curated-kjv.js
 * Fail-Closed Canonical KJV Builder for HistoricalBible.com
 * Ensures public/data/kjv_verses.json is built strictly from the authoritative
 * Bible.pdf extraction (31,102 verses) without silently falling back to external KJV editions.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const auditPath = process.env.BIBLE_AUDIT_PATH || 'E:/AI_Hub/Tools/bible-network/audit-context.json';
const currentKjvPath = path.resolve(__dirname, '../public/data/kjv_verses.json');
const discrepancyReportPath = path.resolve(__dirname, '../public/data/kjv_reconciliation_report.json');

const OSIS_TO_BOOK_NAME = {
  'Gen': 'Genesis', 'Exod': 'Exodus', 'Lev': 'Leviticus', 'Num': 'Numbers', 'Deut': 'Deuteronomy',
  'Josh': 'Joshua', 'Judg': 'Judges', 'Ruth': 'Ruth', '1Sam': '1 Samuel', '2Sam': '2 Samuel',
  '1Kgs': '1 Kings', '2Kgs': '2 Kings', '1Chr': '1 Chronicles', '2Chr': '2 Chronicles',
  'Ezra': 'Ezra', 'Neh': 'Nehemiah', 'Esth': 'Esther', 'Job': 'Job', 'Ps': 'Psalms',
  'Prov': 'Proverbs', 'Eccl': 'Ecclesiastes', 'Song': 'Song of Solomon', 'Isa': 'Isaiah',
  'Jer': 'Jeremiah', 'Lam': 'Lamentations', 'Ezek': 'Ezekiel', 'Dan': 'Daniel',
  'Hos': 'Hosea', 'Joel': 'Joel', 'Amos': 'Amos', 'Obad': 'Obadiah', 'Jonah': 'Jonah',
  'Mic': 'Micah', 'Nah': 'Nahum', 'Hab': 'Habakkuk', 'Zeph': 'Zephaniah', 'Hag': 'Haggai',
  'Zech': 'Zechariah', 'Mal': 'Malachi', 'Matt': 'Matthew', 'Mark': 'Mark', 'Luke': 'Luke',
  'John': 'John', 'Acts': 'Acts', 'Rom': 'Romans', '1Cor': '1 Corinthians', '2Cor': '2 Corinthians',
  'Gal': 'Galatians', 'Eph': 'Ephesians', 'Phil': 'Philippians', 'Col': 'Colossians',
  '1Thess': '1 Thessalonians', '2Thess': '2 Thessalonians', '1Tim': '1 Timothy', '2Tim': '2 Timothy',
  'Titus': 'Titus', 'Phlm': 'Philemon', 'Heb': 'Hebrews', 'Jas': 'James', '1Pet': '1 Peter',
  '2Pet': '2 Peter', '1John': '1 John', '2John': '2 John', '3John': '3 John', 'Jude': 'Jude',
  'Rev': 'Revelation'
};

const cleanHeader = (text) => {
  return String(text || '')
    .replace(/\s*(?:(?:\d+\s+Kings|Exodus|Numbers|Esther|Job|Micah|[A-Z][a-z]+)\s+Page\s+\d+|Page\s+\d+\s+(?:\d+\s+Kings|Exodus|Numbers|Esther|Job|Micah|[A-Z][a-z]+))/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
};

if (!fs.existsSync(auditPath)) {
  console.log(`[build-curated-kjv] Authoritative source ${auditPath} not mounted on this host.`);
  console.log(`[build-curated-kjv] Skipping rebuild and delegating to verify-canonical-kjv.js.`);
  process.exit(0);
}

console.log(`[build-curated-kjv] Reading authoritative extraction from ${auditPath}...`);
const auditData = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
const existingKjvRaw = fs.existsSync(currentKjvPath)
  ? JSON.parse(fs.readFileSync(currentKjvPath, 'utf8'))
  : [];

// Normalise input verses from auditData (either kjv_verses array or verses dictionary)
let rawAuditList = [];
if (Array.isArray(auditData.kjv_verses) && auditData.kjv_verses.length > 0) {
  rawAuditList = auditData.kjv_verses;
} else if (auditData.verses && typeof auditData.verses === 'object') {
  for (const [key, text] of Object.entries(auditData.verses)) {
    const parts = key.split('.');
    const osisBook = parts[0];
    const chapter = Number(parts[1]);
    const verse = Number(parts[2]);
    const book = OSIS_TO_BOOK_NAME[osisBook] || osisBook;
    rawAuditList.push({ book, chapter, verse, text, osisKey: key });
  }
} else {
  throw new Error('FAIL-CLOSED ABORT: audit-context.json does not contain a valid kjv_verses array or verses dictionary.');
}

if (rawAuditList.length !== 31102) {
  throw new Error(`FAIL-CLOSED ABORT: Unexpected authoritative verse count ${rawAuditList.length}. Expected 31,102.`);
}

const auditVerseMap = new Map();
const canonicalOutput = [];

for (const item of rawAuditList) {
  const book = String(item.book || '').trim();
  const chapter = Number(item.chapter);
  const verse = Number(item.verse);
  const cleanedText = cleanHeader(item.text);

  if (!book || !Number.isInteger(chapter) || !Number.isInteger(verse) || !cleanedText) {
    throw new Error(`FAIL-CLOSED ABORT: Invalid canonical verse entry at ${book} ${chapter}:${verse}`);
  }

  const key = `${book}_${chapter}_${verse}`;
  auditVerseMap.set(key, cleanedText);
  canonicalOutput.push({ book, chapter, verse, text: cleanedText });
}

// Convert existing KJV (array or legacy object) into comparison records
const existingKjvList = [];
if (Array.isArray(existingKjvRaw)) {
  for (const item of existingKjvRaw) {
    existingKjvList.push(item);
  }
} else if (existingKjvRaw && existingKjvRaw.verses && typeof existingKjvRaw.verses === 'object') {
  for (const [key, text] of Object.entries(existingKjvRaw.verses)) {
    const parts = key.split('.');
    const osisBook = parts[0];
    const chapter = Number(parts[1]);
    const verse = Number(parts[2]);
    const book = OSIS_TO_BOOK_NAME[osisBook] || osisBook;
    existingKjvList.push({ book, chapter, verse, text });
  }
}

const extraInExisting = [];
for (const item of existingKjvList) {
  const key = `${item.book}_${item.chapter}_${item.verse}`;
  if (!auditVerseMap.has(key)) {
    extraInExisting.push({
      key,
      book: item.book,
      chapter: item.chapter,
      verse: item.verse,
      text: item.text
    });
  }
}

const report = {
  timestamp: new Date().toISOString(),
  authoritativeVerseCount: canonicalOutput.length,
  previousDatasetVerseCount: existingKjvList.length,
  extraVersesRemovedFromExternalFallback: extraInExisting
};

fs.writeFileSync(currentKjvPath, JSON.stringify(canonicalOutput, null, 2), 'utf8');
fs.writeFileSync(discrepancyReportPath, JSON.stringify(report, null, 2), 'utf8');

console.log(`[build-curated-kjv] Authoritative canonical verses written: ${canonicalOutput.length}`);
console.log(`[build-curated-kjv] External fallback verses purged: ${extraInExisting.length}`);
if (extraInExisting.length > 0) {
  console.log('[build-curated-kjv] Purged external verse keys:', extraInExisting.map(e => e.key).join(', '));
}
