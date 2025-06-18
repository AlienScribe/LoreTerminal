// Voting system managed via localStorage
let votes = JSON.parse(localStorage.getItem('votes')) || {};

export function displayVoteButtons(id) {
  const current = votes[id];
  const yesActive = current === 'yes' ? 'active' : '';
  const noActive = current === 'no' ? 'active' : '';
  return `
    <button class="vote yes ${yesActive}" onclick="window.vote('${id}','yes')">👍</button>
    <button class="vote no ${noActive}" onclick="window.vote('${id}','no')">👎</button>
  `;
}

window.vote = (id, choice) => {
  votes[id] = choice;
  localStorage.setItem('votes', JSON.stringify(votes));
  updateDisplay(id);
};

function updateDisplay(id) {
  document.querySelectorAll(`article[data-id="${id}"] .vote`).forEach(btn => {
    btn.classList.remove('active');
  });
  const activeBtn = document.querySelector(`article[data-id="${id}"] .${votes[id]}`);
  if (activeBtn) activeBtn.classList.add('active');
}
