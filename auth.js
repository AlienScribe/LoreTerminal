import { SessionKit } from '@wharfkit/session';
import { WalletPluginCloudWallet } from '@wharfkit/wallet-plugin-cloudwallet';

const productionUI = {
    async onLogin() {},
    async onRequest() {},
    async onError(error) {
        console.error('[UI Error Hook]', error);
    },
    async onLoginComplete() {},
    getTranslate() {
        return (key) => key;
    }
};

function debounce(func, wait) {
    let timeout = null;
    return (...args) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

const walletPlugin = new WalletPluginCloudWallet();

const sessionKit = new SessionKit({
    appName: 'A01-Canon-Debug',
    chains: [{
        id: '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4',
        url: 'https://wax.greymass.com',
        fallbackUrls: [
            'https://api.waxsweden.org',
            'https://wax.eosrio.io',
        ],
    }],
    walletPlugins: [walletPlugin],
    ui: productionUI
});

let session = null;
const authChangeCallbacks = [];

const dispatchAuthChange = debounce((wallet) => {
    authChangeCallbacks.forEach(callback => callback(wallet));
    updateLoginUI(wallet);
}, 100);

export function onAuthChange(callback) {
    if (typeof callback === 'function') {
        authChangeCallbacks.push(callback);
    }
}

export function getSession() {
    return session;
}

export function isLoggedIn() {
    return Boolean(session?.actor);
}

export async function login() {
    try {
        console.log('--- [auth.js] CALLING sessionKit.login ---');
        const result = await sessionKit.login({ restoreSession: false });
        console.log('--- [auth.js] sessionKit.login returned:', result);

        if (!result || !result.session) {
            throw new Error('Login failed: No session object returned.');
        }

        session = result.session;

        if (!session.actor) {
            console.error('--- [auth.js] session object missing actor. Raw session:', session);
            throw new Error('Login failed: No actor returned. Session object: ' + session);
        }

        const wallet = session.actor.toString();
        console.log('--- [auth.js] session.actor.toString():', wallet);

        if (!wallet || wallet === 'undefined' || wallet.length < 3) {
            throw new Error(`Login failed: Invalid account name returned: ${wallet}`);
        }

        sessionStorage.setItem('WAX_WALLET', wallet);
        console.log('--- [auth.js] WAX_WALLET saved:', wallet);
        dispatchAuthChange(wallet);
        return wallet;

    } catch (error) {
        console.error('[Auth] Login failed:', error);
        throw new Error(error.message || 'Failed to connect to WAX wallet.');
    }
}

export async function logout() {
    try {
        if (session) {
            await sessionKit.logout(session);
            session = null;
        }
        sessionStorage.removeItem('WAX_WALLET');
        dispatchAuthChange(null);
    } catch (error) {
        console.error('[Auth] Logout failed:', error);
        throw error;
    }
}

export async function restoreSession() {
    try {
        const result = await sessionKit.restore();
        if (result && result.session && result.session.actor) {
            session = result.session;
            const wallet = session.actor.toString();
            sessionStorage.setItem('WAX_WALLET', wallet);
            dispatchAuthChange(wallet);
            return wallet;
        } else {
            dispatchAuthChange(null);
            return null;
        }
    } catch (error) {
        console.error('[Auth] Restore session failed:', error);
        dispatchAuthChange(null);
        return null;
    }
}

function updateLoginUI(wallet, elementId = 'walletLoginBtn') {
    const btn = document.getElementById(elementId);
    if (!btn) return;
    btn.textContent = wallet ? `🔓 ${wallet}` : '🔐 Login';
}

export async function refreshSession() {
    if (!session) return null;
    try {
        const result = await sessionKit.restore();
        const isValid = !!(result && result.session && result.session.actor);
        if (!isValid) {
            throw new Error('Session expired');
        }
        return await restoreSession();
    } catch (error) {
        console.error('[Auth] Refresh session failed:', error);
        session = null;
        dispatchAuthChange(null);
        return null;
    }
}

// Bind login button and restore session on load
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', async () => {
        await restoreSession();
        const btn = document.getElementById('walletLoginBtn');
        if (btn) {
            btn.addEventListener('click', async () => {
                if (isLoggedIn()) {
                    await logout();
                } else {
                    await login();
                }
            });
        }
    });
}
