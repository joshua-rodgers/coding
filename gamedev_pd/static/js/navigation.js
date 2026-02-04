/**
 * Navigation Manager
 * Handles navigation between pages and domains
 */

const Navigation = {
    /**
     * Navigate to a domain page
     */
    goToDomain(domainNum, pageNum = 1) {
        const url = `/gamedev-pd/domain/${domainNum}/page/${pageNum}`;
        window.location.href = url;
    },

    /**
     * Navigate to arcade lobby
     */
    goToLobby() {
        window.location.href = '/gamedev-pd/';
    },

    /**
     * Navigate to next page
     */
    nextPage(domainNum, currentPage, totalPages) {
        if (currentPage < totalPages) {
            this.goToDomain(domainNum, currentPage + 1);
        }
    },

    /**
     * Navigate to previous page
     */
    prevPage(domainNum, currentPage) {
        if (currentPage > 1) {
            this.goToDomain(domainNum, currentPage - 1);
        }
    },

    /**
     * Handle keyboard navigation
     */
    setupKeyboardNavigation(domainNum, currentPage, totalPages, hasPrev, hasNext) {
        document.addEventListener('keydown', (e) => {
            // Left arrow - previous page
            if (e.key === 'ArrowLeft' && hasPrev) {
                e.preventDefault();
                this.prevPage(domainNum, currentPage);
            }

            // Right arrow - next page
            if (e.key === 'ArrowRight' && hasNext) {
                e.preventDefault();
                this.nextPage(domainNum, currentPage, totalPages);
            }

            // Escape - back to lobby
            if (e.key === 'Escape') {
                e.preventDefault();
                this.goToLobby();
            }
        });
    }
};
