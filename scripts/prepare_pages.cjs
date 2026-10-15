const fs = require('fs');
const path = require('path');

const archiveDir = 'E:/HistoricalBible/assets/Web_Archive_20261014';

function cleanHtml(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 1. Cut off after </body></html>
  const bodyClose = content.indexOf('</body>');
  if (bodyClose !== -1) {
    const htmlClose = content.indexOf('</html>', bodyClose);
    if (htmlClose !== -1) {
      content = content.substring(0, htmlClose + 7) + '\n';
    } else {
      content = content.substring(0, bodyClose + 7) + '</html>\n';
    }
  }
  
  // 2. Normalize links
  content = content.replace(/https:\/\/historicalbible\.com\/contact/g, '/contact');
  content = content.replace(/https:\/\/historicalbible\.com\/bible/g, '/bible');
  content = content.replace(/https:\/\/historicalbible\.com\/#/g, '#');
  content = content.replace(/https:\/\/historicalbible\.com\//g, '/');
  
  // 3. Normalize Bible download link
  content = content.replace(/https:\/\/img1\.wsimg\.com\/blobby\/go\/060fa488-4bff-4271-ae7e-4c93a781bf7f\/downloads\/Bible\.pdf\?ver=\d+/g, '/Bible.pdf');

  // 4. Update asset references from ./folder to /folder so they resolve from subpaths as well
  content = content.replace(/\.\/Historical Bible - Faith and Religion, The Bible_files\//g, '/Historical Bible - Faith and Religion, The Bible_files/');
  content = content.replace(/\.\/HistoricalBible_files\//g, '/HistoricalBible_files/');
  content = content.replace(/\.\/Bible-download_files\//g, '/Bible-download_files/');

  return content;
}

const homeHtml = cleanHtml(path.join(archiveDir, 'Historical Bible - Faith and Religion, The Bible.html'));
const contactHtml = cleanHtml(path.join(archiveDir, 'HistoricalBible.html'));
const bibleHtml = cleanHtml(path.join(archiveDir, 'Bible-download.html'));

fs.writeFileSync('E:/HistoricalBible/index.html', homeHtml, 'utf8');
console.log('Wrote index.html (' + homeHtml.length + ' bytes)');

fs.writeFileSync('E:/HistoricalBible/contact.html', contactHtml, 'utf8');
fs.writeFileSync('E:/HistoricalBible/contact/index.html', contactHtml, 'utf8');
console.log('Wrote contact.html & contact/index.html (' + contactHtml.length + ' bytes)');

fs.writeFileSync('E:/HistoricalBible/bible.html', bibleHtml, 'utf8');
fs.writeFileSync('E:/HistoricalBible/bible/index.html', bibleHtml, 'utf8');
console.log('Wrote bible.html & bible/index.html (' + bibleHtml.length + ' bytes)');
