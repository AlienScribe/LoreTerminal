const comments = {};

export function addComment(id, text) {
  if (!comments[id]) comments[id] = [];
  comments[id].push(text);
}
