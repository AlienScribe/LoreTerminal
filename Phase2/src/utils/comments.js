export function getComments(sectionId) {
  const all = JSON.parse(localStorage.getItem('comments') || '{}');
  return all[sectionId] || [];
}

export function addComment(sectionId, author, text) {
  const all = JSON.parse(localStorage.getItem('comments') || '{}');
  if (!all[sectionId]) all[sectionId] = [];
  all[sectionId].push({ author, text, time: Date.now() });
  localStorage.setItem('comments', JSON.stringify(all));
}

export function renderCommentsUI(sectionId, container) {
  const wrapper = document.createElement('div');
  wrapper.className = 'comments-section';

  const list = document.createElement('div');
  list.className = 'comment-list';
  wrapper.appendChild(list);

  const form = document.createElement('form');
  form.className = 'comment-form';
  form.innerHTML = `
    <input type="text" name="author" placeholder="Name" required />
    <textarea name="text" placeholder="Add a comment" required></textarea>
    <button type="submit">Post</button>
  `;
  wrapper.appendChild(form);

  const renderList = () => {
    list.innerHTML = '';
    const comments = getComments(sectionId);
    comments.forEach(c => {
      const item = document.createElement('div');
      item.className = 'comment-item';
      const date = new Date(c.time).toLocaleString();
      item.innerHTML = `<strong>${c.author}</strong> <span class="comment-date">${date}</span><p>${c.text}</p>`;
      list.appendChild(item);
    });
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(form);
    addComment(sectionId, fd.get('author'), fd.get('text'));
    form.reset();
    renderList();
  });

  renderList();
  container.appendChild(wrapper);
}
