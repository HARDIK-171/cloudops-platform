from flask import jsonify
from config import APP_NAME, VERSION
from system import get_system_metrics

def register_routes(app):

    @app.route("/")
    def home():
        return jsonify({
            "application": APP_NAME,
            "message": "Welcome to CloudOps Platform"
        })
    @app.route("/metrics")
    def metrics():
        return jsonify(get_system_metrics())

    @app.route("/health")
    def health():
        return jsonify({
            "status": "healthy"
        })

    @app.route("/version")
    def version():
        return jsonify({
            "version": VERSION
        })