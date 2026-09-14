const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const htmlPath = path.join(__dirname, 'index.html');

const pageFiles = [
  '01_login.html', '02_meta-connect.html', '03_onboarding.html', '04_dashboard.html', 
  '05_calendar.html', '06_format.html', '07_objective.html', '08_weekly.html', 
  '09_media.html', '10_preview.html', '11_generated.html', '12_stories-detail.html', 
  '13_final-export.html'
];

const pageIds = [
  'login', 'meta-connect', 'onboarding', 'dashboard', 'calendar',
  'format', 'objective', 'weekly', 'media', 'preview',
  'generated', 'stories-detail', 'final-export'
];

const layoutContent = fs.readFileSync(path.join(__dirname, 'src', 'layout.html'), 'utf8');

let pagesContent = '';
pageFiles.forEach((file, idx) => {
  const content = fs.readFileSync(path.join(pagesDir, file), 'utf8');
  const pName = pageIds[idx];
  const activeClass = idx === 0 ? 'active' : '';
  pagesContent += '\n<!-- SECTION ' + (idx+1) + ': ' + pName + ' -->\n';
  pagesContent += '<div id="page-' + pName + '" class="page-view ' + activeClass + ' w-full">\n';
  pagesContent += '  <div class="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-6 w-full flex flex-col">\n';
  pagesContent += content + '\n';
  pagesContent += '  </div>\n';
  pagesContent += '</div>\n';
});

const finalHtml = layoutContent.replace('<!-- CONTENT_PLACEHOLDER -->', pagesContent);
fs.writeFileSync(htmlPath, finalHtml, 'utf8');
console.log('index.html re-built successfully with clean layout file!');
