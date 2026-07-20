from flask import Blueprint, jsonify, request
from app.services.alert_service import get_all_alerts, get_active_alerts, dismiss_alert

alerts_bp = Blueprint("alerts", __name__)

@alerts_bp.route("/alerts", methods=["GET"])
def list_alerts():
    active_only = request.args.get("active", "false").lower() == "true"
    if active_only:
        return jsonify(get_active_alerts())
    return jsonify(get_all_alerts())

@alerts_bp.route("/alerts/<alert_id>/dismiss", methods=["POST"])
def dismiss(alert_id):
    if dismiss_alert(alert_id):
        return jsonify({"message": "Alert dismissed"})
    return jsonify({"error": "Alert not found"}), 404
