# Phase 1 Implementation Plan: Skeleton & Foundation
## Game Development Professional Development Flask Blueprint

---

## OVERVIEW

### Purpose
Create the complete navigation structure, routing system, and retro visual aesthetic for the PD environment. This phase establishes the foundation for all subsequent content phases. NO actual content should be implemented - only the structure to hold it.

### Success Criteria
- [ ] User can navigate through all 4 domains via arcade cabinet cards
- [ ] All pages are accessible via prev/next navigation
- [ ] Quarter insertion animation plays when entering a domain
- [ ] Progress is tracked in localStorage
- [ ] Retro aesthetic is fully implemented
- [ ] All routing works correctly
- [ ] Foundation is ready for content insertion in Phase 2

---

## TECHNICAL STACK

### Backend
- **Framework**: Flask
- **Blueprint**: Self-contained, single blueprint
- **Database**: None (all data client-side)

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Custom styling (no frameworks)
- **JavaScript**: Vanilla JS (ES6+), Canvas API for animations
- **Storage**: localStorage API

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Minimum: ES6 support required

---

## FILE STRUCTURE

```
gamedev_pd/
├── __init__.py                 # Blueprint registration
├── routes.py                   # Flask routes
├── static/
│   ├── css/
│   │   ├── main.css           # Core styles
│   │   ├── arcade.css         # Arcade lobby specific
│   │   ├── domain.css         # Domain page styles
│   │   └── animations.css     # Animation definitions
│   ├── js/
│   │   ├── main.js            # Core functionality
│   │   ├── navigation.js      # Routing and nav
│   │   ├── storage.js         # localStorage manager
│   │   ├── quarter.js         # Quarter animation
│   │   └── progress.js        # Progress tracking
│   └── assets/
│       ├── fonts/
│       │   └── PressStart2P.ttf  # Pixel font
│       └── images/
│           └── .gitkeep
└── templates/
    ├── base.html              # Base template
    ├── arcade_lobby.html      # Main arcade screen
    └── domain_page.html       # Individual page template
```

---

## BLUEPRINT REGISTRATION

### File: `__init__.py`

```python
from flask import Blueprint

gamedev_pd_bp = Blueprint(
    'gamedev_pd',
    __name__,
    template_folder='templates',
    static_folder='static',
    static_url_path='/gamedev_pd/static'
)

from . import routes
```

### Registration in main app.py

```python
from gamedev_pd import gamedev_pd_bp

app.register_blueprint(gamedev_pd_bp, url_prefix='/gamedev-pd')
```

---

## ROUTING SPECIFICATION

### File: `routes.py`

All routes should be defined. Each route serves a template with page-specific data.

```python
from flask import render_template
from . import gamedev_pd_bp

@gamedev_pd_bp.route('/')
def arcade_lobby():
    """Main arcade lobby with 4 domain cabinets"""
    domains = [
        {
            'id': 'domain1',
            'number': 1,
            'title': 'Game Design Fundamentals',
            'total_pages': 38,
            'standards': ['1.1', '1.2', '1.3']
        },
        {
            'id': 'domain2',
            'number': 2,
            'title': 'Programming for Games',
            'total_pages': 39,
            'standards': ['2.1', '2.2', '2.3']
        },
        {
            'id': 'domain3',
            'number': 3,
            'title': 'Creative Assets and User Experience',
            'total_pages': 27,
            'standards': ['3.1', '3.2']
        },
        {
            'id': 'domain4',
            'number': 4,
            'title': 'Industry and Career Connections',
            'total_pages': 30,
            'standards': ['4.1', '4.2']
        }
    ]
    return render_template('arcade_lobby.html', domains=domains)

@gamedev_pd_bp.route('/domain/<int:domain_num>/page/<int:page_num>')
def domain_page(domain_num, page_num):
    """Individual page within a domain"""
    
    # Domain metadata
    domains_meta = {
        1: {'title': 'Game Design Fundamentals', 'total_pages': 38},
        2: {'title': 'Programming for Games', 'total_pages': 39},
        3: {'title': 'Creative Assets and User Experience', 'total_pages': 27},
        4: {'title': 'Industry and Career Connections', 'total_pages': 30}
    }
    
    domain_info = domains_meta.get(domain_num)
    if not domain_info:
        return "Domain not found", 404
    
    if page_num < 1 or page_num > domain_info['total_pages']:
        return "Page not found", 404
    
    # Calculate navigation
    has_prev = page_num > 1
    has_next = page_num < domain_info['total_pages']
    
    return render_template(
        'domain_page.html',
        domain_num=domain_num,
        page_num=page_num,
        domain_title=domain_info['title'],
        total_pages=domain_info['total_pages'],
        has_prev=has_prev,
        has_next=has_next
    )
```

