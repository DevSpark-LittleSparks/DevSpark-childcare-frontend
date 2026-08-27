const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

let modified = 0;
walkDir('./src/pages', (filePath) => {
  if (!filePath.endsWith('.tsx')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Root wrapper - wait, I need to make sure I don't double replace
  if (!content.includes('dark:bg-slate-950')) {
    content = content.replace(/bg-surface-secondary(\s+)font-sans(\s+)text-slate-900/g, 'bg-surface-secondary dark:bg-slate-950 transition-colors duration-300 font-sans text-slate-900 dark:text-slate-100');
  }
  
  // 2. Main white cards
  content = content.replace(/className="([^"]*?)bg-white([^"]*?)"/g, (match, p1, p2) => {
    if (p1.includes('dark:bg-') || p2.includes('dark:bg-')) return match;
    let newClass = `className="${p1}bg-white dark:bg-[#0f172a]${p2}"`;
    if (newClass.includes('border-slate-100') && !newClass.includes('dark:border-')) {
       newClass = newClass.replace('border-slate-100', 'border-slate-100 dark:border-slate-800/60');
    }
    return newClass;
  });
  
  // 3. Texts
  content = content.replace(/className="([^"]*?)text-slate-900([^"]*?)"/g, (match, p1, p2) => {
    if (p1.includes('dark:text-') || p2.includes('dark:text-')) return match;
    return `className="${p1}text-slate-900 dark:text-white${p2}"`;
  });
  
  content = content.replace(/className="([^"]*?)text-midnight([^"]*?)"/g, (match, p1, p2) => {
    if (p1.includes('dark:text-') || p2.includes('dark:text-')) return match;
    return `className="${p1}text-midnight dark:text-white${p2}"`;
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Updated', filePath);
    modified++;
  }
});
console.log('Modified', modified, 'files');
