from app.services.container_service import client
import datetime

def get_aggregated_logs(tail=100):
    if not client: return []
    
    all_logs = []
    
    for c in client.containers.list(all=True):
        try:
            # We fetch logs with timestamps
            logs = c.logs(tail=tail, timestamps=True).decode('utf-8').split('\n')
            for line in logs:
                if not line.strip():
                    continue
                # Docker log format with timestamps: "2023-10-01T12:00:00.000000000Z message..."
                parts = line.split(" ", 1)
                if len(parts) == 2:
                    timestamp_str, message = parts
                    
                    # Basic severity detection
                    msg_lower = message.lower()
                    severity = "info"
                    if "error" in msg_lower or "err" in msg_lower or "fail" in msg_lower:
                        severity = "error"
                    elif "warn" in msg_lower:
                        severity = "warning"
                        
                    all_logs.append({
                        "id": f"{c.id[:8]}-{len(all_logs)}",
                        "container": c.name,
                        "timestamp": timestamp_str,
                        "message": message,
                        "severity": severity
                    })
        except Exception:
            pass

    # Sort all logs by timestamp (string comparison works for ISO8601)
    all_logs.sort(key=lambda x: x["timestamp"])
    
    # Return the last 'tail' aggregated logs to avoid huge payloads
    return all_logs[-tail:]
