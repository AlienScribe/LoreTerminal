let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

window.addBookmark = id => {
  if (!bookmarks.includes(id)) bookmarks.push(id);
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
};
