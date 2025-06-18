const filters = document.getElementById('filters');
if (filters) {
  filters.innerHTML = `
    <input id="searchInput" placeholder="Search lore...">
    <select id="categorySelect">
      <option>All</option>
      <option>Planets</option>
      <option>Factions</option>
    </select>
  `;

  document.getElementById('searchInput').addEventListener('input', e => {
    const term = e.target.value.toLowerCase();
    window.filterLore(term);
  });
}
