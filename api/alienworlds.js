export async function fetchCanonLore() {
  const res = await fetch('https://alienworlds-api.com/lore/canon');
  const data = await res.json();
  return data;
}
