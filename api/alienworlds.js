export async function fetchCanonLore() {
  const res = await fetch('https://alienworlds-api.com/lore/canon');
  if (!res.ok) return [];
  return await res.json();
}