---

## DATA MODELS

### localStorage Structure

```javascript
// Storage key: 'gamedev_pd_data'
{
  version: "1.0",
  progress: {
    domain1: {
      completed: [1, 2, 3, 5, 8],  // Completed page numbers
      current_page: 8,
      last_visited: "2024-02-04T10:30:00Z"
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
    visited_lobby: true
  },
  session_start: "2024-02-04T08:30:00Z"
}
```

---

## HTML TEMPLATES

### File: `templates/base.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% block title %}Game Dev Arcade PD{% endblock %}</title>
    
    <!-- CSS -->
    <link rel="stylesheet" href="{{ url_for('gamedev_pd.static', filename='css/main.css') }}">
    <link rel="stylesheet" href="{{ url_for('gamedev_pd.static', filename='css/animations.css') }}">
    {% block extra_css %}{% endblock %}
    
    <!-- Preload pixel font -->
    <link rel="preload" href="{{ url_for('gamedev_pd.static', filename='assets/fonts/PressStart2P.ttf') }}" as="font" type="font/ttf" crossorigin>
</head>
<body>
    <!-- CRT Overlay Effect -->
    <div class="crt-overlay"></div>
    
    <!-- Canvas for animations (quarter drop, etc) -->
    <canvas id="animation-canvas"></canvas>
    
    <!-- Main Content -->
    <div class="container">
        {% block content %}{% endblock %}
    </div>
    
    <!-- Core JavaScript -->
    <script src="{{ url_for('gamedev_pd.static', filename='js/storage.js') }}"></script>
    <script src="{{ url_for('gamedev_pd.static', filename='js/progress.js') }}"></script>
    <script src="{{ url_for('gamedev_pd.static', filename='js/navigation.js') }}"></script>
    <script src="{{ url_for('gamedev_pd.static', filename='js/main.js') }}"></script>
    {% block extra_js %}{% endblock %}
</body>
</html>
```

### File: `templates/arcade_lobby.html`

```html
{% extends "base.html" %}

{% block extra_css %}
<link rel="stylesheet" href="{{ url_for('gamedev_pd.static', filename='css/arcade.css') }}">
{% endblock %}

{% block content %}
<div class="arcade-lobby">
    <!-- Header -->
    <header class="arcade-header">
        <h1 class="arcade-title pixel-text">GAME DEV ARCADE</h1>
        <p class="arcade-subtitle">Professional Development Edition</p>
    </header>
    
    <!-- Insert Coin Prompt (only shows on first visit) -->
    <div id="first-visit-prompt" class="insert-coin-prompt" style="display: none;">
        <p class="pixel-text blink">INSERT QUARTER TO BEGIN</p>
        <p class="small-text">Click any arcade cabinet</p>
    </div>
    
    <!-- Domain Cabinets Grid -->
    <div class="cabinets-grid">
        {% for domain in domains %}
        <div class="cabinet-card" 
             data-domain-id="{{ domain.id }}"
             data-domain-num="{{ domain.number }}"
             data-total-pages="{{ domain.total_pages }}">
            
            <!-- Cabinet Screen -->
            <div class="cabinet-screen">
                <div class="screen-content">
                    <div class="domain-number">DOMAIN {{ domain.number }}</div>
                    <h2 class="domain-title">{{ domain.title }}</h2>
                    <div class="standards-list">
                        Standards: {{ domain.standards | join(', ') }}
                    </div>
                    <div class="progress-display">
                        <span class="progress-text">0 / {{ domain.total_pages }}</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 0%;"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Cabinet Controls -->
            <div class="cabinet-controls">
                <button class="start-button pixel-text" data-domain="{{ domain.number }}">
                    START
                </button>
            </div>
            
            <!-- Coin Slot -->
            <div class="coin-slot"></div>
        </div>
        {% endfor %}
    </div>
    
    <!-- Footer Info -->
    <footer class="arcade-footer">
        <p class="pixel-text small">Arkansas Department of Education • 2026</p>
    </footer>
</div>
{% endblock %}

