let bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');

export function toggleBookmark(id) {
  if (bookmarks.includes(id)) {
    bookmarks = bookmarks.filter(b => b !== id);
  } else {
    bookmarks.push(id);
  }
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}
