import psutil
import time

def get_system_metrics():
    """
    Returns live system metrics with detailed information.
    """
    # CPU
    # Use interval=0.1 to avoid blocking for 1 full second on every request
    cpu_percent = psutil.cpu_percent(interval=0.1)
    cpu_freq = psutil.cpu_freq()
    
    # Memory
    mem = psutil.virtual_memory()
    swap = psutil.swap_memory()
    
    # Disk
    disk_usage = psutil.disk_usage("/")
    disk_io = psutil.disk_io_counters()
    
    partitions = []
    for part in psutil.disk_partitions(all=False):
        try:
            usage = psutil.disk_usage(part.mountpoint)
            partitions.append({
                "device": part.device,
                "mountpoint": part.mountpoint,
                "fstype": part.fstype,
                "total": usage.total,
                "used": usage.used,
                "free": usage.free,
                "percent": usage.percent
            })
        except Exception:
            continue
            
    # Network
    net_io = psutil.net_io_counters()
    net_if_addrs = psutil.net_if_addrs()
    interfaces = list(net_if_addrs.keys()) if net_if_addrs else []
    
    # System
    boot_time = psutil.boot_time()
    uptime = time.time() - boot_time
    
    return {
        "cpu": cpu_percent,
        "cpu_cores_physical": psutil.cpu_count(logical=False),
        "cpu_cores_logical": psutil.cpu_count(logical=True),
        "cpu_freq_current": cpu_freq.current if cpu_freq else 0,
        "cpu_freq_min": cpu_freq.min if cpu_freq else 0,
        "cpu_freq_max": cpu_freq.max if cpu_freq else 0,
        
        "memory": mem.percent,
        "memory_total": mem.total,
        "memory_used": mem.used,
        "memory_free": mem.free,
        "memory_available": mem.available,
        
        "swap_percent": swap.percent,
        "swap_total": swap.total,
        "swap_used": swap.used,
        "swap_free": swap.free,
        
        "disk": disk_usage.percent,
        "disk_total": disk_usage.total,
        "disk_used": disk_usage.used,
        "disk_free": disk_usage.free,
        "disk_partitions": partitions,
        "disk_io_read_bytes": disk_io.read_bytes if disk_io else 0,
        "disk_io_write_bytes": disk_io.write_bytes if disk_io else 0,
        
        "network_bytes_sent": net_io.bytes_sent if net_io else 0,
        "network_bytes_recv": net_io.bytes_recv if net_io else 0,
        "network_interfaces": interfaces,
        
        "system_uptime": uptime,
        "system_boot_time": boot_time,
        "process_count": len(psutil.pids()),
    }