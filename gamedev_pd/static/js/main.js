/**
 * Main Application Entry Point
 * Coordinates all modules
 */

const App = {
    /**
     * Initialize the application
     */
    init() {
        console.log('Game Dev PD Environment - Phase 1');
        console.log('Initializing...');

        // Initialize storage
        StorageManager.init();

        // Check which page we're on
        const isLobby = document.querySelector('.arcade-lobby') !== null;
        const isDomainPage = document.querySelector('.domain-page') !== null;

        if (isLobby) {
            this.initLobby();
        } else if (isDomainPage) {
            this.initDomainPage();
        }
    },

    /**
     * Initialize arcade lobby
     */
    initLobby() {
        console.log('Initializing Arcade Lobby');

        // Update progress displays
        ProgressTracker.updateLobbyProgress();

        // Check if first visit
        const visitedBefore = StorageManager.getSetting('visited_lobby');
        if (!visitedBefore) {
            this.showFirstVisitPrompt();
            StorageManager.setSetting('visited_lobby', true);
        }

        // Setup cabinet card click handlers
        this.setupCabinetHandlers();
    },

    /**
     * Show first visit prompt
     */
    showFirstVisitPrompt() {
        const prompt = document.getElementById('first-visit-prompt');
        if (prompt) {
            prompt.style.display = 'block';

            // Hide after 5 seconds
            setTimeout(() => {
                prompt.style.opacity = '0';
                setTimeout(() => {
                    prompt.style.display = 'none';
                }, 500);
            }, 5000);
        }
    },

    /**
     * Setup arcade cabinet click handlers
     */
    setupCabinetHandlers() {
        const startButtons = document.querySelectorAll('.start-button');

        startButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const domainNum = parseInt(button.dataset.domain);
                this.enterDomain(domainNum);
            });
        });

        // Also allow clicking on the whole card
        const cards = document.querySelectorAll('.cabinet-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const domainNum = parseInt(card.dataset.domainNum);
                this.enterDomain(domainNum);
            });
        });
    },

    /**
     * Enter a domain (with animation)
     */
    enterDomain(domainNum) {
        console.log('Entering domain', domainNum);

        // Get last visited page or start at 1
        const domainProgress = StorageManager.getDomainProgress(domainNum);
        const startPage = domainProgress?.current_page || 1;

        // Play quarter animation
        QuarterAnimation.play(() => {
            Navigation.goToDomain(domainNum, startPage);
        });
    },

    /**
     * Initialize domain page
     */
    initDomainPage() {
        console.log('Initializing Domain Page');

        // This will be populated by the template's inline script
        if (typeof pageData !== 'undefined') {
            this.handleDomainPage(pageData);
        }
    },

    /**
     * Handle domain page functionality
     */
    handleDomainPage(data) {
        const { domainNum, pageNum, totalPages, hasPrev, hasNext } = data;

        console.log(`Domain ${domainNum}, Page ${pageNum} of ${totalPages}`);

        // Mark page as visited
        ProgressTracker.markCurrentPage(domainNum, pageNum);

        // Update progress displays
        ProgressTracker.updatePageProgress(domainNum, pageNum, totalPages);

        // Setup keyboard navigation
        Navigation.setupKeyboardNavigation(domainNum, pageNum, totalPages, hasPrev, hasNext);

        // Setup navigation button handlers
        this.setupNavButtons(domainNum, pageNum, totalPages);
    },

    /**
     * Setup navigation button handlers
     */
    setupNavButtons(domainNum, pageNum, totalPages) {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        // These are already links, but we can add keyboard shortcuts
        // (handled in Navigation.setupKeyboardNavigation)
    }
};

/**
 * Arcade Lobby Specific Functionality
 */
const ArcadeLobby = {
    init() {
        console.log('Arcade Lobby Module Initialized');
        // Additional lobby-specific functionality can be added here
    }
};

/**
 * Domain Page Specific Functionality
 */
const DomainPage = {
    init(pageData) {
        console.log('Domain Page Module Initialized', pageData);
        // Additional page-specific functionality can be added here
    }
};

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Expose App globally for debugging
window.GameDevPD = {
    App,
    StorageManager,
    ProgressTracker,
    Navigation,
    QuarterAnimation
};
