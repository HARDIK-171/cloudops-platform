from flask import Flask
from flask_cors import CORS

from app.routes.health import health_bp
from app.routes.monitoring import monitoring_bp
from app.routes.containers import containers_bp
from app.routes.deployments import deployments_bp
from app.routes.logs import logs_bp
from app.routes.alerts import alerts_bp


def create_app():
    app = Flask(__name__)

    CORS(app)

    app.register_blueprint(health_bp)
    app.register_blueprint(monitoring_bp)
    app.register_blueprint(containers_bp)
    app.register_blueprint(deployments_bp)
    app.register_blueprint(logs_bp)
    app.register_blueprint(alerts_bp)

    return app