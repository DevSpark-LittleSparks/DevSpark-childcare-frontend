const fs = require('fs');
const path = require('path');

const files = [
  './src/components/layout/AdminSidebar.tsx',
  './src/components/layout/TeacherSidebar.tsx'
];

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Logo SVG
  content = content.replace(/fill="#1F2937" stroke="#1F2937"/g, 'className="fill-slate-800 stroke-slate-800 dark:fill-white dark:stroke-white"');
  
  // 2. Logo text
  content = content.replace(/text-\[#1F2937\]"/g, 'text-[#1F2937] dark:text-white"');

  // 3. Toggle button
  content = content.replace(/text-slate-500 hover:text-slate-700 hover:bg-white\/60/g, 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/60');

  // 4. SidebarLink Active/Inactive
  content = content.replace(/bg-\[#CFFAFE\] text-\[#0891B2\] shadow-sm/g, 'bg-[#CFFAFE] dark:bg-cyan-900/40 text-[#0891B2] dark:text-cyan-400 shadow-sm');
  content = content.replace(/text-slate-500 hover:bg-white\/60 hover:text-slate-700/g, 'text-slate-500 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800/50 hover:text-slate-700 dark:hover:text-white');
  content = content.replace(/text-slate-500 hover:bg-white\/60"/g, 'text-slate-500 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800/50"');

  // 5. NavGroup Title & Divider
  content = content.replace(/text-cyan-600\/60 uppercase/g, 'text-cyan-600/60 dark:text-slate-500 uppercase');
  content = content.replace(/bg-cyan-200\/30 mb-4/g, 'bg-cyan-200/30 dark:bg-slate-800/50 mb-4');

  // 6. User Profile Border
  content = content.replace(/border-t border-cyan-200\/30 relative/g, 'border-t border-cyan-200/30 dark:border-slate-800/50 relative');

  // 7. Profile Dropdown Modal
  content = content.replace(/bg-white rounded-2xl p-2 shadow-2xl border border-slate-100/g, 'bg-white dark:bg-slate-800 rounded-2xl p-2 shadow-2xl border border-slate-100 dark:border-slate-700');
  
  // Modal buttons
  content = content.replace(/text-slate-600 hover:bg-slate-50/g, 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50');
  content = content.replace(/bg-slate-100 my-1/g, 'bg-slate-100 dark:bg-slate-700 my-1');
  content = content.replace(/text-red-500 hover:bg-red-50/g, 'text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30');

  // 8. Profile Trigger (closed/open)
  content = content.replace(/bg-white shadow-md border-cyan-200/g, 'bg-white dark:bg-slate-800 shadow-md border-cyan-200 dark:border-slate-700');
  content = content.replace(/hover:bg-white\/50 border-transparent/g, 'hover:bg-white/50 dark:hover:bg-slate-800/50 border-transparent');
  content = content.replace(/border-2 border-white/g, 'border-2 border-white dark:border-slate-700');
  content = content.replace(/text-slate-800 truncate/g, 'text-slate-800 dark:text-white truncate');
  content = content.replace(/text-cyan-600 uppercase/g, 'text-cyan-700 dark:text-cyan-400 uppercase');
  content = content.replace(/text-cyan-700 uppercase/g, 'text-cyan-700 dark:text-cyan-400 uppercase');

  // 9. Root sidebar bg
  content = content.replace(/bg-\[#E4F7F7\]/g, 'bg-[#E4F7F7] dark:bg-slate-900');
  content = content.replace(/border-cyan-100 shadow-sm/g, 'border-cyan-100 dark:border-slate-800 shadow-sm');
  content = content.replace(/border-cyan-200\/30 mb-2/g, 'border-cyan-200/30 dark:border-slate-800/50 mb-2');

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Updated', filePath);
  }
});
