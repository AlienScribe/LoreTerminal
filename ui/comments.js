let comments = JSON.parse(localStorage.getItem('comments') || '{}');

export function addComment(id, text) {
  if (!comments[id]) comments[id] = [];
  comments[id].push(text);
  localStorage.setItem('comments', JSON.stringify(comments));
}

export function getComments(id) {
  return comments[id] || [];
}