{% block extra_js %}
<script src="{{ url_for('gamedev_pd.static', filename='js/quarter.js') }}"></script>
<script>
    // Initialize arcade lobby
    document.addEventListener('DOMContentLoaded', () => {
        ArcadeLobby.init();
    });
</script>
{% endblock %}
```

### File: `templates/domain_page.html`

```html
{% extends "base.html" %}

{% block extra_css %}
<link rel="stylesheet" href="{{ url_for('gamedev_pd.static', filename='css/domain.css') }}">
{% endblock %}

{% block content %}
<div class="domain-page">
    <!-- Navigation Bar -->
    <nav class="nav-bar">
        <div class="nav-left">
            <a href="{{ url_for('gamedev_pd.arcade_lobby') }}" class="nav-button pixel-text" id="home-btn">
                ← ARCADE
            </a>
        </div>
        
        <div class="nav-center">
            <span class="domain-label pixel-text">DOMAIN {{ domain_num }}</span>
            <span class="page-counter pixel-text">PAGE {{ page_num }} / {{ total_pages }}</span>
        </div>
        
        <div class="nav-right">
            {% if has_prev %}
            <a href="{{ url_for('gamedev_pd.domain_page', domain_num=domain_num, page_num=page_num-1) }}" 
               class="nav-button pixel-text" id="prev-btn">
                ◄ PREV
            </a>
            {% endif %}
            
            {% if has_next %}
            <a href="{{ url_for('gamedev_pd.domain_page', domain_num=domain_num, page_num=page_num+1) }}" 
               class="nav-button pixel-text" id="next-btn">
                NEXT ►
            </a>
            {% endif %}
        </div>
    </nav>
    
    <!-- Page Content Container -->
    <main class="page-content">
        <!-- This is where content will be inserted in Phase 2+ -->
        <div class="placeholder-content">
            <div class="placeholder-box">
                <h2 class="pixel-text">PLACEHOLDER</h2>
                <p class="pixel-text small">Domain {{ domain_num }} - Page {{ page_num }}</p>
                <p class="pixel-text small">{{ domain_title }}</p>
                <p style="margin-top: 2rem; color: #888; font-size: 0.8rem;">
                    Content will be added in Phase 2
                </p>
            </div>
        </div>
    </main>
    
    <!-- Progress Indicator -->
    <div class="progress-indicator">
        <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: {{ (page_num / total_pages * 100) }}%;"></div>
        </div>
        <span class="progress-text pixel-text small">
            {{ page_num }} / {{ total_pages }} pages completed
        </span>
    </div>
</div>
{% endblock %}

{% block extra_js %}
<script>
    // Page-specific data
    const pageData = {
        domainNum: {{ domain_num }},
        pageNum: {{ page_num }},
        totalPages: {{ total_pages }},
        hasPrev: {{ has_prev | tojson }},
        hasNext: {{ has_next | tojson }}
    };
    
    // Initialize page
    document.addEventListener('DOMContentLoaded', () => {
        DomainPage.init(pageData);
    });
</script>
{% endblock %}
```

---

## CSS SPECIFICATIONS

### File: `static/css/main.css`

```css
/* ============================================
   GAME DEV ARCADE PD - MAIN STYLES
   ============================================ */

/* Import Pixel Font */
@font-face {
    font-family: 'Press Start 2P';
    src: url('../assets/fonts/PressStart2P.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
}

/* ============================================
   ROOT VARIABLES - RETRO COLOR PALETTE
   ============================================ */
:root {
    /* Primary Colors */
    --color-bg-dark: #0a0a0f;
    --color-bg-medium: #1a1a2e;
    --color-bg-light: #16213e;
    
    /* Accent Colors */
    --color-primary: #00ff41;      /* Matrix green */
    --color-secondary: #ff006e;    /* Hot pink */
    --color-tertiary: #00d9ff;     /* Cyan */
    --color-warning: #ffbe0b;      /* Yellow */
    
    /* Text Colors */
    --color-text-primary: #ffffff;
    --color-text-secondary: #00ff41;
    --color-text-dim: #888888;
    
    /* UI Elements */
    --color-border: #00ff41;
    --color-shadow: rgba(0, 255, 65, 0.3);
    --color-highlight: rgba(0, 255, 65, 0.1);
    
    /* Spacing */
    --spacing-xs: 0.5rem;
    --spacing-sm: 1rem;
    --spacing-md: 1.5rem;
    --spacing-lg: 2rem;
    --spacing-xl: 3rem;
    
    /* Border Radius */
    --radius-sm: 4px;
    --radius-md: 8px;
    
    /* Transitions */
    --transition-fast: 0.15s ease;
    --transition-medium: 0.3s ease;
    --transition-slow: 0.5s ease;
}

/* ============================================
   RESET & BASE STYLES
   ============================================ */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    font-size: 16px;
    height: 100%;
}

