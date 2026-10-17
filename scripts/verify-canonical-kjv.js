/**
 * scripts/verify-canonical-kjv.js
 * Fail-closed verification gate for public/data/kjv_verses.json.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const kjvPath = path.resolve(__dirname, '../public/data/kjv_verses.json');
const pdfPath = path.resolve(__dirname, '../Bible.pdf');

if (!fs.existsSync(kjvPath)) {
  throw new Error(`FAIL-CLOSED: Missing ${kjvPath}`);
}
if (!fs.existsSync(pdfPath)) {
  throw new Error(`FAIL-CLOSED: Missing canonical ${pdfPath} in repository root`);
}

const verses = JSON.parse(fs.readFileSync(kjvPath, 'utf8'));
if (!Array.isArray(verses) || verses.length !== 31102) {
  throw new Error(`FAIL-CLOSED: Unexpected verse count ${verses.length} in kjv_verses.json. Expected 31,102 canonical KJV verses.`);
}

let bracketedItalicsCount = 0;
let divineLordCount = 0;
let pageArtifactLeaks = 0;

for (const v of verses) {
  if (!v.book || !Number.isInteger(v.chapter) || !Number.isInteger(v.verse) || typeof v.text !== 'string' || v.text.trim().length === 0) {
    throw new Error(`FAIL-CLOSED: Malformed verse record at ${JSON.stringify(v)}`);
  }
  if (/\[[^\]]+\]/.test(v.text)) {
    bracketedItalicsCount++;
  }
  if (/\bLORD\b/.test(v.text)) {
    divineLordCount++;
  }
  if (/\bPage\s+\d+\b/.test(v.text)) {
    pageArtifactLeaks++;
  }
}

if (bracketedItalicsCount < 10000) {
  throw new Error(`FAIL-CLOSED: Bracketed translator italics [...] count too low (${bracketedItalicsCount}). Expected >10,000 verses.`);
}
if (divineLordCount < 5000) {
  throw new Error(`FAIL-CLOSED: Divine name LORD count too low (${divineLordCount}). Expected >5,000 verses.`);
}
if (pageArtifactLeaks > 0) {
  throw new Error(`FAIL-CLOSED: Detected ${pageArtifactLeaks} uncleaned PDF page header leaks in kjv_verses.json.`);
}

console.log(`[verify-canonical-kjv] PASS: ${verses.length} verses verified.`);
console.log(`[verify-canonical-kjv] Invariants confirmed: ${bracketedItalicsCount} verses with [...] translator italics; ${divineLordCount} verses with cased LORD.`);
