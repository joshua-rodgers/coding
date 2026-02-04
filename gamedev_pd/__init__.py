from flask import Blueprint

gamedev_pd_bp = Blueprint(
    'gamedev_pd',
    __name__,
    template_folder='templates',
    static_folder='static',
    static_url_path='/gamedev_pd/static'
)

from . import routes