body {
    font-family: 'Press Start 2P', cursive;
    background-color: var(--color-bg-dark);
    color: var(--color-text-primary);
    line-height: 1.6;
    min-height: 100vh;
    overflow-x: hidden;
    position: relative;
}

/* ============================================
   CRT SCREEN EFFECT
   ============================================ */
.crt-overlay {
    pointer-events: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    
    /* Scanlines */
    background: repeating-linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.15),
        rgba(0, 0, 0, 0.15) 1px,
        transparent 1px,
        transparent 2px
    );
    
    /* Slight flicker */
    animation: flicker 0.15s infinite;
}

@keyframes flicker {
    0% { opacity: 0.97; }
    50% { opacity: 0.99; }
    100% { opacity: 0.97; }
}

/* Optional: More pronounced CRT curve effect */
.crt-overlay::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
        ellipse at center,
        transparent 0%,
        rgba(0, 0, 0, 0.3) 100%
    );
}

/* ============================================
   ANIMATION CANVAS
   ============================================ */
#animation-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9998;
    pointer-events: none;
    display: none; /* Hidden until animation plays */
}

#animation-canvas.active {
    display: block;
}

/* ============================================
   CONTAINER & LAYOUT
   ============================================ */
.container {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: var(--spacing-md);
    min-height: 100vh;
}

/* ============================================
   TYPOGRAPHY UTILITIES
   ============================================ */
.pixel-text {
    font-family: 'Press Start 2P', cursive;
    letter-spacing: 0.05em;
    text-transform: uppercase;
}

.small-text,
.pixel-text.small {
    font-size: 0.6rem;
    line-height: 1.4;
}

.medium-text {
    font-size: 0.8rem;
}

.large-text {
    font-size: 1.2rem;
}

/* ============================================
   TEXT EFFECTS
   ============================================ */

/* Glowing text */
.glow-text {
    text-shadow: 
        0 0 5px var(--color-primary),
        0 0 10px var(--color-primary),
        0 0 20px var(--color-primary);
}

/* Blinking text */
.blink {
    animation: blink 1s infinite;
}

@keyframes blink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
}

/* ============================================
   BUTTONS
   ============================================ */
.nav-button,
.start-button {
    font-family: 'Press Start 2P', cursive;
    font-size: 0.7rem;
    padding: var(--spacing-sm) var(--spacing-md);
    background-color: var(--color-bg-medium);
    color: var(--color-primary);
    border: 2px solid var(--color-primary);
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    position: relative;
    transition: all var(--transition-fast);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.nav-button:hover,
.start-button:hover {
    background-color: var(--color-primary);
    color: var(--color-bg-dark);
    box-shadow: 
        0 0 10px var(--color-primary),
        0 0 20px var(--color-shadow);
    transform: translateY(-2px);
}

.nav-button:active,
.start-button:active {
    transform: translateY(0);
    box-shadow: 
        0 0 5px var(--color-primary);
}

/* Disabled state */
.nav-button.disabled,
.start-button:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    pointer-events: none;
}

/* ============================================
   PROGRESS BARS
   ============================================ */
.progress-bar,
.progress-bar-container {
    width: 100%;
    height: 20px;
    background-color: var(--color-bg-dark);
    border: 2px solid var(--color-primary);
    position: relative;
    overflow: hidden;
}

.progress-fill,
.progress-bar-fill {
    height: 100%;
    background: linear-gradient(
        90deg,
        var(--color-primary) 0%,
        var(--color-tertiary) 100%
    );
    transition: width var(--transition-medium);
    position: relative;
}

/* Animated scanning effect on progress bar */
.progress-fill::after,
.progress-bar-fill::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.3),
        transparent
    );
    animation: progress-scan 2s infinite;
}

@keyframes progress-scan {
    0% { left: -100%; }
    100% { left: 200%; }
}

/* ============================================
   UTILITY CLASSES
   ============================================ */
.text-center {
    text-align: center;
}

.hidden {
    display: none !important;
}

