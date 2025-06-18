// Basic bookmarking system using localStorage
let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

export function toggleBookmark(id) {
  if (bookmarks.includes(id)) {
    bookmarks = bookmarks.filter(b => b !== id);
  } else {
    bookmarks.push(id);
  }
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  updateButtons();
}

export function renderBookmarkButton(id) {
  const active = bookmarks.includes(id) ? 'bookmarked' : '';
  return `<button class="bookmark ${active}" onclick="window.toggleBookmark('${id}')">★</button>`;
}

function updateButtons() {
  document.querySelectorAll('.bookmark').forEach(btn => {
    const id = btn.dataset.id;
    if (bookmarks.includes(id)) btn.classList.add('bookmarked');
    else btn.classList.remove('bookmarked');
  });
}

window.toggleBookmark = toggleBookmark;
