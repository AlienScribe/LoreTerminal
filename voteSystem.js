let votes = JSON.parse(localStorage.getItem('votes') || '{}');

export function displayVoteButtons(id) {
  return `
    <button onclick="vote('${id}','yes')">👍</button>
    <button onclick="vote('${id}','no')">👎</button>
  `;
}

export function getVote(id) {
  return votes[id];
}

window.vote = function(id, choice) {
  votes[id] = choice;
  localStorage.setItem('votes', JSON.stringify(votes));
  alert(`Voted ${choice.toUpperCase()} on ${id}`);
};
