// Simple console-style navigation menu
const menu = document.getElementById('menu');
if (menu) {
  menu.innerHTML = `
    <a href="#planets">Planets</a>
    <a href="#factions">Factions</a>
    <a href="#species">Species</a>
    <a href="#technology">Technology</a>
  `;
}