.fade-in {
    animation: fadeIn var(--transition-medium);
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.slide-up {
    animation: slideUp var(--transition-medium);
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* ============================================
   RESPONSIVE UTILITIES
   ============================================ */
@media (max-width: 768px) {
    html {
        font-size: 14px;
    }
    
    .container {
        padding: var(--spacing-sm);
    }
    
    .pixel-text {
        font-size: 0.7rem;
    }
    
    .pixel-text.small {
        font-size: 0.5rem;
    }
}

@media (max-width: 480px) {
    html {
        font-size: 12px;
    }
}
```

### File: `static/css/arcade.css`

```css
/* ============================================
   ARCADE LOBBY STYLES
   ============================================ */

.arcade-lobby {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    padding: var(--spacing-lg);
}

/* ============================================
   HEADER
   ============================================ */
.arcade-header {
    text-align: center;
    margin-bottom: var(--spacing-xl);
    animation: slideUp 0.6s ease;
}

.arcade-title {
    font-size: 2rem;
    color: var(--color-primary);
    margin-bottom: var(--spacing-sm);
    text-shadow: 
        0 0 10px var(--color-primary),
        0 0 20px var(--color-primary),
        0 0 30px var(--color-shadow);
    letter-spacing: 0.1em;
}

.arcade-subtitle {
    font-size: 0.8rem;
    color: var(--color-tertiary);
    letter-spacing: 0.2em;
}

/* ============================================
   INSERT COIN PROMPT
   ============================================ */
.insert-coin-prompt {
    text-align: center;
    margin: var(--spacing-xl) 0;
    padding: var(--spacing-lg);
}

.insert-coin-prompt .pixel-text {
    font-size: 1.2rem;
    color: var(--color-warning);
    margin-bottom: var(--spacing-sm);
}

/* ============================================
   CABINETS GRID
   ============================================ */
.cabinets-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: var(--spacing-lg);
    margin: var(--spacing-xl) 0;
    flex: 1;
}

/* ============================================
   CABINET CARD
   ============================================ */
.cabinet-card {
    background-color: var(--color-bg-medium);
    border: 3px solid var(--color-primary);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
    position: relative;
    transition: all var(--transition-medium);
    cursor: pointer;
    animation: fadeIn 0.6s ease;
    animation-fill-mode: both;
}

/* Staggered animation for cards */
.cabinet-card:nth-child(1) { animation-delay: 0.1s; }
.cabinet-card:nth-child(2) { animation-delay: 0.2s; }
.cabinet-card:nth-child(3) { animation-delay: 0.3s; }
.cabinet-card:nth-child(4) { animation-delay: 0.4s; }

.cabinet-card:hover {
    transform: translateY(-5px);
    box-shadow: 
        0 0 20px var(--color-shadow),
        0 5px 30px rgba(0, 0, 0, 0.5);
    border-color: var(--color-tertiary);
}

/* ============================================
   CABINET SCREEN
   ============================================ */
.cabinet-screen {
    background: linear-gradient(
        135deg,
        var(--color-bg-dark) 0%,
        var(--color-bg-light) 100%
    );
    border: 2px solid var(--color-primary);
    padding: var(--spacing-md);
    margin-bottom: var(--spacing-md);
    min-height: 280px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
}

/* Screen scanline effect */
.cabinet-screen::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
        0deg,
        rgba(0, 255, 65, 0.03),
        rgba(0, 255, 65, 0.03) 1px,
        transparent 1px,
        transparent 3px
    );
    pointer-events: none;
}

.screen-content {
    width: 100%;
    text-align: center;
    position: relative;
    z-index: 1;
}

.domain-number {
    font-size: 0.7rem;
    color: var(--color-tertiary);
    margin-bottom: var(--spacing-sm);
    letter-spacing: 0.15em;
}

.domain-title {
    font-size: 0.9rem;
    color: var(--color-primary);
    margin-bottom: var(--spacing-md);
    line-height: 1.4;
    text-shadow: 0 0 10px var(--color-shadow);
}

.standards-list {
    font-size: 0.6rem;
    color: var(--color-text-dim);
    margin-bottom: var(--spacing-lg);
    letter-spacing: 0.05em;
}

/* ============================================
   PROGRESS DISPLAY
   ============================================ */
.progress-display {
    margin-top: var(--spacing-md);
}

.progress-text {
    display: block;
    font-size: 0.6rem;
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-xs);
}

