const fs = require('fs');
const path = require('path');

const txtPath = path.join(__dirname, 'index.txt');
const htmlPath = path.join(__dirname, 'index.html');

const content = fs.readFileSync(txtPath, 'utf8');
const snippets = content.split('<!DOCTYPE html>');

function getBody(html) {
  const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  return match ? match[1] : html;
}

let fullHtml = `<!DOCTYPE html>
<html class="dark" lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
<title>MedPulse AI - Console de Crescimento Médico</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com"></script>
<script>
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "on-secondary": "#003640",
        "primary": "#6bd8cb",
        "surface-container-low": "#161b29",
        "surface-variant": "#2f3543",
        "secondary-fixed-dim": "#4cd7f6",
        "on-tertiary-fixed-variant": "#653e00",
        "on-surface-variant": "#bcc9c6",
        "on-tertiary-fixed": "#2a1700",
        "secondary-container": "#03b5d3",
        "on-secondary-container": "#00424e",
        "tertiary-fixed": "#ffddb8",
        "primary-fixed": "#89f5e7",
        "on-tertiary": "#472a00",
        "surface-container-highest": "#2f3543",
        "surface-container-lowest": "#080e1b",
        "surface-dim": "#0d1320",
        "inverse-surface": "#dde2f5",
        "inverse-on-surface": "#2a303f",
        "surface-bright": "#333948",
        "primary-container": "#29a195",
        "on-background": "#dde2f5",
        "secondary-fixed": "#acedff",
        "error-container": "#93000a",
        "on-primary-fixed-variant": "#005049",
        "on-error-container": "#ffdad6",
        "tertiary": "#ffb95f",
        "primary-fixed-dim": "#6bd8cb",
        "on-primary-container": "#00302b",
        "on-primary": "#003732",
        "surface-container": "#1a1f2d",
        "on-secondary-fixed-variant": "#004e5c",
        "surface-container-high": "#242a38",
        "on-tertiary-container": "#3e2400",
        "inverse-primary": "#006a61",
        "surface": "#0d1320",
        "secondary": "#4cd7f6",
        "background": "#0d1320",
        "tertiary-container": "#ca8100",
        "on-surface": "#dde2f5",
        "error": "#ffb4ab",
        "surface-tint": "#6bd8cb",
        "on-secondary-fixed": "#001f26",
        "outline": "#879391",
        "on-error": "#690005",
        "on-primary-fixed": "#00201d",
        "tertiary-fixed-dim": "#ffb95f",
        "outline-variant": "#3d4947"
      },
      borderRadius": {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing": {
        "gutter-sm": "0.75rem",
        "space-lg": "1.5rem",
        "space-md": "1rem",
        "space-sm": "0.5rem",
        "margin": "1.25rem",
        "space-xs": "0.25rem",
        "space-xl": "2rem",
        "margin-sm": "1rem",
        "gutter": "1rem"
      },
      fontFamily": {
        "sans": ["Plus Jakarta Sans", "sans-serif"]
      }
    }
  }
}
</script>
<style>
  body {
    background-color: #0d1320;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #dde2f5;
    margin: 0;
    padding: 0;
  }
  
  /* Light mode support */
  html.light body {
    background-color: #F8FAFC !important;
    color: #0F172A !important;
  }
  html.light .bg-surface { background-color: #F8FAFC !important; }
  html.light .bg-surface-container-lowest { background-color: #FFFFFF !important; }
  html.light .bg-surface-container-low { background-color: #F1F5F9 !important; }
  html.light .bg-surface-container { background-color: #E2E8F0 !important; }
  html.light .bg-surface-container-high { background-color: #CBD5E1 !important; }
  html.light .text-on-surface { color: #0F172A !important; }
  html.light .text-on-surface-variant { color: #475569 !important; }
  html.light .border-surface-variant { border-color: #E2E8F0 !important; }

  .page-view {
    display: none;
  }
  .page-view.active {
    display: block;
    animation: fadeIn 0.25s ease-in-out;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
</head>
<body class="bg-surface text-on-surface min-h-screen flex flex-col justify-between selection:bg-primary/30">

<!-- TOP SYSTEM HEADER & NAVIGATION -->
<header class="sticky top-0 z-50 bg-surface-container-low/95 backdrop-blur-md border-b border-surface-variant/50 px-4 py-3 flex items-center justify-between shadow-lg">
  <div class="flex items-center gap-3 cursor-pointer" onclick="showPage('login')">
    <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-container to-secondary flex items-center justify-center shadow-md shadow-primary/20">
      <span class="material-symbols-outlined text-on-primary text-xl" style="font-variation-settings: 'FILL' 1;">vital_signs</span>
    </div>
    <div class="flex flex-col">
      <div class="flex items-center gap-2">
        <span class="font-bold text-lg tracking-tight text-on-surface">MedPulse <span class="text-primary font-light">AI</span></span>
        <span class="hidden sm:inline-flex text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">CFM / CFO Secure</span>
      </div>
      <span class="text-[11px] text-on-surface-variant hidden sm:inline">Clinical Growth & Social AI Console</span>
    </div>
  </div>

  <!-- NAVIGATION TABS & CONTROLS -->
  <div class="flex items-center gap-2 sm:gap-3">
    <!-- Quick Stepper Selector -->
    <div class="relative">
      <select id="screen-selector" onchange="showPage(this.value)" class="bg-surface-container-high text-on-surface text-xs font-semibold px-3 py-2 pr-8 rounded-xl border border-outline-variant/40 outline-none focus:border-primary appearance-none cursor-pointer shadow-sm">
        <option value="login">1. Login & Autenticação</option>
        <option value="meta-connect">2. Conexão Meta & Instagram</option>
        <option value="onboarding">3. Onboarding Profissional</option>
        <option value="dashboard">4. Dashboard & Métricas IA</option>
        <option value="calendar">5. Calendário & Agendamento</option>
        <option value="format">6. IA • Escolha do Formato</option>
        <option value="objective">7. IA • Objetivo do Conteúdo</option>
        <option value="weekly">8. IA • Planejamento Semanal</option>
        <option value="media">9. IA • Escolha da Mídia</option>
        <option value="preview">10. IA • Personalização & Preview</option>
        <option value="generated">11. IA • Conteúdo Gerado</option>
        <option value="stories-detail">12. IA • Stories Sequenciais</option>
        <option value="final-export">13. IA • Publicar & Exportar</option>
      </select>
      <span class="material-symbols-outlined text-outline text-sm absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">expand_more</span>
    </div>

    <!-- Dark/Light Theme Toggle -->
    <button onclick="toggleTheme()" class="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface hover:text-primary transition-colors border border-outline-variant/30 shadow-sm" title="Alternar Modo Escuro / Claro">
      <span class="material-symbols-outlined text-xl" id="theme-icon">light_mode</span>
    </button>
  </div>
</header>

<!-- MAIN APP CONTAINER -->
<main class="flex-grow max-w-4xl mx-auto w-full px-2 sm:px-4 py-6">
`;

