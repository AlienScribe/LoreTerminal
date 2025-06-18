let votes = JSON.parse(localStorage.getItem('votes')) || {};

export function displayVoteButtons(loreId) {
  return `
    <button onclick="vote('${loreId}','yes')">👍</button>
    <button onclick="vote('${loreId}','no')">👎</button>
  `;
}

window.vote = (id, choice) => {
  votes[id] = choice;
  localStorage.setItem('votes', JSON.stringify(votes));
  alert(`Voted ${choice.toUpperCase()} on ${id}`);
};