.cabinet-card .progress-bar {
    margin-bottom: var(--spacing-sm);
}

/* ============================================
   CABINET CONTROLS
   ============================================ */
.cabinet-controls {
    display: flex;
    justify-content: center;
    margin-top: var(--spacing-md);
}

.start-button {
    width: 100%;
    font-size: 0.9rem;
    padding: var(--spacing-md);
    background-color: var(--color-bg-dark);
    border: 3px solid var(--color-primary);
}

.start-button:hover {
    background-color: var(--color-primary);
    color: var(--color-bg-dark);
}

/* ============================================
   COIN SLOT (decorative)
   ============================================ */
.coin-slot {
    position: absolute;
    top: var(--spacing-sm);
    right: var(--spacing-sm);
    width: 30px;
    height: 6px;
    background-color: var(--color-bg-dark);
    border: 1px solid var(--color-primary);
    border-radius: 3px;
}

/* ============================================
   FOOTER
   ============================================ */
.arcade-footer {
    text-align: center;
    margin-top: var(--spacing-xl);
    padding-top: var(--spacing-lg);
    border-top: 2px solid var(--color-border);
}

.arcade-footer p {
    color: var(--color-text-dim);
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 1024px) {
    .cabinets-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .arcade-title {
        font-size: 1.5rem;
    }
    
    .cabinets-grid {
        grid-template-columns: 1fr;
        gap: var(--spacing-md);
    }
    
    .cabinet-screen {
        min-height: 220px;
    }
}

@media (max-width: 480px) {
    .arcade-lobby {
        padding: var(--spacing-sm);
    }
    
    .arcade-title {
        font-size: 1.2rem;
    }
}
```

### File: `static/css/domain.css`

```css
/* ============================================
   DOMAIN PAGE STYLES
   ============================================ */

.domain-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

/* ============================================
   NAVIGATION BAR
   ============================================ */
.nav-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-md);
    background-color: var(--color-bg-medium);
    border-bottom: 3px solid var(--color-primary);
    position: sticky;
    top: 0;
    z-index: 100;
    gap: var(--spacing-md);
}

.nav-left,
.nav-center,
.nav-right {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}

.nav-center {
    flex: 1;
    justify-content: center;
    flex-direction: column;
    text-align: center;
}

.domain-label {
    font-size: 0.7rem;
    color: var(--color-tertiary);
    margin-bottom: 0.25rem;
}

.page-counter {
    font-size: 0.6rem;
    color: var(--color-primary);
}

.nav-button {
    font-size: 0.6rem;
    padding: 0.7rem 1rem;
    white-space: nowrap;
}

/* ============================================
   PAGE CONTENT
   ============================================ */
.page-content {
    flex: 1;
    padding: var(--spacing-xl);
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
}

/* ============================================
   PLACEHOLDER CONTENT (Phase 1 only)
   ============================================ */
.placeholder-content {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 400px;
}

.placeholder-box {
    text-align: center;
    padding: var(--spacing-xl);
    border: 3px dashed var(--color-primary);
    background-color: var(--color-bg-medium);
    border-radius: var(--radius-md);
    max-width: 600px;
}

.placeholder-box h2 {
    color: var(--color-primary);
    margin-bottom: var(--spacing-md);
    font-size: 1.5rem;
}

.placeholder-box p {
    margin: var(--spacing-sm) 0;
    color: var(--color-text-dim);
}

/* ============================================
   PROGRESS INDICATOR (bottom of page)
   ============================================ */
.progress-indicator {
    padding: var(--spacing-md);
    background-color: var(--color-bg-medium);
    border-top: 3px solid var(--color-primary);
}

.progress-bar-container {
    margin-bottom: var(--spacing-sm);
}

.progress-text {
    display: block;
    text-align: center;
    color: var(--color-text-secondary);
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 768px) {
    .nav-bar {
        flex-wrap: wrap;
    }
    
    .nav-center {
        order: -1;
        width: 100%;
        margin-bottom: var(--spacing-sm);
    }
    
    .nav-button {
        font-size: 0.5rem;
        padding: 0.5rem 0.7rem;
    }
    
    .page-content {
        padding: var(--spacing-md);
    }
}

@media (max-width: 480px) {
    .nav-left,
    .nav-right {
        flex: 1;
    }
    
    .nav-button {
        width: 100%;
        text-align: center;
    }
}
```

### File: `static/css/animations.css`

```css
/* ============================================
   ANIMATIONS
   ============================================ */

