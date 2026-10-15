/**
 * HistoricalBible.com/Interact — Main Application Orchestrator
 * Integrates:
 * - Local-First Cache Storage (0ms offline retrieval)
 * - Three.js 3D WebGL Arc Visualizer
 * - 2D Canvas Tapestry & Baseline Histogram
 * - Hitchcock Bible Names Entity Network
 * - Chapter Threads S-Curve Loom
 * - Audited Theological Relation Inspector with Bible.pdf page citations
 * - Boarderless Harmonic Web Audio Chimes (G3 196Hz)
 */
import { localStore, CrossRefLink } from './store/localFirstStore';
import { acousticEngine } from './audio/acousticEngine';
import { ThreeVisualizer } from './engine/threeVisualizer';

// 66 Canonical Books metadata
export const CANON_BOOKS = [
  { abbr: "Gen", name: "Genesis", chapters: 50, division: "Law", color: "#f87171" },
  { abbr: "Exod", name: "Exodus", chapters: 40, division: "Law", color: "#f87171" },
  { abbr: "Lev", name: "Leviticus", chapters: 27, division: "Law", color: "#f87171" },
  { abbr: "Num", name: "Numbers", chapters: 36, division: "Law", color: "#f87171" },
  { abbr: "Deut", name: "Deuteronomy", chapters: 34, division: "Law", color: "#f87171" },
  { abbr: "Josh", name: "Joshua", chapters: 24, division: "History", color: "#fb923c" },
  { abbr: "Judg", name: "Judges", chapters: 21, division: "History", color: "#fb923c" },
  { abbr: "Ruth", name: "Ruth", chapters: 4, division: "History", color: "#fb923c" },
  { abbr: "1Sam", name: "1 Samuel", chapters: 31, division: "History", color: "#fb923c" },
  { abbr: "2Sam", name: "2 Samuel", chapters: 24, division: "History", color: "#fb923c" },
  { abbr: "1Kgs", name: "1 Kings", chapters: 22, division: "History", color: "#fb923c" },
  { abbr: "2Kgs", name: "2 Kings", chapters: 25, division: "History", color: "#fb923c" },
  { abbr: "1Chr", name: "1 Chronicles", chapters: 29, division: "History", color: "#fb923c" },
  { abbr: "2Chr", name: "2 Chronicles", chapters: 36, division: "History", color: "#fb923c" },
  { abbr: "Ezra", name: "Ezra", chapters: 10, division: "History", color: "#fb923c" },
  { abbr: "Neh", name: "Nehemiah", chapters: 13, division: "History", color: "#fb923c" },
  { abbr: "Esth", name: "Esther", chapters: 10, division: "History", color: "#fb923c" },
  { abbr: "Job", name: "Job", chapters: 42, division: "Poetry", color: "#facc15" },
  { abbr: "Ps", name: "Psalms", chapters: 150, division: "Poetry", color: "#facc15" },
  { abbr: "Prov", name: "Proverbs", chapters: 31, division: "Poetry", color: "#facc15" },
  { abbr: "Eccl", name: "Ecclesiastes", chapters: 12, division: "Poetry", color: "#facc15" },
  { abbr: "Song", name: "Song of Solomon", chapters: 8, division: "Poetry", color: "#facc15" },
  { abbr: "Isa", name: "Isaiah", chapters: 66, division: "MajorProphets", color: "#a3e635" },
  { abbr: "Jer", name: "Jeremiah", chapters: 52, division: "MajorProphets", color: "#a3e635" },
  { abbr: "Lam", name: "Lamentations", chapters: 5, division: "MajorProphets", color: "#a3e635" },
  { abbr: "Ezek", name: "Ezekiel", chapters: 48, division: "MajorProphets", color: "#a3e635" },
  { abbr: "Dan", name: "Daniel", chapters: 12, division: "MajorProphets", color: "#a3e635" },
  { abbr: "Hos", name: "Hosea", chapters: 14, division: "MinorProphets", color: "#2dd4bf" },
  { abbr: "Joel", name: "Joel", chapters: 3, division: "MinorProphets", color: "#2dd4bf" },
  { abbr: "Amos", name: "Amos", chapters: 9, division: "MinorProphets", color: "#2dd4bf" },
  { abbr: "Obad", name: "Obadiah", chapters: 1, division: "MinorProphets", color: "#2dd4bf" },
  { abbr: "Jonah", name: "Jonah", chapters: 4, division: "MinorProphets", color: "#2dd4bf" },
  { abbr: "Mic", name: "Micah", chapters: 7, division: "MinorProphets", color: "#2dd4bf" },
  { abbr: "Nah", name: "Nahum", chapters: 3, division: "MinorProphets", color: "#2dd4bf" },
  { abbr: "Hab", name: "Habakkuk", chapters: 3, division: "MinorProphets", color: "#2dd4bf" },
  { abbr: "Zeph", name: "Zephaniah", chapters: 3, division: "MinorProphets", color: "#2dd4bf" },
  { abbr: "Hag", name: "Haggai", chapters: 2, division: "MinorProphets", color: "#2dd4bf" },
  { abbr: "Zech", name: "Zechariah", chapters: 14, division: "MinorProphets", color: "#2dd4bf" },
  { abbr: "Mal", name: "Malachi", chapters: 4, division: "MinorProphets", color: "#2dd4bf" },
  { abbr: "Matt", name: "Matthew", chapters: 28, division: "Gospels", color: "#22d3ee" },
  { abbr: "Mark", name: "Mark", chapters: 16, division: "Gospels", color: "#22d3ee" },
  { abbr: "Luke", name: "Luke", chapters: 24, division: "Gospels", color: "#22d3ee" },
  { abbr: "John", name: "John", chapters: 21, division: "Gospels", color: "#22d3ee" },
  { abbr: "Acts", name: "Acts", chapters: 28, division: "Acts", color: "#38bdf8" },
  { abbr: "Rom", name: "Romans", chapters: 16, division: "Pauline", color: "#818cf8" },
  { abbr: "1Cor", name: "1 Corinthians", chapters: 16, division: "Pauline", color: "#818cf8" },
  { abbr: "2Cor", name: "2 Corinthians", chapters: 13, division: "Pauline", color: "#818cf8" },
  { abbr: "Gal", name: "Galatians", chapters: 6, division: "Pauline", color: "#818cf8" },
  { abbr: "Eph", name: "Ephesians", chapters: 6, division: "Pauline", color: "#818cf8" },
  { abbr: "Phil", name: "Philippians", chapters: 4, division: "Pauline", color: "#818cf8" },
  { abbr: "Col", name: "Colossians", chapters: 4, division: "Pauline", color: "#818cf8" },
  { abbr: "1Thess", name: "1 Thessalonians", chapters: 5, division: "Pauline", color: "#818cf8" },
  { abbr: "2Thess", name: "2 Thessalonians", chapters: 3, division: "Pauline", color: "#818cf8" },
  { abbr: "1Tim", name: "1 Timothy", chapters: 6, division: "Pauline", color: "#818cf8" },
  { abbr: "2Tim", name: "2 Timothy", chapters: 4, division: "Pauline", color: "#818cf8" },
  { abbr: "Titus", name: "Titus", chapters: 3, division: "Pauline", color: "#818cf8" },
  { abbr: "Phlm", name: "Philemon", chapters: 1, division: "Pauline", color: "#818cf8" },
  { abbr: "Heb", name: "Hebrews", chapters: 13, division: "General", color: "#c084fc" },
  { abbr: "Jas", name: "James", chapters: 5, division: "General", color: "#c084fc" },
  { abbr: "1Pet", name: "1 Peter", chapters: 5, division: "General", color: "#c084fc" },
  { abbr: "2Pet", name: "2 Peter", chapters: 3, division: "General", color: "#c084fc" },
  { abbr: "1John", name: "1 John", chapters: 5, division: "General", color: "#c084fc" },
  { abbr: "2John", name: "2 John", chapters: 1, division: "General", color: "#c084fc" },
  { abbr: "3John", name: "3 John", chapters: 1, division: "General", color: "#c084fc" },
  { abbr: "Jude", name: "Jude", chapters: 1, division: "General", color: "#c084fc" },
  { abbr: "Rev", name: "Revelation", chapters: 22, division: "Revelation", color: "#f472b6" }
];

