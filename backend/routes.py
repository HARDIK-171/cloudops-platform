from flask import jsonify
from config import APP_NAME, VERSION


def register_routes(app):

    @app.route("/")
    def home():
        return jsonify({
            "application": APP_NAME,
            "message": "Welcome to CloudOps Platform"
        })

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