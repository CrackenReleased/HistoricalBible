const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const archiveDir = 'E:/HistoricalBible/assets/Web_Archive_20261014';
const folders = [
  'Historical Bible - Faith and Religion, The Bible_files',
  'HistoricalBible_files',
  'Bible-download_files'
];

for (const folder of folders) {
  const src = path.join(archiveDir, folder);
  const destRoot = path.join('E:/HistoricalBible', folder);
  const destPublic = path.join('E:/HistoricalBible/public', folder);
  
  console.log('Copying', folder, 'to root and public...');
  copyDir(src, destRoot);
  copyDir(src, destPublic);
}

console.log('Asset folders successfully copied to root and public!');
