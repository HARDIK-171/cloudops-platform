import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Cpu, MemoryStick, HardDrive, RefreshCcw, Activity, Clock, Server, Network, Wifi, Layers } from "lucide-react";

import api from "../../services/api";
import StatCard from "../../components/dashboard/StatCard";
import InfoCard from "../../components/dashboard/InfoCard";
import SystemStatus from "../../components/dashboard/SystemStatus";
import MetricChart from "../../components/dashboard/MetricChart";
import { formatUptime, formatBytes, formatFrequency } from "../../utils/formatters";

const MAX_HISTORY = 20;

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [history, setHistory] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    async function loadMetrics() {
      try {
        const response = await api.get("/metrics");
        const newMetrics = response.data;
        
        setMetrics(newMetrics);
        setLastUpdated(new Date());
        
        setHistory(prev => {
          const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' });
          const newEntry = { time: timestamp, ...newMetrics };
          const newHistory = [...prev, newEntry];
          if (newHistory.length > MAX_HISTORY) return newHistory.slice(1);
          return newHistory;
        });
      } catch (error) {
        console.error("Failed to load metrics:", error);
      }
    }

    loadMetrics();
    const interval = setInterval(loadMetrics, 2000); // 2 second auto-refresh
    return () => clearInterval(interval);
  }, []);

  const getTrend = (key) => {
    if (history.length < 2) return 0;
    const current = history[history.length - 1][key];
    const previous = history[history.length - 2][key];
    const diff = current - previous;
    return diff ? Number(diff.toFixed(1)) : 0;
  };

  if (!metrics) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-8"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white mb-1">
            Infrastructure Overview
          </h1>
          <p className="text-slate-400">
            Real-time monitoring and telemetry for your cluster.
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
          <RefreshCcw size={14} className="animate-spin text-brand-500" style={{ animationDuration: '3s' }} />
          Live • Last updated {lastUpdated.toLocaleTimeString()}
        </div>
      </header>

      <SystemStatus />

      {/* System Quick Stats */}
      <section className="grid gap-4 md:gap-6 md:grid-cols-4">
        <InfoCard title="System Uptime" value={formatUptime(metrics.system_uptime)} icon={<Clock size={20} />} />
        <InfoCard title="Active Processes" value={metrics.process_count} icon={<Activity size={20} />} />
        <InfoCard title="CPU Cores" value={`${metrics.cpu_cores_physical} Physical`} unit={`/ ${metrics.cpu_cores_logical} Logical`} icon={<Server size={20} />} />
        <InfoCard title="CPU Frequency" value={formatFrequency(metrics.cpu_freq_current)} icon={<Activity size={20} />} />
      </section>

      {/* Core Resource Metrics */}
      <section>
        <h2 className="text-lg font-medium text-white mb-4">Core Resources</h2>
        <div className="grid gap-4 md:gap-6 md:grid-cols-3">
          <StatCard
            title="CPU Usage"
            value={metrics.cpu}
            unit="%"
            icon={<Cpu size={24} />}
            trend={getTrend('cpu')}
          />
          <StatCard
            title="Memory Usage"
            value={metrics.memory}
            unit="%"
            icon={<MemoryStick size={24} />}
            trend={getTrend('memory')}
          />
          <StatCard
            title="Disk Usage"
            value={metrics.disk}
            unit="%"
            icon={<HardDrive size={24} />}
            trend={getTrend('disk')}
          />
        </div>
      </section>

      {/* Network & Storage Extended Info */}
      <section className="grid gap-4 md:gap-6 md:grid-cols-3">
        <InfoCard title="Network Sent" value={formatBytes(metrics.network_bytes_sent)} icon={<Network size={20} />} />
        <InfoCard title="Network Recv" value={formatBytes(metrics.network_bytes_recv)} icon={<Network size={20} />} />
        <InfoCard title="Swap Usage" value={metrics.swap_percent} unit="%" icon={<Layers size={20} />} />
      </section>

      {/* Performance History */}
      <section>
        <h2 className="text-lg font-medium text-white mb-4">Performance History</h2>
        <div className="grid gap-4 md:gap-6 md:grid-cols-2">
          <MetricChart 
            title="CPU History" 
            data={history} 
            dataKey="cpu" 
            color="#6366f1" // brand-500
            gradientId="cpuGrad"
          />
          <MetricChart 
            title="Memory History" 
            data={history} 
            dataKey="memory" 
            color="#f59e0b" // amber-500
            gradientId="memGrad"
          />
        </div>
      </section>
    </motion.div>
  );
}