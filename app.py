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
    """Redirect to the arcade lobby"""
    return '<h1>Game Dev Arcade PD</h1><p><a href="/gamedev-pd/">Enter the Arcade</a></p>'


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
