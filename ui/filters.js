export function setupFilters() {
  const container = document.getElementById('filters');
  container.innerHTML = `
    <input id="searchInput" placeholder="Search lore...">
    <select id="categorySelect">
      <option>All</option>
      <option>Planets</option>
      <option>Factions</option>
    </select>
  `;

  document.getElementById('searchInput').addEventListener('input', e => {
    const term = e.target.value.toLowerCase();
    const articles = document.querySelectorAll('#loreDisplay article');
    articles.forEach(a => {
      const text = a.textContent.toLowerCase();
      a.style.display = text.includes(term) ? '' : 'none';
    });
  });
}
