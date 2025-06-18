export async function fetchProposedLore() {
  const res = await fetch('https://api.github.com/repos/Alien-Worlds/the-lore/pulls');
  const data = await res.json();
  return data.map(pr => ({ id: pr.number, title: pr.title, body: pr.body, status: pr.state }));
}
