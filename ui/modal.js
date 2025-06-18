export function showModal(content) {
  let modal = document.getElementById('modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal';
    modal.style.position = 'fixed';
    modal.style.top = 0;
    modal.style.left = 0;
    modal.style.right = 0;
    modal.style.bottom = 0;
    modal.style.background = 'rgba(0,0,0,0.8)';
    modal.style.color = 'white';
    modal.style.padding = '2rem';
    document.body.appendChild(modal);
  }
  modal.innerHTML = `<div>${content}</div>`;
  modal.onclick = () => modal.remove();
}
