// Fetch user/community data from Alien Worlds GraphQL endpoints
// Example query structure with robust error handling
// Usage: fetchProfile('userwallet.wam').then(data => console.log(data));
export async function fetchProfile(wallet) {
  const query = `query($wallet:String!){\n  walletDetails(wallet:$wallet){\n    username\n    avatar\n    bio\n    contributions{\n      title\n      status\n      votes\n    }\n  }\n}`;

  try {
    const res = await fetch('https://graphql.alienworlds.io/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { wallet } })
    });
    if (!res.ok) throw new Error('Network error');
    const { data, errors } = await res.json();
    if (errors) throw new Error(errors.map(e => e.message).join(','));
    return data.walletDetails;
  } catch (err) {
    console.error('GraphQL fetch failed', err);
    return null;
  }
}
