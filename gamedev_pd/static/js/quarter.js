/**
 * Quarter Drop Animation
 * Handles the arcade quarter insertion animation
 */

const QuarterAnimation = {
    canvas: null,
    ctx: null,
    animationRunning: false,

    /**
     * Initialize the animation canvas
     */
    init() {
        this.canvas = document.getElementById('animation-canvas');
        if (!this.canvas) {
            console.error('Animation canvas not found');
            return;
        }

        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();

        // Handle window resize
        window.addEventListener('resize', () => this.resizeCanvas());
    },

    /**
     * Resize canvas to match window size
     */
    resizeCanvas() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },

    /**
     * Play the quarter drop animation
     */
    play(callback) {
        if (!this.canvas || !this.ctx) {
            this.init();
        }

        if (this.animationRunning) return;

        // Show canvas
        this.canvas.classList.add('active');
        this.animationRunning = true;

        // Quarter properties
        const quarter = {
            x: this.canvas.width / 2,
            y: -100,
            targetY: this.canvas.height / 2,
            size: 60,
            rotation: 0,
            velocity: 0,
            gravity: 0.8
        };

        // Animation loop
        const animate = () => {
            // Clear canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Update position
            quarter.velocity += quarter.gravity;
            quarter.y += quarter.velocity;
            quarter.rotation += 15;

            // Draw quarter
            this.drawQuarter(quarter);

            // Check if animation should continue
            if (quarter.y < quarter.targetY + 50) {
                requestAnimationFrame(animate);
            } else {
                // Animation complete
                setTimeout(() => {
                    this.canvas.classList.remove('active');
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    this.animationRunning = false;
                    if (callback) callback();
                }, 300);
            }
        };

        animate();
    },

    /**
     * Draw the quarter
     */
    drawQuarter(quarter) {
        const ctx = this.ctx;

        ctx.save();
        ctx.translate(quarter.x, quarter.y);
        ctx.rotate((quarter.rotation * Math.PI) / 180);

        // Outer circle (gold)
        ctx.beginPath();
        ctx.arc(0, 0, quarter.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = '#FFD700';
        ctx.fill();
        ctx.strokeStyle = '#DAA520';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Inner circle (darker)
        ctx.beginPath();
        ctx.arc(0, 0, quarter.size / 3, 0, Math.PI * 2);
        ctx.fillStyle = '#B8860B';
        ctx.fill();

        // Glow effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#FFD700';
        ctx.beginPath();
        ctx.arc(0, 0, quarter.size / 2, 0, Math.PI * 2);
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    QuarterAnimation.init();
});
