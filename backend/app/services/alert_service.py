import time
import uuid
import datetime
from threading import Thread
from app.services.monitoring_service import get_system_metrics
from app.services.container_service import get_all_containers
from app.services.deployment_service import get_deployments

# In-memory alerts store
_alerts = []

# Configurable thresholds
THRESHOLDS = {
    "cpu": 90.0,
    "memory": 90.0,
    "disk": 90.0
}

def get_active_alerts():
    return [a for a in _alerts if not a.get("dismissed")]

def get_all_alerts():
    return sorted(_alerts, key=lambda x: x["timestamp"], reverse=True)

def dismiss_alert(alert_id):
    for a in _alerts:
        if a["id"] == alert_id:
            a["dismissed"] = True
            return True
    return False

def _create_alert(title, message, severity, type):
    # Check if a similar active alert already exists to prevent spam
    for a in get_active_alerts():
        if a["title"] == title and a["type"] == type:
            return
            
    _alerts.append({
        "id": f"alt-{uuid.uuid4().hex[:8]}",
        "title": title,
        "message": message,
        "severity": severity,
        "type": type,
        "timestamp": datetime.datetime.now().isoformat(),
        "dismissed": False
    })

def _alert_engine_loop():
    while True:
        try:
            # Check system metrics
            metrics = get_system_metrics()
            if metrics["cpu"] > THRESHOLDS["cpu"]:
                _create_alert("High CPU Usage", f"CPU usage is at {metrics['cpu']}%", "critical", "system")
            if metrics["memory"] > THRESHOLDS["memory"]:
                _create_alert("High Memory Usage", f"Memory usage is at {metrics['memory']}%", "critical", "system")
            if metrics["disk"] > THRESHOLDS["disk"]:
                _create_alert("High Disk Usage", f"Disk usage is at {metrics['disk']}%", "critical", "system")
                
            # Check containers
            containers = get_all_containers()
            for c in containers:
                if c["status"] != "running" and c["status"] != "exited":
                    _create_alert("Container Issue", f"Container {c['name']} is in status: {c['status']}", "warning", "container")
                elif c["status"] == "exited":
                    _create_alert("Container Down", f"Container {c['name']} has exited.", "error", "container")
                    
            # Check deployments
            deployments = get_deployments()
            for d in deployments:
                # Check for recent failures (within last hour to avoid persistent alerts if not dismissed)
                # For simplicity, we just alert if it failed and we haven't alerted yet.
                if d["status"] == "failed":
                    # Very simple check
                    _create_alert("Deployment Failed", f"Deployment {d['version']} failed.", "error", "deployment")
                    
        except Exception as e:
            print(f"Alert engine error: {e}")
            
        time.sleep(10)

# Start engine
Thread(target=_alert_engine_loop, daemon=True).start()
