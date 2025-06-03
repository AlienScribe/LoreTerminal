// public/cache.js

const CACHE_KEY = 'a01_cached_user';

export function getCachedWallet() {
    return sessionStorage.getItem(CACHE_KEY) || null;
}

export function setCachedWallet(wallet) {
    sessionStorage.setItem(CACHE_KEY, wallet);
}

export function clearCache() {
    sessionStorage.removeItem(CACHE_KEY);
}