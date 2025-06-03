/**
 * Main application entry point
 * - Modernized with ES6+ features
 * - Improved error handling
 * - Added proper cleanup
 * - Enhanced accessibility
 */

import { login, isLoggedIn, getSession, onAuthChange } from './auth.js';
import { showSection, highlightMenu, setupSidebarEvents, adjustContentFrame } from './ui.js';

// DOM references
const elements = {
    bootOverlay: document.getElementById('bootSequence'),
    bootLog: document.getElementById('bootLog'),
    walletLoginBtn: document.getElementById('walletLoginBtn'),
    terminal: document.getElementById('terminal'),
    sidebar: document.getElementById('sidebar'),
    sidebarTab: document.getElementById('sidebarTab'),
    mainContent: document.getElementById('contentBox')
};

// Boot sequence messages
const BOOT_MESSAGES = [
    'LORE TERMINAL BOOT SEQUENCE INITIATED',
    'MODEL: A-01 OmniLink',
    'NodeProtocol: ORBITAL_ARCHIVE_0.3',
    'POWER... ROUTING THROUGH FUSION CELLS... [OK]',
    'STABILIZING QUANTUM THREADS... [OK]',
    'DECRYPTING DATA CORE NEXUS... [ACCESS DENIED]',
    'CONNECT WAX CLOUD WALLET'
];

// Typewriter effect with improved timing
async function typeBoot(lines, logElem) {
    try {
        logElem.innerText = '';
        for (const line of lines) {
            let currentText = logElem.innerText;
            for (let i = 0; i <= line.length; i++) {
                logElem.innerText = currentText + line.slice(0, i) + '_';
                await new Promise(res => setTimeout(res, 26 + Math.random() * 14));
                logElem.innerText = currentText + line.slice(0, i);
            }
            logElem.innerText = currentText + line + '\n';
            await new Promise(res => setTimeout(res, 280 + Math.random() * 80));
        }
        logElem.innerText = logElem.innerText.replace(/_$/, '');
    } catch (error) {
        console.error('Error in typewriter effect:', error);
        logElem.innerText = 'BOOT SEQUENCE ERROR\nPlease refresh the page.';
    }
}

// Welcome panel with improved accessibility
function showWelcome(wallet) {
    elements.mainContent.innerHTML = `
        <div class="welcome-panel" role="region" aria-label="Welcome message">
            <h2 style="font-size:2.2vw; color:#FFD47E;">Welcome, <span style="color:#ffefb7;">${wallet}</span>!</h2>
            <p style="margin:2vw 0 0 0; font-size:1.3vw;">The A-01 Canon Terminal is now unlocked.<br>
            Use the menu to explore Canon Lore, Vote, Learn, and more.</p>
            <p style="margin:2vw 0 0 0; font-size:1vw; color:#FFD47Ebb;">[Select a section to begin your journey.]</p>
        </div>
    `;
}

// Initialize application
async function initializeApp() {
    try {
        // Set initial UI states
        elements.terminal.style.display = 'none';
        elements.bootOverlay.style.display = 'flex';
        elements.sidebar.style.display = 'none';
        elements.walletLoginBtn.style.display = 'none';
        if (elements.sidebarTab) elements.sidebarTab.style.display = 'none';

        // Check for existing session
        if (isLoggedIn() && getSession()?.actor) {
            await handleSuccessfulLogin(getSession().actor.toString());
            return;
        }

        // Run boot animation
        await typeBoot(BOOT_MESSAGES, elements.bootLog);
        setupWalletLogin();
    } catch (error) {
        console.error('Error initializing application:', error);
        elements.bootLog.innerHTML += `\n<span style="color:#FF3B52;">Initialization error: ${error.message}</span>`;
    }
}

// Handle successful login
async function handleSuccessfulLogin(wallet) {
    try {
        elements.bootOverlay.style.display = 'none';
        elements.terminal.style.display = 'flex';
        elements.sidebar.style.display = 'flex';
        if (elements.sidebarTab) elements.sidebarTab.style.display = 'block';
        
        showWelcome(wallet);
        highlightMenu('canon');
        setupSidebarEvents(adjustContentFrame);
        adjustContentFrame();
        
        // Set up resize handler
        const resizeHandler = () => {
            requestAnimationFrame(adjustContentFrame);
        };
        window.addEventListener('resize', resizeHandler);
        
        // Store cleanup function
        window.currentCleanup = () => {
            window.removeEventListener('resize', resizeHandler);
        };
    } catch (error) {
        console.error('Error handling successful login:', error);
        throw error;
    }
}

// Setup wallet login button
function setupWalletLogin() {
    elements.walletLoginBtn.style.display = 'block';
    elements.walletLoginBtn.style.marginTop = '2vw';
    elements.walletLoginBtn.style.marginLeft = 'auto';
    elements.walletLoginBtn.style.marginRight = 'auto';

    elements.walletLoginBtn.onclick = async () => {
        try {
            elements.walletLoginBtn.disabled = true;
            elements.walletLoginBtn.textContent = '🔄 Connecting...';
            
            const wallet = await login();
            if (!wallet || wallet === 'undefined') {
                throw new Error('Login failed: Invalid wallet returned.');
            }
            
            await handleSuccessfulLogin(wallet);
        } catch (error) {
            console.error('Login error:', error);
            elements.walletLoginBtn.disabled = false;
            elements.walletLoginBtn.textContent = '🔐 Connect WAX Wallet';
            elements.bootLog.innerHTML += `\n<span style="color:#FF3B52;">Login failed: ${error.message}</span>`;
        }
    };
}

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Handle auth state changes
onAuthChange(async (wallet) => {
    if (wallet) {
        try {
            await handleSuccessfulLogin(wallet);
        } catch (error) {
            console.error('Error handling auth change:', error);
        }
    }
});
