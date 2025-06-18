export function showModal(content) {
  const div = document.createElement('div');
  div.id = 'modal';
  div.innerHTML = `<div class="content">${content}</div>`;
  document.body.appendChild(div);
  div.addEventListener('click', () => div.remove());
}
