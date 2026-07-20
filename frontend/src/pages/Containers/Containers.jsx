import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Play, Square, RotateCw, Trash2, Terminal, Filter, RefreshCcw } from "lucide-react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { formatBytes, formatUptime } from "../../utils/formatters";

export default function Containers() {
  const [containers, setContainers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  const fetchContainers = async () => {
    try {
      const res = await api.get("/containers");
      setContainers(res.data);
      setLoading(false);
      
      // Fetch stats for running containers
      res.data.forEach(c => {
        if (c.status === "running") {
          fetchStats(c.id);
        }
      });
    } catch (err) {
      console.error("Failed to fetch containers", err);
      setLoading(false);
    }
  };

  const fetchStats = async (id) => {
    try {
      const res = await api.get(`/containers/${id}/stats`);
      setStats(prev => ({ ...prev, [id]: res.data }));
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    fetchContainers();
    const interval = setInterval(fetchContainers, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (id, action) => {
    if (action === 'remove') {
      if (!window.confirm("Are you sure you want to remove this container?")) return;
    }
    
    // Optimistic update
    if (action === 'stop') {
      setContainers(prev => prev.map(c => c.id === id ? { ...c, status: 'exited' } : c));
    } else if (action === 'start') {
      setContainers(prev => prev.map(c => c.id === id ? { ...c, status: 'running' } : c));
    }
    
    try {
      await api.post(`/containers/${id}/${action}`);
      fetchContainers();
    } catch (err) {
      alert(`Failed to ${action} container`);
      fetchContainers();
    }
  };

  const filteredContainers = containers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.image.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || (filter === "running" ? c.status === "running" : c.status !== "running");
    return matchesSearch && matchesFilter;
  });

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
            Containers
          </h1>
          <p className="text-slate-400">
            Manage and monitor your Docker containers.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={fetchContainers} className="flex items-center justify-center p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-slate-300">
            <RefreshCcw size={18} className={loading ? "animate-spin text-brand-500" : ""} />
          </button>
        </div>
      </header>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search containers by name or image..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
          />
        </div>
        <div className="flex bg-black/20 p-1 rounded-xl border border-white/10 shrink-0 w-full sm:w-auto">
          {['all', 'running', 'stopped'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-lg capitalize transition-colors ${filter === f ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Container List */}
      <div className="grid gap-4">
        <AnimatePresence>
          {filteredContainers.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center text-slate-500">
              No containers found.
            </motion.div>
          ) : (
            filteredContainers.map((c) => {
              const isRunning = c.status === "running";
              const cStats = stats[c.id];

              return (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-white/20 transition-colors">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={`w-3 h-3 rounded-full shrink-0 ${isRunning ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-600'}`} />
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-white truncate flex items-center gap-2">
                          {c.name}
                          <Badge variant={isRunning ? "success" : "default"}>{c.status}</Badge>
                        </h3>
                        <p className="text-sm text-slate-400 truncate mt-1">
                          {c.image} • {c.ports.length > 0 ? c.ports.join(', ') : 'No exposed ports'}
                        </p>
                      </div>
                    </div>

                    {isRunning && cStats && (
                      <div className="flex items-center gap-6 flex-1 min-w-0 px-4 py-2 bg-black/20 rounded-lg border border-white/5">
                        <div>
                          <p className="text-xs text-slate-500 uppercase font-medium">CPU</p>
                          <p className="text-sm text-white font-medium">{cStats.cpu_percent}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase font-medium">Memory</p>
                          <p className="text-sm text-white font-medium">{formatBytes(cStats.mem_usage_bytes)}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2 shrink-0 w-full md:w-auto">
                      {isRunning ? (
                        <button onClick={() => handleAction(c.id, 'stop')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 text-sm font-medium transition-colors border border-amber-500/20">
                          <Square size={14} /> Stop
                        </button>
                      ) : (
                        <button onClick={() => handleAction(c.id, 'start')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-sm font-medium transition-colors border border-emerald-500/20">
                          <Play size={14} /> Start
                        </button>
                      )}
                      
                      <button onClick={() => handleAction(c.id, 'restart')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-sm font-medium transition-colors border border-blue-500/20">
                        <RotateCw size={14} /> Restart
                      </button>

                      <button onClick={() => handleAction(c.id, 'remove')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-sm font-medium transition-colors border border-rose-500/20">
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </Card>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
