import docker
import datetime

# Connect to the local Docker daemon
# When running inside a container with /var/run/docker.sock mounted, this connects to the host docker.
try:
    client = docker.from_env()
except Exception as e:
    client = None
    print(f"Failed to connect to docker daemon: {e}")

def get_all_containers():
    if not client:
        return []
    
    containers = client.containers.list(all=True)
    result = []
    
    for c in containers:
        ports = []
        for port, bindings in c.ports.items():
            if bindings:
                for b in bindings:
                    ports.append(f"{b.get('HostIp', '')}:{b.get('HostPort', '')}->{port}")
            else:
                ports.append(port)
                
        result.append({
            "id": c.id,
            "name": c.name,
            "status": c.status,
            "image": c.image.tags[0] if c.image.tags else c.image.id[:12],
            "created": c.attrs.get("Created", ""),
            "ports": ports,
        })
    return result

def get_container_details(container_id):
    if not client: return None
    try:
        c = client.containers.get(container_id)
        return c.attrs
    except docker.errors.NotFound:
        return None

def start_container(container_id):
    if not client: return False
    try:
        c = client.containers.get(container_id)
        c.start()
        return True
    except docker.errors.APIError:
        return False

def stop_container(container_id):
    if not client: return False
    try:
        c = client.containers.get(container_id)
        c.stop()
        return True
    except docker.errors.APIError:
        return False

def restart_container(container_id):
    if not client: return False
    try:
        c = client.containers.get(container_id)
        c.restart()
        return True
    except docker.errors.APIError:
        return False

def remove_container(container_id):
    if not client: return False
    try:
        c = client.containers.get(container_id)
        c.remove(force=True)
        return True
    except docker.errors.APIError:
        return False

def get_container_stats(container_id):
    if not client: return None
    try:
        c = client.containers.get(container_id)
        stats = c.stats(stream=False)
        
        # Calculate CPU %
        cpu_delta = stats['cpu_stats']['cpu_usage']['total_usage'] - stats['precpu_stats']['cpu_usage']['total_usage']
        system_delta = stats['cpu_stats']['system_cpu_usage'] - stats['precpu_stats']['system_cpu_usage']
        cpu_percent = 0.0
        if system_delta > 0 and cpu_delta > 0:
            cpu_percent = (cpu_delta / system_delta) * len(stats['cpu_stats']['cpu_usage']['percpu_usage']) * 100.0
            
        # Calculate Memory %
        mem_usage = stats['memory_stats'].get('usage', 0)
        mem_limit = stats['memory_stats'].get('limit', 1)
        mem_percent = (mem_usage / mem_limit) * 100.0
        
        return {
            "cpu_percent": round(cpu_percent, 2),
            "mem_usage_bytes": mem_usage,
            "mem_limit_bytes": mem_limit,
            "mem_percent": round(mem_percent, 2)
        }
    except Exception as e:
        print(f"Error fetching stats for {container_id}: {e}")
        return None