// Flatten all 1,189 chapters
export const ALL_CHAPTERS: Array<{ osis: string; book: string; chapter: number; division: string; color: string; globalIndex: number }> = [];
let chCounter = 0;
CANON_BOOKS.forEach(b => {
  for (let c = 1; c <= b.chapters; c++) {
    ALL_CHAPTERS.push({
      osis: `${b.abbr}.${c}`,
      book: b.name,
      chapter: c,
      division: b.division,
      color: b.color,
      globalIndex: chCounter++
    });
  }
});

class HistoricalBibleApp {
  private threeVis: ThreeVisualizer | null = null;
  private currentMode: '3d' | '2d' | 'threads' | 'names' = '3d';
  private selectedVerse: string = 'Gen.1.1';

  public async start() {
    this.setupUI();
    this.setupAudio();

    // Initialize local-first storage
    localStore.onProgress = (msg, pct) => {
      const bar = document.getElementById('local-progress-fill');
      const text = document.getElementById('local-progress-text');
      if (bar) bar.style.width = `${pct}%`;
      if (text) text.innerText = msg;
      if (pct >= 100) {
        setTimeout(() => {
          const banner = document.getElementById('local-telemetry-banner');
          if (banner) banner.classList.add('ready');
        }, 500);
      }
    };

    await localStore.init(false); // Curated bundle for instant 60 FPS load

    // Initialize 3D Visualizer
    const threeContainer = document.getElementById('three-container');
    if (threeContainer) {
      this.threeVis = new ThreeVisualizer(threeContainer);
      this.threeVis.buildCanonRing(ALL_CHAPTERS);
      this.threeVis.renderArcs(localStore.crossRefs, 6000);
      this.threeVis.start();
    }

    // Inspect initial verse (Genesis 1:1)
    this.inspectVerse('Gen.1.1');
  }

