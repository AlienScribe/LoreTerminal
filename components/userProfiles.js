// Displays user/community profile information fetched via GraphQL
import { fetchProfile } from '../api/alienWorldsGraphQL.js';

export async function showProfile(wallet) {
  const data = await fetchProfile(wallet);
  if (!data) return;
  const container = document.createElement('div');
  container.className = 'profile';
  container.innerHTML = `
    <img src="${data.avatar}" alt="avatar">
    <h3>${data.username}</h3>
    <p>${data.bio || ''}</p>
    <ul>
      ${data.contributions.map(c => `<li>${c.title} - ${c.status} (${c.votes} votes)</li>`).join('')}
    </ul>
  `;
  document.body.appendChild(container);
}
