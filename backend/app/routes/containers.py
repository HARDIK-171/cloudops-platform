from flask import Blueprint, jsonify, request
from app.services.container_service import (
    get_all_containers,
    get_container_details,
    start_container,
    stop_container,
    restart_container,
    remove_container,
    get_container_stats
)

containers_bp = Blueprint("containers", __name__)

@containers_bp.route("/containers", methods=["GET"])
def list_containers():
    return jsonify(get_all_containers())

@containers_bp.route("/containers/<container_id>", methods=["GET"])
def container_details(container_id):
    details = get_container_details(container_id)
    if details:
        return jsonify(details)
    return jsonify({"error": "Container not found"}), 404

@containers_bp.route("/containers/<container_id>/start", methods=["POST"])
def start(container_id):
    if start_container(container_id):
        return jsonify({"message": "Container started successfully"})
    return jsonify({"error": "Failed to start container"}), 500

@containers_bp.route("/containers/<container_id>/stop", methods=["POST"])
def stop(container_id):
    if stop_container(container_id):
        return jsonify({"message": "Container stopped successfully"})
    return jsonify({"error": "Failed to stop container"}), 500

@containers_bp.route("/containers/<container_id>/restart", methods=["POST"])
def restart(container_id):
    if restart_container(container_id):
        return jsonify({"message": "Container restarted successfully"})
    return jsonify({"error": "Failed to restart container"}), 500

@containers_bp.route("/containers/<container_id>/remove", methods=["POST"])
def remove(container_id):
    if remove_container(container_id):
        return jsonify({"message": "Container removed successfully"})
    return jsonify({"error": "Failed to remove container"}), 500

@containers_bp.route("/containers/<container_id>/stats", methods=["GET"])
def stats(container_id):
    stats = get_container_stats(container_id)
    if stats:
        return jsonify(stats)
    return jsonify({"error": "Failed to fetch stats"}), 500
