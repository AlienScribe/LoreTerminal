export async function fetchCanonLore() {
  const res = await fetch('https://raw.githubusercontent.com/Alien-Worlds/the-lore/main/README.md');
  const text = await res.text();
  return [{ id: 'canon', title: 'Canon Lore', content: text, status: 'canon' }];
}

export async function fetchProposedLore() {
  const res = await fetch('https://api.github.com/repos/Alien-Worlds/the-lore/pulls');
  const data = await res.json();
  return data.map(pr => ({ id: pr.number, title: pr.title, content: pr.body, status: pr.state }));
}
