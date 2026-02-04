/**
 * LocalStorage Manager
 * Handles all localStorage operations for the PD environment
 */

const StorageManager = {
    STORAGE_KEY: 'gamedev_pd_data',
    VERSION: '1.0',

    /**
     * Initialize storage with default data if not exists
     */
    init() {
        if (!this.exists()) {
            this.setDefaultData();
        }
        // Migrate old versions if necessary
        this.migrate();
    },

    /**
     * Check if storage data exists
     */
    exists() {
        return localStorage.getItem(this.STORAGE_KEY) !== null;
    },

    /**
     * Get all data from storage
     */
    getData() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    },

    /**
     * Save data to storage
     */
    setData(data) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error writing to localStorage:', error);
            return false;
        }
    },

    /**
     * Set default data structure
     */
    setDefaultData() {
        const defaultData = {
            version: this.VERSION,
            progress: {
                domain1: {
                    completed: [],
                    current_page: 1,
                    last_visited: null
                },
                domain2: {
                    completed: [],
                    current_page: 1,
                    last_visited: null
                },
                domain3: {
                    completed: [],
                    current_page: 1,
                    last_visited: null
                },
                domain4: {
                    completed: [],
                    current_page: 1,
                    last_visited: null
                }
            },
            settings: {
                audio_enabled: true,
                show_animations: true,
                visited_lobby: false
            },
            session_start: new Date().toISOString()
        };

        this.setData(defaultData);
    },

    /**
     * Migrate data from old versions
     */
    migrate() {
        const data = this.getData();
        if (!data) return;

        // If version is different, handle migration
        if (data.version !== this.VERSION) {
            console.log('Migrating data from version', data.version, 'to', this.VERSION);
            data.version = this.VERSION;
            this.setData(data);
        }
    },

    /**
     * Get progress for a specific domain
     */
    getDomainProgress(domainNum) {
        const data = this.getData();
        if (!data) return null;

        const domainKey = `domain${domainNum}`;
        return data.progress[domainKey] || null;
    },

    /**
     * Update progress for a specific domain
     */
    updateDomainProgress(domainNum, progressData) {
        const data = this.getData();
        if (!data) return false;

        const domainKey = `domain${domainNum}`;
        data.progress[domainKey] = {
            ...data.progress[domainKey],
            ...progressData
        };

        return this.setData(data);
    },

    /**
     * Mark a page as completed
     */
    markPageCompleted(domainNum, pageNum) {
        const data = this.getData();
        if (!data) return false;

        const domainKey = `domain${domainNum}`;
        const completed = data.progress[domainKey].completed || [];

        if (!completed.includes(pageNum)) {
            completed.push(pageNum);
            completed.sort((a, b) => a - b);
        }

        data.progress[domainKey].completed = completed;
        data.progress[domainKey].current_page = pageNum;
        data.progress[domainKey].last_visited = new Date().toISOString();

        return this.setData(data);
    },

    /**
     * Get setting value
     */
    getSetting(key) {
        const data = this.getData();
        if (!data || !data.settings) return null;
        return data.settings[key];
    },

    /**
     * Update setting value
     */
    setSetting(key, value) {
        const data = this.getData();
        if (!data) return false;

        data.settings[key] = value;
        return this.setData(data);
    },

    /**
     * Clear all storage (for testing/reset)
     */
    clear() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.setDefaultData();
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    StorageManager.init();
});
