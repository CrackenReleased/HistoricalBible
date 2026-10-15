import fs from 'fs';

function inspectPage(filename) {
  const html = fs.readFileSync('E:/HistoricalBible/assets/Web_Archive_20261014/' + filename, 'utf8');
  console.log('====================================');
  console.log('FILE:', filename);
  console.log('====================================');
  
  // Headings
  const headings = html.match(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi) || [];
  console.log('\n--- HEADINGS ---');
  headings.forEach(h => console.log('  ' + h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()));
  
  // Links
  const links = html.match(/<a[^>]+href=[\"'][^\"']+[\"'][^>]*>[\s\S]*?<\/a>/gi) || [];
  console.log('\n--- LINKS ---');
  const seenLinks = new Set();
  links.forEach(l => {
    const text = l.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const hrefMatch = l.match(/href=[\"']([^\"']+)[\"']/i);
    const href = hrefMatch ? hrefMatch[1] : '';
    const pair = text + ' -> ' + href;
    if (!seenLinks.has(pair) && text && text.length < 100) {
      seenLinks.add(pair);
      console.log('  [' + text + '] -> ' + href);
    }
  });

  // Paragraphs
  const paragraphs = html.match(/<p[^>]*>[\s\S]*?<\/p>/gi) || [];
  console.log('\n--- PARAGRAPHS ---');
  paragraphs.forEach(p => {
    const text = p.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (text.length > 10 && !text.includes('cookie') && !text.includes('Swooped')) {
      console.log('  ' + text);
    }
  });

  // Forms / Buttons
  const buttons = html.match(/<button[^>]*>[\s\S]*?<\/button>/gi) || [];
  console.log('\n--- BUTTONS ---');
  buttons.forEach(b => {
    const text = b.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (text) console.log('  Button: ' + text);
  });
}

inspectPage('Historical Bible - Faith and Religion, The Bible.html');
inspectPage('HistoricalBible.html');
inspectPage('Bible-download.html');
