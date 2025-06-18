// GitHub API functions for fetching canon lore markdown and pull requests
export async function fetchCanonLore() {
  try {
    const res = await fetch('https://raw.githubusercontent.com/Alien-Worlds/the-lore/main/README.md');
    if (!res.ok) throw new Error('Failed to fetch canon lore');
    const text = await res.text();
    return [{ id: 'canon', title: 'Canon Lore', content: text, status: 'canon' }];
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function fetchProposedLore() {
  try {
    const res = await fetch('https://api.github.com/repos/Alien-Worlds/the-lore/pulls');
    if (!res.ok) throw new Error('Failed to fetch pull requests');
    const data = await res.json();
    return data.map(pr => ({
      id: pr.number,
      title: pr.title,
      content: pr.body || '',
      status: pr.merged_at ? 'passed' : pr.state === 'open' ? 'in-vote' : 'rejected',
      author: pr.user ? pr.user.login : 'unknown'
    }));
  } catch (err) {
    console.error(err);
    return [];
  }
}
