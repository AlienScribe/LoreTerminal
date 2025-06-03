/**
 * This module fetches user profile data and active lore proposals from the Alien Worlds GraphQL API.
 * Refactored for clarity and to incorporate better error handling.
 */

/**
 * Fetches profile data for a given wallet using the Alien Worlds GraphQL endpoint.
 * Retrieves basic stats, stake info, and vote history.
 * @param {string} wallet - The wallet identifier.
 * @returns {Promise<Object>}
 */
export async function fetchUserProfile(wallet) {
    const query = `
        query ($wallet: String!) {
            accounts(where: { account: { _eq: $wallet } }) {
                account
                last_login
                is_active
            }
            dao_wallet_details(wallet: $wallet) {
                wallet
                tlm
                stake
                total_votes
                proposals_voted
            }
        }
    `;

    try {
        const response = await fetch('/api/aw-query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables: { wallet } })
        });

        const json = await response.json();
        const dao = json.dao_wallet_details?.[0] || {};
        const account = json.accounts?.[0] || {};

        return {
            tlm: dao.tlm || '0',
            stake: dao.stake || '0',
            totalVotes: dao.total_votes || 0,
            proposalsVoted: dao.proposals_voted || [],
            lastLogin: account.last_login || 'Unknown'
        };
    } catch (error) {
        console.error('GraphQL fetchUserProfile failed:', error);
        throw new Error('Unable to fetch profile from GraphQL.');
    }
}

/**
 * Fetches all active lore proposals from the Alien Worlds DAO.
 * @returns {Promise<Array>}
 */
export async function fetchActiveProposals() {
    const query = `
        query {
            TokeLore {
                proposals {
                    proposal_id
                    proposer
                    title
                    status
                    type
                    expires
                    earliest_exec
                    number_yes_votes
                    number_no_votes
                    total_yes_votes
                    total_no_votes
                    attributes
                }
            }
        }
    `;

    try {
        const response = await fetch('/api/aw-query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });

        const json = await response.json();
        return json?.TokeLore?.proposals || [];
    } catch (error) {
        console.error('GraphQL fetchActiveProposals failed:', error);
        return [];
    }
}
