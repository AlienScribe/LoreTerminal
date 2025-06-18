// Simple comment thread management using localStorage
let comments = JSON.parse(localStorage.getItem('comments')) || {};

export function renderCommentSection(id) {
  const section = document.createElement('div');
  section.className = 'comments';
  section.innerHTML = `
    <h4>Comments</h4>
    <div class="list">${(comments[id] || []).map(c => `<p>${c}</p>`).join('')}</div>
    <textarea placeholder="Add comment"></textarea>
    <button>Post</button>
  `;
  const btn = section.querySelector('button');
  btn.addEventListener('click', () => {
    const txt = section.querySelector('textarea').value.trim();
    if (!txt) return;
    addComment(id, txt);
    section.querySelector('.list').insertAdjacentHTML('beforeend', `<p>${txt}</p>`);
    section.querySelector('textarea').value = '';
  });
  return section;
}

function addComment(id, text) {
  if (!comments[id]) comments[id] = [];
  comments[id].push(text);
  localStorage.setItem('comments', JSON.stringify(comments));
}
