from flask import Blueprint, jsonify
from app.config.settings import APP_NAME, VERSION

health_bp = Blueprint("health", __name__)


@health_bp.route("/")
def home():
    return jsonify(
        {
            "application": APP_NAME,
            "message": "Welcome to CloudOps Platform",
        }
    )


@health_bp.route("/health")
def health():
    return jsonify(
        {
            "status": "healthy",
        }
    )


@health_bp.route("/version")
def version():
    return jsonify(
        {
            "version": VERSION,
        }
    )