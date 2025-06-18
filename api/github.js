export async function fetchProposedLore() {
  const res = await fetch('https://api.github.com/repos/Alien-Worlds/the-lore/pulls');
  if (!res.ok) return [];
  const data = await res.json();
  return data.map(pr => ({
    id: pr.id,
    title: pr.title,
    body: pr.body,
    status: pr.state
  }));
}
