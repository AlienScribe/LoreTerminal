import { renderMarkdown } from './loreParser.js';
import { fetchProposedLore } from './api/github.js';
import { fetchCanonLore } from './api/alienworlds.js';
import './ui/filters.js';
import './ui/menu.js';
import './ui/bookmarks.js';
import './ui/comments.js';
import './ui/modal.js';
import { displayVoteButtons } from './voteSystem.js';

async function load() {
  document.body.innerHTML = `
    <div id="terminal" class="scanline">
      <header><h1>ALIEN WORLDS: LORE TERMINAL</h1></header>
      <nav id="menu"></nav>
      <div id="filters"></div>
      <section id="loreDisplay"></section>
      <footer>v1.0 - loreworks.co.za</footer>
    </div>`;

  const canon = await fetchCanonLore().catch(() => []);
  const proposed = await fetchProposedLore().catch(() => []);
  const allLore = [...canon, ...proposed];
  displayLore(allLore);
}

function displayLore(items) {
  const container = document.getElementById('loreDisplay');
  container.innerHTML = items
    .map(item => `<article data-id="${item.id || item.title}">${displayVoteButtons(item.id || item.title)}${renderMarkdown(item.body || item.content)}</article>`)
    .join('\n');
}

window.filterLore = term => {
  const articles = document.querySelectorAll('#loreDisplay article');
  articles.forEach(a => {
    a.style.display = a.textContent.toLowerCase().includes(term) ? '' : 'none';
  });
};

load();
