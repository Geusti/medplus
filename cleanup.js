const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  // Let's only apply to 05 through 13
  const num = parseInt(file.split('_')[0], 10);
  if (num >= 5 && num <= 13) {
    let content = fs.readFileSync(path.join(pagesDir, file), 'utf8');
    
    // Remove <header ...>...</header>
    content = content.replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '');
    
    // Remove <nav ...>...</nav>
    content = content.replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '');
    
    // If it doesn't already have max-w-md or max-w-4xl at the root, add it
    // Actually, all files start with <div class="flex flex-col w-full...
    content = content.replace(/<div class="flex flex-col w-full([^"]*)">/i, (match, p1) => {
      if (!p1.includes('max-w-')) {
        return `<div class="flex flex-col w-full max-w-md mx-auto${p1}">`;
      }
      return match;
    });

    fs.writeFileSync(path.join(pagesDir, file), content.trim(), 'utf8');
    console.log('Cleaned up', file);
  }
});
