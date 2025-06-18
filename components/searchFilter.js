const filters = document.getElementById('filters');

async function initFilters() {
  if (!filters) return;
  const res = await fetch('./data/indexingTags.json');
  const tags = await res.json();
  const options = ['All', ...tags.categories]
    .map(cat => `<option value="${cat}">${cat}</option>`)
    .join('');
  filters.innerHTML = `
    <input id="searchInput" placeholder="Search lore...">
    <select id="categorySelect">${options}</select>
  `;
  document.getElementById('searchInput').addEventListener('input', e => {
    const term = e.target.value.toLowerCase();
    window.filterLore(term);
  });
}

initFilters();
