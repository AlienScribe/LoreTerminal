/**
 * UI Management Module
 * - Modernized with ES6+ features
 * - Uses Library class for canon/proposed lore (not GraphQL)
 * - Proper cleanup and error handling
 * - Section logic is modular and robust
 */

// Use the Vite alias so the path resolves correctly on all platforms
import { showSpaceExplorer } from '@/space-explorer/js/space-explorer-integration.js';
import { Library } from './library.js';
import { UserProfile } from './profile.js';

// DOM references
const elements = {
    mainContent: document.getElementById('contentBox'),
    sidebar: document.getElementById('sidebar'),
    sidebarTab: document.getElementById('sidebarTab'),
    contentOuterFrame: document.querySelector('.content-outer-frame'),
    sectionTitle: document.getElementById('sectionTitle'),
    breadcrumbs: document.getElementById('breadcrumbs'),
    loading: document.getElementById('loading')
};

let currentCleanup = null;
let isLoading = false;
let libraryInstance = null;

// Loading state management
function setLoading(loading) {
    isLoading = loading;
    if (elements.loading) {
        elements.loading.style.display = loading ? 'block' : 'none';
    }
}

// Error handling
function showError(message, section) {
    console.error(`Error in ${section}:`, message);
    elements.mainContent.innerHTML = `
        <div class="error" role="alert">
            <h3>Error Loading ${section}</h3>
            <p>${message}</p>
            <button onclick="window.location.reload()" class="retry-btn">Retry</button>
        </div>
    `;
}

// Content fade effect
function fadeContentIn() {
    elements.mainContent.classList.add('fade-in-section');
    setTimeout(() => {
        elements.mainContent.classList.remove('fade-in-section');
    }, 500);
}

// Canon/proposed lore section handler using Library class
async function showCanonSection(mode = 'canon', startSectionId = null) {
    setLoading(true);
    fadeContentIn();
    if (elements.sectionTitle) elements.sectionTitle.textContent = 'A-01 CANON TERMINAL';
    if (elements.breadcrumbs) elements.breadcrumbs.innerHTML = `Home / ${mode.charAt(0).toUpperCase() + mode.slice(1)}`;

    // Cleanup previous Library instance if present
    if (libraryInstance && typeof libraryInstance.cleanup === 'function') {
        libraryInstance.cleanup();
        libraryInstance = null;
    }

    // Clear and setup the main content container for lore
    elements.mainContent.innerHTML = `
        <div class="lore-content" tabindex="0">
            <div class="loading" style="display:none;">Loading lore...</div>
        </div>
        <div id="breadcrumbs"></div>
        <button class="toggle-btn" aria-label="Toggle between Canon/Proposed">Proposed</button>
        <input type="search" id="searchInput" placeholder="Search lore..." aria-label="Search lore">
        <button class="back-to-top" aria-label="Back to top">↑</button>
        <div class="sidebar"></div>
    `;

    // Attach breadcrumbs reference for Library
    elements.breadcrumbs = document.getElementById('breadcrumbs');

    // Instantiate and initialize Library
    libraryInstance = new Library();
    try {
        await libraryInstance.init();
        // Set correct mode (canon/proposed)
        if (mode === 'proposed' && libraryInstance.state.currentMode !== 'proposed') {
            libraryInstance.toggleMode();
        } else if (mode === 'canon' && libraryInstance.state.currentMode !== 'canon') {
            libraryInstance.toggleMode();
        }

        if (startSectionId) {
            const idx = libraryInstance.state.currentSectionIds.indexOf(startSectionId);
            if (idx !== -1) {
                libraryInstance.state.currentSectionIndex = idx;
                await libraryInstance.renderLore();
            }
        }
    } catch (err) {
        showError(err.message, 'Canon Lore');
    } finally {
        setLoading(false);
    }

    // Provide cleanup for this view
    currentCleanup = () => {
        if (libraryInstance && typeof libraryInstance.cleanup === 'function') {
            libraryInstance.cleanup();
        }
        libraryInstance = null;
    };
}

