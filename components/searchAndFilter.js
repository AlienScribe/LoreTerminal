// Provides real-time search and filtering for lore content
const filtersEl = document.getElementById('filters');
let tagsData = null;

export async function initFilters() {
  if (!filtersEl) return;
  const res = await fetch('./data/indexingTags.json');
  tagsData = await res.json();

  const categoryOptions = ['All', ...tagsData.categories]
    .map(cat => `<option value="${cat}">${cat}</option>`)
    .join('');

  filtersEl.innerHTML = `
    <input id="searchInput" placeholder="Search lore...">
    <select id="categorySelect">${categoryOptions}</select>
    <select id="statusSelect">
      <option value="all">All Statuses</option>
      <option value="canon">Canon</option>
      <option value="in-vote">In Vote</option>
      <option value="passed">Passed</option>
      <option value="rejected">Rejected</option>
    </select>
  `;

  document.getElementById('searchInput').addEventListener('input', filter);
  document.getElementById('categorySelect').addEventListener('change', filter);
  document.getElementById('statusSelect').addEventListener('change', filter);
}

function filter() {
  const term = document.getElementById('searchInput').value.toLowerCase();
  const category = document.getElementById('categorySelect').value;
  const status = document.getElementById('statusSelect').value;

  const articles = document.querySelectorAll('#loreDisplay article');
  articles.forEach(article => {
    const text = article.textContent.toLowerCase();
    const articleCat = article.dataset.category || '';
    const articleStatus = article.dataset.status || '';
    const matchesTerm = text.includes(term);
    const matchesCat = category === 'All' || articleCat === category;
    const matchesStatus = status === 'all' || articleStatus === status;
    article.style.display = matchesTerm && matchesCat && matchesStatus ? '' : 'none';
  });
}

initFilters();
