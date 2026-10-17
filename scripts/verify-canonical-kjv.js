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
const malformedBracketVerses = [];
const seenCoordinates = new Set();
const seenBooks = new Set();
const seenChapters = new Set();

function hasBalancedNonNestedBrackets(text) {
  let depth = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '[') {
      depth++;
      if (depth > 1) return false;
      if (text[i + 1] === ']') return false;
    } else if (ch === ']') {
      depth--;
      if (depth < 0) return false;
    }
  }
  return depth === 0;
}

for (const v of verses) {
  if (!v.book || !Number.isInteger(v.chapter) || !Number.isInteger(v.verse) || typeof v.text !== 'string' || v.text.trim().length === 0) {
    throw new Error(`FAIL-CLOSED: Malformed verse record at ${JSON.stringify(v)}`);
  }
  const coord = `${v.book}.${v.chapter}.${v.verse}`;
  if (seenCoordinates.has(coord)) {
    throw new Error(`FAIL-CLOSED: Duplicate verse coordinate ${coord}`);
  }
  seenCoordinates.add(coord);
  seenBooks.add(v.book);
  seenChapters.add(`${v.book}.${v.chapter}`);

  if (!hasBalancedNonNestedBrackets(v.text)) {
    malformedBracketVerses.push(`${v.book} ${v.chapter}:${v.verse} -> ${v.text}`);
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

if (seenBooks.size !== 66) {
  throw new Error(`FAIL-CLOSED: Expected 66 canonical books, found ${seenBooks.size}`);
}
if (seenChapters.size !== 1189) {
  throw new Error(`FAIL-CLOSED: Expected 1,189 canonical chapters, found ${seenChapters.size}`);
}
if (malformedBracketVerses.length > 0) {
  throw new Error(`FAIL-CLOSED: Detected ${malformedBracketVerses.length} verses with unbalanced or nested brackets:\n  ${malformedBracketVerses.join('\n  ')}`);
}
if (bracketedItalicsCount !== 14138) {
  throw new Error(`FAIL-CLOSED: Bracketed translator italics [...] count mismatch (${bracketedItalicsCount}). Expected exact canonical count 14,138 verses.`);
}
if (divineLordCount !== 5556) {
  throw new Error(`FAIL-CLOSED: Divine name LORD count mismatch (${divineLordCount}). Expected exact canonical count 5,556 verses.`);
}
if (pageArtifactLeaks > 0) {
  throw new Error(`FAIL-CLOSED: Detected ${pageArtifactLeaks} uncleaned PDF page header leaks in kjv_verses.json.`);
}

console.log(`[verify-canonical-kjv] PASS: ${verses.length} verses across ${seenBooks.size} books and ${seenChapters.size} chapters verified.`);
console.log(`[verify-canonical-kjv] Invariants confirmed: ${bracketedItalicsCount} verses with balanced [...] translator italics; ${divineLordCount} verses with cased LORD.`);

