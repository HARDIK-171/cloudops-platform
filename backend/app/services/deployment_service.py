import uuid
import datetime
import random
import time
from threading import Thread

# In-memory store for deployments (mock database)
_deployments = [
    {
        "id": "dep-1",
        "version": "v1.0.0",
        "commit_id": "a1b2c3d",
        "author": "Hardik",
        "environment": "Production",
        "status": "success",
        "start_time": (datetime.datetime.now() - datetime.timedelta(days=2)).isoformat(),
        "duration": "120s"
    },
    {
        "id": "dep-2",
        "version": "v1.0.1",
        "commit_id": "f4e5d6c",
        "author": "Hardik",
        "environment": "Staging",
        "status": "failed",
        "start_time": (datetime.datetime.now() - datetime.timedelta(days=1)).isoformat(),
        "duration": "45s"
    },
    {
        "id": "dep-3",
        "version": "v1.0.2",
        "commit_id": "9h8g7f6",
        "author": "Hardik",
        "environment": "Production",
        "status": "success",
        "start_time": (datetime.datetime.now() - datetime.timedelta(hours=2)).isoformat(),
        "duration": "115s"
    }
]

def get_deployments():
    return sorted(_deployments, key=lambda x: x["start_time"], reverse=True)

def _simulate_deployment(deployment_id):
    # Simulate a running deployment process
    time.sleep(5)
    for d in _deployments:
        if d["id"] == deployment_id:
            d["status"] = random.choice(["success", "success", "success", "failed"])
            d["duration"] = f"{random.randint(40, 150)}s"
            break

def trigger_deployment(version, commit_id, author, environment):
    deployment_id = f"dep-{uuid.uuid4().hex[:8]}"
    new_deployment = {
        "id": deployment_id,
        "version": version or "latest",
        "commit_id": commit_id or "unknown",
        "author": author or "System",
        "environment": environment or "Production",
        "status": "running",
        "start_time": datetime.datetime.now().isoformat(),
        "duration": "..."
    }
    _deployments.append(new_deployment)
    
    # Run async mock deployment
    Thread(target=_simulate_deployment, args=(deployment_id,)).start()
    
    return new_deployment

def trigger_rollback(deployment_id):
    # Find the target deployment
    target = next((d for d in _deployments if d["id"] == deployment_id), None)
    if not target:
        return None
    
    rollback_id = f"dep-{uuid.uuid4().hex[:8]}"
    new_deployment = {
        "id": rollback_id,
        "version": f"Rollback to {target['version']}",
        "commit_id": target["commit_id"],
        "author": "System",
        "environment": target["environment"],
        "status": "running",
        "start_time": datetime.datetime.now().isoformat(),
        "duration": "..."
    }
    _deployments.append(new_deployment)
    
    # Run async mock deployment
    Thread(target=_simulate_deployment, args=(rollback_id,)).start()
    
    return new_deployment
