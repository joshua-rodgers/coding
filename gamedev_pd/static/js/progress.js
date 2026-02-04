/**
 * Progress Tracker
 * Manages progress tracking and display
 */

const ProgressTracker = {
    /**
     * Calculate progress percentage for a domain
     */
    calculateProgress(domainNum, totalPages) {
        const domainProgress = StorageManager.getDomainProgress(domainNum);
        if (!domainProgress) return 0;

        const completedCount = domainProgress.completed.length;
        return Math.round((completedCount / totalPages) * 100);
    },

    /**
     * Get completed page count for a domain
     */
    getCompletedCount(domainNum) {
        const domainProgress = StorageManager.getDomainProgress(domainNum);
        if (!domainProgress) return 0;
        return domainProgress.completed.length;
    },

    /**
     * Update progress display on arcade lobby
     */
    updateLobbyProgress() {
        const cards = document.querySelectorAll('.cabinet-card');

        cards.forEach(card => {
            const domainNum = parseInt(card.dataset.domainNum);
            const totalPages = parseInt(card.dataset.totalPages);

            const completedCount = this.getCompletedCount(domainNum);
            const percentage = this.calculateProgress(domainNum, totalPages);

            // Update text
            const progressText = card.querySelector('.progress-text');
            if (progressText) {
                progressText.textContent = `${completedCount} / ${totalPages}`;
            }

            // Update progress bar
            const progressFill = card.querySelector('.progress-fill');
            if (progressFill) {
                progressFill.style.width = `${percentage}%`;
            }
        });
    },

    /**
     * Update progress display on domain page
     */
    updatePageProgress(domainNum, pageNum, totalPages) {
        const percentage = Math.round((pageNum / totalPages) * 100);

        // Update progress bar
        const progressFill = document.querySelector('.progress-bar-fill');
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }

        // Update text
        const progressText = document.querySelector('.progress-text');
        if (progressText) {
            progressText.textContent = `${pageNum} / ${totalPages} pages completed`;
        }
    },

    /**
     * Mark current page as visited/completed
     */
    markCurrentPage(domainNum, pageNum) {
        StorageManager.markPageCompleted(domainNum, pageNum);
    }
};
