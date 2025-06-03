export function getBookmarks() {
  return JSON.parse(localStorage.getItem('bookmarks') || '[]');
}

export function toggleBookmark(sectionId) {
  const bookmarks = getBookmarks();
  const idx = bookmarks.indexOf(sectionId);
  if (idx === -1) {
    bookmarks.push(sectionId);
  } else {
    bookmarks.splice(idx, 1);
  }
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

export function isBookmarked(sectionId) {
  return getBookmarks().includes(sectionId);
}