/* Quarter drop animation (used when entering domain) */
@keyframes quarterDrop {
    0% {
        transform: translateY(-100vh) rotate(0deg);
        opacity: 1;
    }
    70% {
        transform: translateY(50vh) rotate(720deg);
        opacity: 1;
    }
    85% {
        transform: translateY(45vh) rotate(720deg);
        opacity: 1;
    }
    100% {
        transform: translateY(50vh) rotate(720deg);
        opacity: 0;
    }
}

.quarter-animation {
    position: fixed;
    width: 80px;
    height: 80px;
    background: radial-gradient(
        circle,
        var(--color-warning) 0%,
        var(--color-warning) 40%,
        var(--color-bg-dark) 40%,
        var(--color-bg-dark) 45%,
        var(--color-warning) 45%
    );
    border-radius: 50%;
    border: 3px solid var(--color-warning);
    box-shadow: 
        0 0 20px var(--color-warning),
        inset 0 0 10px rgba(0, 0, 0, 0.5);
    z-index: 10000;
    animation: quarterDrop 1.5s ease-in forwards;
}

/* Screen flash effect */
@keyframes screenFlash {
    0%, 100% {
        background-color: transparent;
    }
    50% {
        background-color: rgba(0, 255, 65, 0.3);
    }
}

.screen-flash {
    animation: screenFlash 0.3s ease;
}

/* Pixel dissolve effect */
@keyframes pixelDissolve {
    0% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.5;
        transform: scale(1.05);
        filter: blur(2px);
    }
    100% {
        opacity: 0;
        transform: scale(0.95);
        filter: blur(4px);
    }
}

.pixel-dissolve {
    animation: pixelDissolve 0.5s ease forwards;
}

/* Glitch effect */
@keyframes glitch {
    0% {
        transform: translate(0);
    }
    20% {
        transform: translate(-2px, 2px);
    }
    40% {
        transform: translate(-2px, -2px);
    }
    60% {
        transform: translate(2px, 2px);
    }
    80% {
        transform: translate(2px, -2px);
    }
    100% {
        transform: translate(0);
    }
}

.glitch {
    animation: glitch 0.3s ease;
}

/* Pulse glow */
@keyframes pulseGlow {
    0%, 100% {
        box-shadow: 0 0 5px var(--color-primary);
    }
    50% {
        box-shadow: 0 0 20px var(--color-primary),
                    0 0 30px var(--color-shadow);
    }
}

.pulse-glow {
    animation: pulseGlow 2s ease infinite;
}

/* Loading dots */
@keyframes loadingDots {
    0%, 20% {
        content: '.';
    }
    40% {
        content: '..';
    }
    60%, 100% {
        content: '...';
    }
}

.loading-dots::after {
    content: '';
    animation: loadingDots 1.5s infinite;
}
```

---

## JAVASCRIPT SPECIFICATIONS

### File: `static/js/storage.js`

```javascript
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
```

### File: `static/js/progress.js`

```javascript
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
```

### File: `static/js/quarter.js`

```javascript
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
```

### File: `static/js/navigation.js`

```javascript
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
```

### File: `static/js/main.js`

```javascript
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
```

---

## ADDITIONAL COMPONENTS

### Arcade Lobby JavaScript Module

```javascript
/**
 * Arcade Lobby Specific Functionality
 */

const ArcadeLobby = {
    init() {
        console.log('Arcade Lobby Module Initialized');
        // Additional lobby-specific functionality can be added here
    }
};
```

### Domain Page JavaScript Module

```javascript
/**
 * Domain Page Specific Functionality
 */

const DomainPage = {
    init(pageData) {
        console.log('Domain Page Module Initialized', pageData);
        // Additional page-specific functionality can be added here
    }
};
```

---

## FONT INSTALLATION

The blueprint requires the "Press Start 2P" pixel font. 

### Option 1: Google Fonts (Recommended)
Update `base.html` to include:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
```

### Option 2: Self-Hosted
1. Download "Press Start 2P" font from Google Fonts
2. Place in `static/assets/fonts/PressStart2P.ttf`
3. Already configured in `main.css` @font-face rule

---

## TESTING CHECKLIST

### Phase 1 Completion Criteria

