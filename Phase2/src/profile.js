// profile.js
import { fetchMegaProfile } from './graphqlMegaFetcher.js';
import { login, logout, restoreSession } from './auth.js';

export class UserProfile {
  constructor(containerId = 'profilePanel') {
    this.container = document.getElementById(containerId) || this.createPanel(containerId);
    this.wallet = null;
    this.data = {};
  }

  createPanel(id) {
    const panel = document.createElement('div');
    panel.id = id;
    panel.className = 'profile-panel';
    document.body.appendChild(panel);
    return panel;
  }

  async load(walletOverride = null) {
    let wallet = walletOverride || sessionStorage.getItem('WAX_WALLET');

    if (!wallet) {
      wallet = await restoreSession();
      if (!wallet) return this.renderLoginPrompt();
    }

    this.wallet = wallet;
    try {
      const megaData = await fetchMegaProfile(wallet, 'eyeke', 'eyeke');
      this.data = megaData;
      this.render();
    } catch (err) {
      console.error('Error loading profile:', err);
      this.renderError('Failed to fetch user data.');
    }
  }

  renderLoginPrompt() {
    this.container.innerHTML = `
      <div class="profile-card">
        <h2>Please log in with your WAX Wallet</h2>
        <button id="waxLoginBtn">🔐 Connect Wallet</button>
      </div>
    `;
    this.container.style.display = 'block';
    document.getElementById('waxLoginBtn')?.addEventListener('click', async () => {
      const wallet = await login();
      if (wallet) this.load(wallet);
    });
  }

  render() {
    const { profile, stake, loreStats, voteStats, planetMeta } = this.data;

    this.container.innerHTML = `
      <div class="profile-card glassy-glow pulse-in">
        <div class="profile-header">
          <h2 class="profile-title">User: ${profile.wallet}</h2>
          <p class="profile-subtitle">Status: <span class="live-indicator">CONNECTED</span></p>
        </div>

        <div class="profile-stats">
          <div class="stat-block"><label>TLM</label><span>${profile.tlm_balance || 0}</span></div>
          <div class="stat-block"><label>Stake</label><span>${stake.staked_amount || 0}</span></div>
          <div class="stat-block"><label>Vote Power</label><span>${loreStats.vote_power || 0}</span></div>
          <div class="stat-block"><label>Lore Claimed</label><span>${loreStats.last_claim || '-'}</span></div>
          <div class="stat-block"><label>Planet</label><span>${planetMeta.name || 'Unknown'}</span></div>
        </div>

        <div class="profile-footer">
          <button class="refresh-profile-btn" onclick="location.reload()">🔄 Refresh</button>
          <button id="logoutBtn" class="logout-btn">🚪 Logout</button>
        </div>
      </div>
    `;

    this.container.style.display = 'block';

    document.getElementById('logoutBtn')?.addEventListener('click', async () => {
      await logout();
      location.reload();
    });
  }

  renderError(msg) {
    this.container.innerHTML = `
      <div class="profile-error">
        <h3>Error</h3>
        <p>${msg}</p>
      </div>
    `;
    this.container.style.display = 'block';
  }
}