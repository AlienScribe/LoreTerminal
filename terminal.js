import { setupMenu } from './ui/menu.js';
import { setupFilters } from './ui/filters.js';
import { fetchProposedLore } from './api/github.js';
import { fetchCanonLore } from './api/alienworlds.js';
import { renderMarkdown } from './loreParser.js';
import { displayVoteButtons } from './voteSystem.js';

async function init() {
  document.body.innerHTML = `
    <div id="terminal" class="scanline">
      <header><h1>ALIEN WORLDS: LORE TERMINAL</h1></header>
      <nav id="menu"></nav>
      <div id="filters"></div>
      <section id="loreDisplay"></section>
      <footer>v1.0 - loreworks.co.za</footer>
    </div>`;

  setupMenu();
  setupFilters();

  const loreDisplay = document.getElementById('loreDisplay');
  const [canon, proposed] = await Promise.all([
    fetchCanonLore().catch(() => []),
    fetchProposedLore().catch(() => [])
  ]);
  const allLore = [...canon, ...proposed];

  loreDisplay.innerHTML = allLore.map(item => {
    const md = renderMarkdown(item.body || item.text || '');
    return `<article id="${item.id}">
      <h2>${item.title || 'Untitled'}</h2>
      <div>${md}</div>
      <div class="votes">${displayVoteButtons(item.id)}</div>
    </article>`;
  }).join('');
}

init();