#### Routing & Navigation
- [ ] Home route (/) displays arcade lobby
- [ ] Domain routes (/domain/1/page/1, etc.) display correctly
- [ ] All 4 domains accessible
- [ ] Page navigation (prev/next) works
- [ ] Invalid routes show 404
- [ ] Navigation respects page boundaries (no prev on page 1, etc.)

#### Visual Aesthetic
- [ ] Pixel font loads correctly
- [ ] CRT scanline effect visible
- [ ] Retro color scheme applied throughout
- [ ] Cabinet cards display properly
- [ ] Progress bars render correctly
- [ ] Navigation bar appears on domain pages
- [ ] Animations are smooth

#### localStorage Integration
- [ ] Data initializes on first visit
- [ ] Progress saved when visiting pages
- [ ] Progress persists across sessions
- [ ] Settings saved correctly
- [ ] Can clear/reset data

#### Quarter Animation
- [ ] Canvas initializes properly
- [ ] Animation plays when entering domain
- [ ] Animation completes before navigation
- [ ] Canvas hides after animation
- [ ] Resizes correctly on window resize

#### Progress Tracking
- [ ] Lobby shows accurate progress for each domain
- [ ] Page counter displays correctly
- [ ] Progress bar fills accurately
- [ ] Completed pages tracked correctly
- [ ] Current page saved correctly

#### Keyboard Controls
- [ ] Left arrow goes to previous page
- [ ] Right arrow goes to next page
- [ ] Escape returns to lobby
- [ ] Keyboard shortcuts don't trigger on inputs

#### Responsive Design
- [ ] Works on desktop (1920x1080)
- [ ] Works on laptop (1366x768)
- [ ] Works on tablet (768x1024)
- [ ] Works on mobile (375x667)
- [ ] Text remains readable at all sizes
- [ ] Navigation accessible on all devices

#### Browser Compatibility
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge

---

## PLACEHOLDER CONTENT NOTES

All content in Phase 1 should be placeholder only. The placeholder box should appear on every domain page with:
- "PLACEHOLDER" heading
- Domain number
- Page number
- Domain title
- "Content will be added in Phase 2" message

This ensures the structure is ready for content insertion without premature implementation.

---

## DEPLOYMENT NOTES

### Development Setup
```bash
# In main Flask app
from gamedev_pd import gamedev_pd_bp
app.register_blueprint(gamedev_pd_bp, url_prefix='/gamedev-pd')

# Run Flask app
python app.py
```

### Access Points
- Lobby: `http://localhost:5000/gamedev-pd/`
- Domain 1, Page 1: `http://localhost:5000/gamedev-pd/domain/1/page/1`

---

## PHASE 1 SUCCESS METRICS

Phase 1 is complete when:

1. ✅ All routing works without errors
2. ✅ Visual aesthetic is consistent and appealing
3. ✅ Navigation between all pages is smooth
4. ✅ Progress tracking saves and displays correctly
5. ✅ Quarter animation plays reliably
6. ✅ Responsive design works on all target devices
7. ✅ localStorage integration is functional
8. ✅ Code is clean, commented, and ready for Phase 2
9. ✅ No content is implemented (only structure)
10. ✅ All checklist items pass

---

## NEXT STEPS AFTER PHASE 1

Once Phase 1 is verified and complete:

1. **Phase 2** will focus on implementing static content pages
2. Content will be inserted into the `.page-content` container
3. Different page types will be defined (text, discussion, checkpoint)
4. Content will replace placeholder boxes
5. The navigation and structure from Phase 1 will remain unchanged

---

## ADDITIONAL NOTES FOR LLM IMPLEMENTATION

### Code Organization Principles
- Keep functions small and focused
- Use clear, descriptive variable names
- Comment complex logic
- Maintain consistent code style
- Separate concerns (storage, navigation, display)

### Error Handling
- Always wrap localStorage operations in try-catch
- Provide fallbacks for missing data
- Log errors to console for debugging
- Don't crash on invalid inputs

### Performance Considerations
- Minimize DOM queries (cache selectors)
- Use event delegation where appropriate
- Avoid unnecessary reflows
- Optimize canvas animations

### Accessibility Considerations (for future phases)
- Use semantic HTML
- Ensure keyboard navigation works
- Provide ARIA labels where needed
- Maintain good color contrast ratios

### Browser Storage
- Check for localStorage availability before using
- Handle quota exceeded errors
- Provide clear data for debugging
- Version data for future migrations

---

**END OF PHASE 1 IMPLEMENTATION PLAN**
