export function getBookmarks() {
  return JSON.parse(localStorage.getItem('bookmarks') || '[]');
}

export function toggleBookmark(section) {
  const bookmarks = getBookmarks();
  const idx = bookmarks.findIndex(b => b.id === section.sectionId);
  if (idx === -1) {
    bookmarks.push({
      id: section.sectionId,
      title: section.title,
      pr: section.prNumber || null
    });
  } else {
    bookmarks.splice(idx, 1);
  }
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

export function isBookmarked(sectionId) {
  return getBookmarks().some(b => b.id === sectionId);
}
