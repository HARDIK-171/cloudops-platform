from flask import Blueprint, jsonify, request
from app.services.log_service import get_aggregated_logs

logs_bp = Blueprint("logs", __name__)

@logs_bp.route("/logs", methods=["GET"])
def fetch_logs():
    tail = request.args.get("tail", 200, type=int)
    logs = get_aggregated_logs(tail=tail)
    return jsonify(logs)
