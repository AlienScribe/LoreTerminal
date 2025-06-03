/**
 * Fetches everything for the A-01 Terminal:
 * - Lore globals
 * - Proposal list
 * - DAO stake/vote data
 * - Tokenized lore metadata
 * - Planet land data
 * 
 * Refactored for clarity and error-handling improvements in preparation for Phase 3 enhancements.
 */
export async function fetchMegaProfile(wallet, dacId, planetId) {
  const query = `
    query MegaQuery($dacId: String!, $wallet: String!, $walletDetailsWallet2: String!, $planetDetailsDacId2: String!) {
      TokeLore {
        globals {
          total_staked
          total_vote_power
          duration
          fee
          last_update
          pass_percent_x100
          power_per_day
          quorum_percent_x100
          template_id
          total_unstaking
        }
        proposals {
          attributes
          earliest_exec
          expires
          number_no_votes
          number_yes_votes
          proposal_id
          proposer
          status
          title
          total_no_votes
          total_yes_votes
          type
        }
      }
      dao_wallet_details(dac_id: $dacId, wallet: $wallet) {
        vote_weight {
          weight
          quorum
        }
        stake_details {
          dao_token_balance
          available_tlm_in_dao
          staked_amount
        }
      }
      wallet_details(wallet: $walletDetailsWallet2) {
        wallet
        avatar_id
        tlm_balance
        tokenized_lore {
          last_claim
          staked_amount
          vote_power
        }
      }
      planet_details(dac_id: $planetDetailsDacId2) {
        land_maps {
          asset_id
          x
          y
        }
        planet_details {
          name
          description
        }
      }
    }
  `;

  const variables = {
    dacId,
    wallet,
    walletDetailsWallet2: wallet,
    planetDetailsDacId2: planetId
  };

  try {
    const response = await fetch('/api/aw-query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables })
    });

    // Attempt to parse JSON response directly
    const json = await response.json();

    // Safely extract nested response data
    const loreGlobals = Array.isArray(json?.TokeLore?.globals) ? json.TokeLore.globals[0] || {} : {};
    const proposals = json?.TokeLore?.proposals || [];
    const dao = Array.isArray(json?.dao_wallet_details) ? json.dao_wallet_details[0] || {} : {};
    const walletData = Array.isArray(json?.wallet_details) ? json.wallet_details[0] || {} : {};
    const loreData = walletData?.tokenized_lore || {};
    const land = json?.planet_details?.land_maps || [];
    const planetMeta = Array.isArray(json?.planet_details?.planet_details) ? json.planet_details.planet_details[0] || {} : {};

    return {
      profile: {
        wallet: walletData.wallet,
        avatar_id: walletData.avatar_id,
        tlm_balance: walletData.tlm_balance
      },
      stake: {
        ...dao.stake_details,
        vote_weight: dao.vote_weight
      },
      loreStats: {
        last_claim: loreData.last_claim,
        staked_amount: loreData.staked_amount,
        vote_power: loreData.vote_power
      },
      voteStats: {
        globals: loreGlobals,
        proposals
      },
      planetAssets: land,
      planetMeta
    };

  } catch (error) {
    console.error('[MegaFetcher] Failed:', error);
    throw new Error('Unable to retrieve full profile dataset');
  }
}
