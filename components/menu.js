// Interactive main navigation menu for lore categories.
// Renders buttons for each category and triggers a callback when clicked.

/**
 * Render menu buttons for the given categories.
 * @param {string[]} categories - list of category names
 * @param {(category:string) => void} onClickCallback - invoked when a button is clicked
 */
export function renderMenu(categories, onClickCallback) {
  const menu = document.getElementById('menu');
  if (!menu) return;
  menu.innerHTML = ''; // remove any existing buttons

  categories.forEach(category => {
    const button = document.createElement('button');
    button.classList.add('menu-button');
    button.innerText = category;
    button.onclick = () => onClickCallback(category);
    menu.appendChild(button);
  });
}

// Setup default menu on DOM ready
// The categories may later be replaced with data loaded from indexingTags.json
// but the defaults ensure the UI is populated immediately.
document.addEventListener('DOMContentLoaded', () => {
  const loreCategories = ['Planets', 'Species', 'Factions', 'Technology'];
  renderMenu(loreCategories, selectedCategory => {
    console.log(`Selected Category: ${selectedCategory}`);
    // TODO: integrate with search/filter system using indexingTags.json
    //       to display lore content for the chosen category.
  });
});
