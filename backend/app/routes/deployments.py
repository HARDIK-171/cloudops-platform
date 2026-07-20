from flask import Blueprint, jsonify, request
from app.services.deployment_service import (
    get_deployments,
    trigger_deployment,
    trigger_rollback
)

deployments_bp = Blueprint("deployments", __name__)

@deployments_bp.route("/deployments", methods=["GET"])
def list_deployments():
    return jsonify(get_deployments())

@deployments_bp.route("/deploy", methods=["POST"])
def deploy():
    data = request.json or {}
    dep = trigger_deployment(
        version=data.get("version"),
        commit_id=data.get("commit_id"),
        author=data.get("author"),
        environment=data.get("environment")
    )
    return jsonify(dep), 201

@deployments_bp.route("/rollback", methods=["POST"])
def rollback():
    data = request.json or {}
    dep_id = data.get("deployment_id")
    if not dep_id:
        return jsonify({"error": "deployment_id is required"}), 400
        
    dep = trigger_rollback(dep_id)
    if dep:
        return jsonify(dep), 201
    return jsonify({"error": "Deployment not found"}), 404