// Section render mapping
const SECTION_MAP = {
    canon: () => showCanonSection('canon'),
    proposed: () => showCanonSection('proposed'),
    bookmarks: async () => {
        setLoading(true);
        fadeContentIn();
        if (elements.sectionTitle) elements.sectionTitle.textContent = 'BOOKMARKS';
        if (elements.breadcrumbs) elements.breadcrumbs.innerHTML = 'Home / Bookmarks';
        const { getBookmarks } = await import('./utils/bookmarks.js');
        const bm = getBookmarks();
        elements.mainContent.innerHTML = `<h2 class="section-header">BOOKMARKS</h2>`;
        if (!libraryInstance) libraryInstance = new Library();
        if (!libraryInstance.state.index || Object.keys(libraryInstance.state.index).length===0) {
            await libraryInstance.init();
        }
        const list = document.createElement('ul');
        bm.forEach(b => {
            const section = libraryInstance.state.index[b.id];
            if (section) {
                const li = document.createElement('li');
                li.innerHTML = `<a href="#" data-id="${b.id}">${section.title}</a>`;
                list.appendChild(li);
            }
        });
        if (bm.length===0) { list.innerHTML='<li>No bookmarks saved.</li>'; }
        elements.mainContent.appendChild(list);
        list.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', async e => {
                e.preventDefault();
                const targetId = a.dataset.id;
                const isProposed = targetId.startsWith('proposed-');
                await showCanonSection(isProposed ? 'proposed' : 'canon', targetId);
            });
        });
        setLoading(false);
    },
    learn: async () => {
        try {
            setLoading(true);
            fadeContentIn();
            if (elements.sectionTitle) elements.sectionTitle.textContent = 'LEARN';
            if (elements.breadcrumbs) elements.breadcrumbs.innerHTML = 'Home / Learn';

            const response = await fetch('/api/learn');
            if (!response.ok) throw new Error('Failed to fetch learning resources');
            const resources = await response.json();

            if (!Array.isArray(resources) || resources.length === 0) {
                elements.mainContent.innerHTML = `
                    <h2 class="section-header">LEARN</h2>
                    <p>No learning resources found.</p>
                `;
                return;
            }

            elements.mainContent.innerHTML = `
                <h2 class="section-header">LEARN</h2>
                <div class="learn-grid" role="region" aria-label="Learning Resources">
                    ${resources.map(r => `
                        <article class="learn-card">
                            <h3>${r.title}</h3>
                            <p>${r.description}</p>
                            ${r.link ? `<a href="${r.link}" target="_blank" rel="noopener noreferrer" class="learn-link">Learn More</a>` : ''}
                        </article>
                    `).join('')}
                </div>
            `;
            fadeContentIn();
        } catch (error) {
            showError(error.message, 'Learning Resources');
        } finally {
            setLoading(false);
        }
    },
    vote: async () => {
        try {
            setLoading(true);
            fadeContentIn();
            if (elements.sectionTitle) elements.sectionTitle.textContent = 'VOTE';
            if (elements.breadcrumbs) elements.breadcrumbs.innerHTML = 'Home / Vote';

            const { fetchMegaProfile } = await import('./graphqlMegaFetcher.js');
            const { renderVoteControls } = await import('./voteHandler.js');
            const data = await fetchMegaProfile('anonymous', 'eyeke', 'eyeke');
            const proposals = data.voteStats.proposals || [];

            elements.mainContent.innerHTML = `<h2 class="section-header">VOTE</h2><div class="vote-container" role="region" aria-label="Voting System"></div>`;
            const container = elements.mainContent.querySelector('.vote-container');
            proposals.forEach(p => {
                const card = document.createElement('article');
                card.className = 'vote-card';
                card.innerHTML = `
                    <h3>${p.title}</h3>
                    <p>Status: <span class="status-badge status-${p.status}">${p.status}</span></p>
                    <div class="vote-counts"><span>YES: ${p.total_yes_votes}</span> <span>NO: ${p.total_no_votes}</span></div>
                `;
                card.appendChild(renderVoteControls(p.proposal_id));
                container.appendChild(card);
            });
            fadeContentIn();
        } catch (error) {
            showError(error.message, 'Voting System');
        } finally {
            setLoading(false);
        }
    },
    tools: () => {
        try {
            setLoading(true);
            fadeContentIn();
            elements.mainContent.innerHTML = `
                <h2 class="section-header">TOOLS</h2>
                <div class="tools-grid" role="region" aria-label="Available Tools">
                    <article class="tool-card">
                        <h3>Lore Writer</h3>
                        <p>Create and submit new lore entries for the A-01 Canon.</p>
                        <button class="tool-btn" aria-label="Open Lore Writer">Open Writer</button>
                    </article>
                    <article class="tool-card">
                        <h3>Planet Explorer</h3>
                        <p>Interactive tools for exploring planet data and history.</p>
                        <button class="tool-btn" aria-label="Launch Planet Explorer">Launch Explorer</button>
                    </article>
                    <article class="tool-card">
                        <h3>Markdown Converter</h3>
                        <p>Convert raw text into GitHub friendly Markdown.</p>
                        <button class="tool-btn" id="openConverter" aria-label="Open Markdown Converter">Open Converter</button>
                    </article>
                </div>
            `;
            fadeContentIn();
            if (elements.sectionTitle) elements.sectionTitle.textContent = 'TOOLS';
            if (elements.breadcrumbs) elements.breadcrumbs.innerHTML = 'Home / Tools';
            document.getElementById('openConverter')?.addEventListener('click', () => {
                import('./markdownConverter.js').then(m => m.showMarkdownConverter());
            });
        } catch (error) {
            showError(error.message, 'Tools');
        } finally {
            setLoading(false);
        }
    },
    profile: async () => {
        try {
            setLoading(true);
            fadeContentIn();
            if (elements.sectionTitle) elements.sectionTitle.textContent = 'PROFILE';
            if (elements.breadcrumbs) elements.breadcrumbs.innerHTML = 'Home / Profile';

            // Clear content and insert a profile panel
            elements.mainContent.innerHTML = `<div id="profilePanel"></div>`;

            // Initialize and load UserProfile
            const profileView = new UserProfile('profilePanel');
            await profileView.load();
            fadeContentIn();
        } catch (error) {
            showError(error.message, 'Profile');
        } finally {
            setLoading(false);
        }
    },
    planets: async () => {
        try {
            setLoading(true);
            fadeContentIn();
            if (currentCleanup) {
                currentCleanup();
                currentCleanup = null;
            }
            if (elements.sectionTitle) elements.sectionTitle.textContent = 'PLANETS';
            if (elements.breadcrumbs) elements.breadcrumbs.innerHTML = 'Home / Planets';
            currentCleanup = await showSpaceExplorer();
        } catch (error) {
            showError(error.message, 'Planet Explorer');
        } finally {
            setLoading(false);
        }
    },
    races: async () => {
        try {
            setLoading(true);
            fadeContentIn();
            if (elements.sectionTitle) elements.sectionTitle.textContent = 'RACES';
            if (elements.breadcrumbs) elements.breadcrumbs.innerHTML = 'Home / Races';

            const response = await fetch('/api/races');
            if (!response.ok) throw new Error('Failed to fetch race data');
            const races = await response.json();

            elements.mainContent.innerHTML = `
                <h2 class="section-header">RACES</h2>
                <div class="races-grid" role="region" aria-label="Alien Races">
                    ${races.map(race => `
                        <article class="race-card">
                            <h3>${race.name}</h3>
                            <p>${race.description}</p>
                            <div class="race-details">
                                <span>Homeworld: ${race.homeworld}</span>
                                <span>Technology Level: ${race.techLevel}</span>
                            </div>
                        </article>
                    `).join('')}
                </div>
            `;
            fadeContentIn();
        } catch (error) {
            showError(error.message, 'Races');
        } finally {
            setLoading(false);
        }
    },
    technology: async () => {
        fadeContentIn();
        elements.mainContent.innerHTML = `<div class="loading">LOADING TECHNOLOGY...</div>`;
        if (elements.sectionTitle) elements.sectionTitle.textContent = 'TECHNOLOGY';
        if (elements.breadcrumbs) elements.breadcrumbs.innerHTML = 'Home / Technology';
        try {
            const response = await fetch('/api/technology');
            if (!response.ok) throw new Error('Failed to fetch technology data');
            const tech = await response.json();
            elements.mainContent.innerHTML = `
                <h2 class="section-header">TECHNOLOGY</h2>
                <div class="tech-grid">
                    ${tech.map(item => `
                        <div class="tech-card">
                            <h3>${item.name}</h3>
                            <p>${item.description}</p>
                            <div class="tech-details">
                                <span>Origin: ${item.origin}</span>
                                <span>Era: ${item.era}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            fadeContentIn();
        } catch (err) {
            elements.mainContent.innerHTML = `<div class="error">Error loading technology: ${err.message}</div>`;
            fadeContentIn();
        }
    },
};

