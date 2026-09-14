const fs = require('fs');
const path = require('path');

['src', 'src/pages', 'src/components', 'public'].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const content = fs.readFileSync('index.txt', 'utf8');
const snippets = content.split('<!DOCTYPE html>');

const pageNames = [
  '01_login', '02_meta-connect', '03_onboarding', '04_dashboard', '05_calendar',
  '06_format', '07_objective', '08_weekly', '09_media', '10_preview',
  '11_generated', '12_stories-detail', '13_final-export'
];

snippets.slice(1).forEach((s, idx) => {
  const match = s.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let bodyContent = match ? match[1] : s;
  
  // Clean up `<main class="flex flex-col relative w-full bg-surface flex-grow">`
  // We'll provide a central `<main>` in our new master layout.
  bodyContent = bodyContent.replace(/<main[^>]*>/, '').replace(/<\/main>/, '');

  const pName = pageNames[idx] || ('page_' + idx);
  fs.writeFileSync(path.join('src', 'pages', pName + '.html'), bodyContent.trim(), 'utf8');
});

console.log('Split completed!');