  private setupAudio() {
    const audioBtn = document.getElementById('btn-audio-toggle');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        const isMuted = acousticEngine.toggleMute();
        audioBtn.classList.toggle('muted', isMuted);
        audioBtn.innerText = isMuted ? '🔇 Audio Off' : '🔔 196Hz Harmonic Chimes On';
        if (!isMuted) {
          acousticEngine.playCanonicalResonance('Law', 0.1, 0.7);
        }
      });
    }
  }

  private setupUI() {
    // Mode switcher buttons
    const modeBtns = document.querySelectorAll<HTMLButtonElement>('.mode-toggle-btn');
    modeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.dataset.mode as '3d' | '2d' | 'threads' | 'names';
        this.switchMode(mode);
      });
    });

    // Omnibox search
    const omnibox = document.getElementById('omnibox-input') as HTMLInputElement;
    if (omnibox) {
      omnibox.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const val = omnibox.value.trim();
          this.searchPassage(val);
        }
      });
    }

    // Journey card buttons
    const journeyBtns = document.querySelectorAll<HTMLElement>('.journey-card');
    journeyBtns.forEach(card => {
      card.addEventListener('click', () => {
        const target = card.dataset.targetVerse || 'Gen.1.1';
        this.inspectVerse(target);
        this.closeModal('welcome-modal');
      });
    });

    // Close modal triggers
    const closeBtns = document.querySelectorAll<HTMLElement>('.modal-close');
    closeBtns.forEach(b => b.addEventListener('click', () => {
      this.closeModal('welcome-modal');
    }));
  }

  private switchMode(mode: '3d' | '2d' | 'threads' | 'names') {
    this.currentMode = mode;
    const threeWrap = document.getElementById('three-container');
    const canvas2dWrap = document.getElementById('canvas-2d-container');
    const threadsWrap = document.getElementById('threads-container');
    const namesWrap = document.getElementById('names-container');

    if (threeWrap) threeWrap.style.display = mode === '3d' ? 'block' : 'none';
    if (canvas2dWrap) canvas2dWrap.style.display = mode === '2d' ? 'block' : 'none';
    if (threadsWrap) threadsWrap.style.display = mode === 'threads' ? 'flex' : 'none';
    if (namesWrap) namesWrap.style.display = mode === 'names' ? 'block' : 'none';

    if (mode === '3d' && this.threeVis) {
      this.threeVis.start();
    } else if (this.threeVis) {
      this.threeVis.stop();
    }

    if (mode === 'names') {
      this.renderNamesNetwork();
    }
  }

  /**
   * Formats KJV scripture text to preserve:
   * 1. Translator-added words in brackets [...] (traditional KJV italics)
   * 2. The divine Tetragrammaton LORD (YHWH / Jehovah) in small-caps covenant styling
   */
  public formatScriptureHtml(raw: string): string {
    if (!raw) return '';
    let escaped = raw
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Translator-added words (traditional KJV italics) preserved in brackets [...]
    escaped = escaped.replace(/\[(.*?)\]/g, '<span class="kjv-added" title="Added by KJV translators for English readability (traditional italics)">[$1]</span>');

    // The divine Tetragrammaton יהוה (YHWH / Jehovah)
    escaped = escaped.replace(/\bLORD\b/g, '<span class="kjv-lord" title="The Tetragrammaton יהוה (YHWH / Jehovah)">LORD</span>');

    return escaped;
  }

  public inspectVerse(osisRef: string) {
    this.selectedVerse = osisRef;
    const drawerTitle = document.getElementById('drawer-verse-title');
    const drawerText = document.getElementById('drawer-verse-text');
    const linksList = document.getElementById('drawer-links-list');
    const auditCard = document.getElementById('drawer-audit-card');

    const parts = osisRef.split('.');
    const bookObj = CANON_BOOKS.find(b => b.abbr === parts[0]);
    const bookName = bookObj ? bookObj.name : parts[0];
    const formattedTitle = parts.length === 3 ? `${bookName} {${parts[1]}:${parts[2]}}` : osisRef;
    if (drawerTitle) drawerTitle.innerHTML = formattedTitle;
    
    // Get local scripture text from Joel's curated Bible corpus
    const text = localStore.getVerseText(osisRef) || "In the beginning God created the heaven and the earth.";
    if (drawerText) drawerText.innerHTML = `"${this.formatScriptureHtml(text)}"`;

    // Acoustic feedback
    acousticEngine.playCanonicalResonance('Law', 0.2, 0.5);

    // Get cross-references
    const refs = localStore.getCrossReferencesForVerse(osisRef);
    if (linksList) {
      linksList.innerHTML = '';
      if (refs.length === 0) {
        linksList.innerHTML = '<div class="no-links">No cross-reference records in curated subset.</div>';
      } else {
        refs.slice(0, 30).forEach(link => {
          const src = link.s || link.from || '';
          const tgt = link.t || link.to || '';
          const targetRef = src === osisRef ? tgt : src;
          const votes = link.v ?? link.votes ?? 0;
          const targetText = localStore.getVerseText(targetRef);
          const rel = localStore.getTheologicalRelation(osisRef, targetRef);

          const targetParts = targetRef.split('.');
          const targetBookObj = CANON_BOOKS.find(b => b.abbr === targetParts[0]);
          const targetBookName = targetBookObj ? targetBookObj.name : targetParts[0];
          const targetTitle = targetParts.length === 3 ? `${targetBookName} {${targetParts[1]}:${targetParts[2]}}` : targetRef;

          const card = document.createElement('div');
          card.className = `ref-card ${rel ? 'has-audit' : ''}`;
          card.innerHTML = `
            <div class="ref-header">
              <span class="ref-osis">${targetTitle}</span>
              <span class="ref-votes">★ ${votes} votes</span>
              ${rel ? `<span class="badge badge-${rel.classification}">${rel.classification.toUpperCase()}</span>` : ''}
            </div>
            <div class="ref-text">${targetText ? `"${this.formatScriptureHtml(targetText)}"` : ''}</div>
            ${rel ? `
              <div class="audit-badge-pill">
                <strong>Theological Relation:</strong> ${rel.relation}
              </div>
              <div class="audit-reason">${rel.reason}</div>
              ${rel.evidence.length > 0 ? `
                <div class="audit-pdf-cite">
                  📖 Verified against <code>Bible.pdf</code> (Page ${rel.evidence[0].pdf_page})
                </div>
              ` : ''}
            ` : ''}
          `;
          card.addEventListener('click', () => {
            acousticEngine.playCanonicalResonance('Poetry', 0.5, 0.4);
            this.inspectVerse(targetRef);
          });
          linksList.appendChild(card);
        });
      }
    }

    // Top theological audit badge for Genesis 1:1 or audited source
    if (auditCard) {
      const topRel = localStore.getTheologicalRelation(osisRef, 'Ps.115.15') || 
                     localStore.getTheologicalRelation(osisRef, 'Rom.11.36') || 
                     localStore.getTheologicalRelation(osisRef, 'Heb.1.2');
      if (topRel) {
        auditCard.style.display = 'block';
        auditCard.innerHTML = `
          <div class="audit-flag-header">
            <span class="badge badge-supported">AUDITED THEOLOGICAL EVIDENCE</span>
            <span class="audit-reviewer">Reviewer: ${topRel.reviewer}</span>
          </div>
          <h4>${topRel.relation}</h4>
          <p>${topRel.reason}</p>
        `;
      } else {
        auditCard.style.display = 'none';
      }
    }
  }

  private searchPassage(query: string) {
    if (!query) return;
    const clean = query.trim().replace(' ', '.').replace(':', '.');
    // Basic match
    if (localStore.getVerseText(clean)) {
      this.inspectVerse(clean);
      return;
    }
    // Search in names
    const nameMatch = localStore.getNameMeaning(query);
    if (nameMatch) {
      alert(`Biblical Name Found: ${nameMatch.name}\nMeanings: ${nameMatch.meanings.join('; ')}`);
      return;
    }
    // Default to Gen 1:1 if not found
    this.inspectVerse('Gen.1.1');
  }

  private renderNamesNetwork() {
    const container = document.getElementById('names-container');
    if (!container) return;
    const names = Object.values(localStore.hitchcockNames).slice(0, 150);
    container.innerHTML = `
      <div class="names-grid">
        ${names.map(n => `
          <div class="name-card">
            <h3>${n.name}</h3>
            <p>${n.meanings.join(' · ')}</p>
          </div>
        `).join('')}
      </div>
    `;
  }

  private closeModal(id: string) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  }
}

function boot() {
  const app = new HistoricalBibleApp();
  (window as any).app = app;
  app.start();
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
