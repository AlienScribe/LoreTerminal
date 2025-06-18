import { renderMarkdown } from './components/markdownRenderer.js';
import { fetchProposedLore, fetchCanonLore } from './api/githubAPI.js';
import './components/searchFilter.js';
import './components/menu.js';
import './components/bookmarks.js';
import './components/comments.js';
import './components/modal.js';
import { displayVoteButtons } from './components/votingSystem.js';

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
    .map(item => `<article data-id="${item.id}">${displayVoteButtons(item.id)}${renderMarkdown(item.content)}</article>`)
    .join('\n');
}

window.filterLore = term => {
  const articles = document.querySelectorAll('#loreDisplay article');
  articles.forEach(a => {
    a.style.display = a.textContent.toLowerCase().includes(term) ? '' : 'none';
  });
};

load();