const pageNames = [
  'login', 'meta-connect', 'onboarding', 'dashboard', 'calendar',
  'format', 'objective', 'weekly', 'media', 'preview',
  'generated', 'stories-detail', 'final-export'
];

snippets.slice(1).forEach((s, idx) => {
  const bodyContent = getBody(s);
  const pName = pageNames[idx] || `page-${idx+1}`;
  const activeClass = idx === 0 ? 'active' : '';
  fullHtml += `\n<!-- SECTION ${idx+1}: ${pName} -->\n<div id="page-${pName}" class="page-view ${activeClass}">\n${bodyContent}\n</div>\n`;
});

fullHtml += `
</main>

<!-- BOTTOM GLOBAL FOOTER -->
<footer class="border-t border-surface-variant/40 bg-surface-container-lowest py-4 px-6 text-center text-xs text-on-surface-variant flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
  <div class="flex items-center gap-2">
    <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
    <span class="font-medium">MedPulse AI Engine v2.4 • Conforme Resolução CFM 2.336/2023 & CFO</span>
  </div>
  <div class="flex items-center gap-4 text-on-surface-variant font-semibold">
    <button onclick="showPage('dashboard')" class="hover:text-primary transition-colors">Dashboard</button>
    <button onclick="showPage('calendar')" class="hover:text-primary transition-colors">Agendador</button>
    <button onclick="showPage('format')" class="hover:text-primary transition-colors">+ Criar Conteúdo</button>
  </div>
</footer>

<script>
function showPage(pageId) {
  document.querySelectorAll('.page-view').forEach(el => el.classList.remove('active'));
  const target = document.getElementById('page-' + pageId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const sel = document.getElementById('screen-selector');
    if (sel && sel.value !== pageId) sel.value = pageId;
  }
}

function toggleTheme() {
  const html = document.documentElement;
  const icon = document.getElementById('theme-icon');
  if (html.classList.contains('dark')) {
    html.classList.remove('dark');
    html.classList.add('light');
    icon.textContent = 'dark_mode';
  } else {
    html.classList.remove('light');
    html.classList.add('dark');
    icon.textContent = 'light_mode';
  }
}

// Enhance Interactive Flow Connections
document.addEventListener('DOMContentLoaded', () => {
  // Bind CTA login
  const loginCta = document.getElementById('cta-login');
  if (loginCta) {
    loginCta.addEventListener('click', (e) => {
      e.preventDefault();
      showPage('meta-connect');
    });
  }

  // Bind any button with navigation intentions
  document.querySelectorAll('button, a').forEach(btn => {
    const text = btn.innerText ? btn.innerText.toLowerCase() : '';
    if (text.includes('avançar') || text.includes('continuar') || text.includes('próximo')) {
      btn.addEventListener('click', (e) => {
        const currentSelect = document.getElementById('screen-selector');
        if (currentSelect) {
          const currentIndex = currentSelect.selectedIndex;
          if (currentIndex < currentSelect.options.length - 1) {
            const nextVal = currentSelect.options[currentIndex + 1].value;
            showPage(nextVal);
          }
        }
      });
    }
  });
});
</script>
</body>
</html>
`;

fs.writeFileSync(htmlPath, fullHtml, 'utf8');
console.log('index.html created successfully! Size:', fs.statSync(htmlPath).size, 'bytes');
