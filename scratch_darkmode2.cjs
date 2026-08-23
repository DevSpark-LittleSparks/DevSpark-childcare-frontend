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

  // Enhance text contrast
  content = content.replace(/text-slate-400([^"a-z])/g, (match, p1) => {
    if (match.includes('dark:text-')) return match;
    return `text-slate-400 dark:text-slate-500${p1}`;
  });

  content = content.replace(/text-slate-500([^"a-z])/g, (match, p1) => {
    if (match.includes('dark:text-')) return match;
    return `text-slate-500 dark:text-slate-400${p1}`;
  });

  content = content.replace(/text-slate-600([^"a-z])/g, (match, p1) => {
    if (match.includes('dark:text-')) return match;
    return `text-slate-600 dark:text-slate-300${p1}`;
  });

  content = content.replace(/text-slate-700([^"a-z])/g, (match, p1) => {
    if (match.includes('dark:text-')) return match;
    return `text-slate-700 dark:text-slate-300${p1}`;
  });

  content = content.replace(/text-slate-800([^"a-z])/g, (match, p1) => {
    if (match.includes('dark:text-')) return match;
    return `text-slate-800 dark:text-slate-200${p1}`;
  });

  // Backgrounds and Hover Backgrounds
  content = content.replace(/hover:bg-slate-50([^"a-z])/g, (match, p1) => {
    if (match.includes('dark:hover:bg-')) return match;
    return `hover:bg-slate-50 dark:hover:bg-slate-800/50${p1}`;
  });

  content = content.replace(/bg-slate-50([^"a-z])/g, (match, p1) => {
    if (match.includes('dark:bg-') || match.includes('hover:')) return match;
    return `bg-slate-50 dark:bg-slate-800/40${p1}`;
  });

  // Borders
  content = content.replace(/border-slate-50([^"a-z])/g, (match, p1) => {
    if (match.includes('dark:border-')) return match;
    return `border-slate-50 dark:border-slate-800/60${p1}`;
  });

  content = content.replace(/border-slate-100([^"a-z])/g, (match, p1) => {
    if (match.includes('dark:border-')) return match;
    return `border-slate-100 dark:border-slate-800/60${p1}`;
  });

  content = content.replace(/border-slate-200([^"a-z])/g, (match, p1) => {
    if (match.includes('dark:border-')) return match;
    return `border-slate-200 dark:border-slate-700/60${p1}`;
  });

  // Modal/Dropdown backgrounds that were missed (bg-white shadow-2xl etc)
  content = content.replace(/bg-white([^"]*?)shadow-2xl([^"]*?)/g, (match, p1, p2) => {
    if (match.includes('dark:bg-')) return match;
    return `bg-white dark:bg-[#0f172a]${p1}shadow-2xl dark:border dark:border-slate-800/60${p2}`;
  });
  
  // Update StatCard in AdminDashboard
  if (filePath.includes('AdminDashboard.tsx')) {
    content = content.replace(/className={\`bg-white p-8 rounded-\[\2\.5rem\] border border-slate-100/g, 'className={`bg-white dark:bg-[#0f172a] p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/60');
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Updated', filePath);
    modified++;
  }
});
console.log('Modified', modified, 'files');
