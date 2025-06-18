import { renderMarkdown } from './components/markdownRenderer.js';
import { fetchProposedLore, fetchCanonLore } from './api/github.js';
import './components/searchAndFilter.js';
import './components/menu.js';
import { renderBookmarkButton } from './components/bookmarks.js';
import './components/markdownAssistant.js';
import { renderCommentSection } from './components/comments.js';
import { displayVoteButtons } from './components/votingSystem.js';
import { showProfile } from './components/userProfiles.js';

let tags;

async function load() {
  document.body.innerHTML = `
    <div id="terminal" class="scanline">
      <header><h1>ALIEN WORLDS: LORE TERMINAL</h1></header>
      <nav id="menu"></nav>
      <div id="filters"></div>
      <section id="loreDisplay"></section>
      <footer>v1.0 - loreworks.co.za</footer>
    </div>`;

  tags = await fetch('./data/indexingTags.json').then(r => r.json());

  const canon = await fetchCanonLore();
  const proposed = await fetchProposedLore();
  const allLore = [...canon, ...proposed];
  displayLore(allLore);

  // demo profile fetch
  showProfile('demo.wam');
}

function detectCategory(item) {
  for (const cat of tags.categories) {
    const tagList = tags.tags[cat] || [];
    if (tagList.some(t => item.content.includes(t) || item.title.includes(t))) {
      return cat;
    }
  }
  return 'Uncategorized';
}

function displayLore(items) {
  const container = document.getElementById('loreDisplay');
  container.innerHTML = items
    .map(item => {
      const category = detectCategory(item);
      return `<article data-id="${item.id}" data-status="${item.status}" data-category="${category}">
        <h2>${item.title}</h2>
        ${displayVoteButtons(item.id)}
        ${renderBookmarkButton(item.id)}
        ${renderMarkdown(item.content)}
      </article>`;
    })
    .join('\n');

  // attach comments
  items.forEach(item => {
    const article = document.querySelector(`article[data-id="${item.id}"]`);
    if (article) article.appendChild(renderCommentSection(item.id));
  });
}

load();