// Show section with error handling
export async function showSection(section) {
    if (isLoading) return;

    // Cleanup before loading new section
    if (typeof currentCleanup === 'function') {
        currentCleanup();
        currentCleanup = null;
    }

    try {
        const sectionHandler = SECTION_MAP[section];
        if (!sectionHandler) {
            throw new Error(`Unknown section: ${section}`);
        }
        await sectionHandler();
    } catch (error) {
        console.error('Error showing section:', error);
        showError(error.message, section);
    }
}

// Highlight menu with accessibility
export function highlightMenu(section) {
    const buttons = elements.sidebar?.querySelectorAll('.sidebar-btn');
    if (!buttons) return;

    buttons.forEach(btn => {
        const isActive = btn.dataset.section === section;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
}

// Setup sidebar events with improved handling
export function setupSidebarEvents(resizeCallback) {
    if (!elements.sidebarTab || !elements.sidebar) return;

    let isOpen = false;

    const toggleSidebar = () => {
        isOpen = !isOpen;
        elements.sidebar.classList.toggle('open', isOpen);
        elements.sidebarTab.setAttribute('aria-expanded', isOpen);
        elements.sidebarTab.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');

        // Update content margin
        if (elements.contentOuterFrame) {
            elements.contentOuterFrame.style.marginLeft = isOpen ? '17vw' : '0';
        }

        if (resizeCallback) resizeCallback();
    };

    // Handle sidebar toggle button
    elements.sidebarTab.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSidebar();
    });

    // Handle escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen) {
            toggleSidebar();
        }
    });

    // Handle clicks outside sidebar
    document.addEventListener('click', (e) => {
        if (isOpen &&
            !elements.sidebar.contains(e.target) &&
            !elements.sidebarTab.contains(e.target)) {
            toggleSidebar();
        }
    });

    // Setup section buttons
    const buttons = elements.sidebar?.querySelectorAll('.sidebar-btn');
    if (buttons) {
        buttons.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const section = btn.dataset.section;
                if (section) {
                    highlightMenu(section);
                    await showSection(section);
                    if (window.innerWidth <= 900) {
                        toggleSidebar();
                    }
                }
            });
        });
    }
}

// Update sidebar tab position
function updateSidebarTab() {
    if (!elements.sidebarTab) return;
    elements.sidebarTab.style.left = elements.sidebar.classList.contains('open') ? '17vw' : '0';
}

// Adjust content frame with improved handling
export function adjustContentFrame() {
    if (!elements.contentOuterFrame || !elements.sidebar) return;

    const isOpen = elements.sidebar.classList.contains('open');
    const sidebarWidth = isOpen ? '17vw' : '0';

    elements.sidebar.style.width = sidebarWidth;
    elements.contentOuterFrame.style.marginLeft = sidebarWidth;
    updateSidebarTab();
}
