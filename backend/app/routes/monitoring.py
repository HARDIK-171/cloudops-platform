from flask import Blueprint, jsonify

from app.services.monitoring_service import get_system_metrics

monitoring_bp = Blueprint("monitoring", __name__)


@monitoring_bp.route("/metrics")
def metrics():
    return jsonify(get_system_metrics())