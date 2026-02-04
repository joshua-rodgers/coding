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
    """Landing page with arcade styling"""
    return '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Game Dev Arcade PD</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            background: #0a0a0a;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: 'Press Start 2P', monospace;
            color: #00ff41;
            text-align: center;
            padding: 2rem;
        }
        h1 {
            font-size: clamp(1.5rem, 5vw, 3rem);
            text-shadow: 0 0 10px #00ff41, 0 0 20px #00ff41;
            margin-bottom: 2rem;
            animation: flicker 3s infinite;
        }
        .enter-btn {
            display: inline-block;
            padding: 1.5rem 3rem;
            background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%);
            border: 3px solid #00ff41;
            color: #00ff41;
            font-family: 'Press Start 2P', monospace;
            font-size: 1rem;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 0 10px rgba(0, 255, 65, 0.3);
        }
        .enter-btn:hover {
            background: #00ff41;
            color: #0a0a0a;
            box-shadow: 0 0 30px rgba(0, 255, 65, 0.8);
            transform: scale(1.05);
        }
        .subtitle {
            font-size: 0.7rem;
            color: #888;
            margin-top: 2rem;
        }
        @keyframes flicker {
            0%, 100% { opacity: 1; }
            92% { opacity: 1; }
            93% { opacity: 0.8; }
            94% { opacity: 1; }
            95% { opacity: 0.9; }
            96% { opacity: 1; }
        }
    </style>
</head>
<body>
    <h1>GAME DEV ARCADE</h1>
    <a href="/gamedev-pd/" class="enter-btn">INSERT COIN</a>
    <p class="subtitle">Professional Development Edition</p>
</body>
</html>'''


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
