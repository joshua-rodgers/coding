"""
Game Dev Arcade PD - Flask Application
Simple test server for the gamedev_pd blueprint
"""

from flask import Flask

app = Flask(__name__)

# Register the gamedev_pd blueprint
from gamedev_pd import gamedev_pd_bp
app.register_blueprint(gamedev_pd_bp, url_prefix='/gamedev-pd')


@app.route('/')
def index():
    """Landing page with neon arcade styling"""
    return '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Neon Arcade - Game Dev PD</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background: #0d0d1a;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: 'Press Start 2P', monospace;
            color: white;
            text-align: center;
            padding: 2rem;
            position: relative;
            overflow: hidden;
        }
        /* Circuit board background */
        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image:
                linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px),
                linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px),
                radial-gradient(circle at 50px 50px, rgba(139, 92, 246, 0.1) 2px, transparent 2px);
            background-size: 50px 50px;
            pointer-events: none;
            z-index: 0;
        }
        /* Gradient overlay */
        body::after {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.5) 100%);
            pointer-events: none;
            z-index: 0;
        }
        .content {
            position: relative;
            z-index: 1;
        }
        h1 {
            font-size: clamp(1.8rem, 6vw, 3.5rem);
            margin-bottom: 0.5rem;
            letter-spacing: 0.1em;
        }
        .title-neon {
            color: #ff00ff;
            text-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 40px #ff00ff;
        }
        .title-arcade {
            color: #00ffff;
            text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 40px #00ffff;
        }
        .subtitle {
            font-size: 0.6rem;
            color: #a0a0c0;
            letter-spacing: 0.3em;
            margin-bottom: 3rem;
        }
        .enter-btn {
            display: inline-block;
            padding: 1.2rem 2.5rem;
            background: linear-gradient(135deg, #ff00ff 0%, #8b5cf6 100%);
            border: none;
            border-radius: 50px;
            color: white;
            font-family: 'Press Start 2P', monospace;
            font-size: 0.8rem;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 0 20px rgba(255, 0, 255, 0.4);
        }
        .enter-btn:hover {
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 0 40px rgba(255, 0, 255, 0.6), 0 0 60px rgba(255, 0, 255, 0.4);
        }
        .footer {
            position: fixed;
            bottom: 2rem;
            font-size: 0.5rem;
            color: #6b6b8a;
        }
        /* Floating particles */
        .particles {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            overflow: hidden;
        }
        .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: #8b5cf6;
            border-radius: 50%;
            opacity: 0.5;
            animation: float 15s infinite;
        }
        .particle:nth-child(1) { left: 10%; animation-delay: 0s; }
        .particle:nth-child(2) { left: 20%; animation-delay: 2s; }
        .particle:nth-child(3) { left: 30%; animation-delay: 4s; }
        .particle:nth-child(4) { left: 40%; animation-delay: 6s; }
        .particle:nth-child(5) { left: 50%; animation-delay: 8s; }
        .particle:nth-child(6) { left: 60%; animation-delay: 10s; }
        .particle:nth-child(7) { left: 70%; animation-delay: 12s; }
        .particle:nth-child(8) { left: 80%; animation-delay: 14s; }
        .particle:nth-child(9) { left: 90%; animation-delay: 1s; }
        .particle:nth-child(10) { left: 95%; animation-delay: 3s; }
        @keyframes float {
            0%, 100% { transform: translateY(100vh) scale(0); opacity: 0; }
            10% { opacity: 0.5; }
            90% { opacity: 0.5; }
            100% { transform: translateY(-100vh) scale(1); opacity: 0; }
        }
    </style>
</head>
<body>
    <div class="particles">
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
        <div class="particle"></div>
    </div>
    <div class="content">
        <h1><span class="title-neon">NEON</span> <span class="title-arcade">ARCADE</span></h1>
        <p class="subtitle">PROFESSIONAL DEVELOPMENT EDITION</p>
        <a href="/gamedev-pd/" class="enter-btn">ENTER ARCADE</a>
    </div>
    <p class="footer">Arkansas Department of Education - 2026</p>
</body>
</html>'''


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
