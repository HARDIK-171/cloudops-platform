import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search, Pause, Play, Download, Copy, AlertTriangle, AlertCircle, Info, RefreshCcw } from "lucide-react";
import api from "../../services/api";

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const logsEndRef = useRef(null);

  const fetchLogs = async () => {
    if (isPaused) return;
    try {
      const res = await api.get("/logs?tail=300");
      setLogs(res.data);
    } catch (err) {
      console.error("Failed to fetch logs", err);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, autoScroll]);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(search.toLowerCase()) || log.container.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterLevel === "all" || log.severity === filterLevel;
    return matchesSearch && matchesFilter;
  });

  const getLogColor = (severity) => {
    switch (severity) {
      case 'error': return 'text-rose-400';
      case 'warning': return 'text-amber-400';
      case 'info': return 'text-slate-300';
      default: return 'text-slate-400';
    }
  };

  const getLogIcon = (severity) => {
    switch (severity) {
      case 'error': return <AlertCircle size={14} className="text-rose-400 min-w-max mt-0.5" />;
      case 'warning': return <AlertTriangle size={14} className="text-amber-400 min-w-max mt-0.5" />;
      case 'info': return <Info size={14} className="text-slate-400 min-w-max mt-0.5" />;
      default: return null;
    }
  };

  const handleCopy = () => {
    const text = filteredLogs.map(l => `[${l.timestamp}] [${l.container}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
  };

  const handleDownload = () => {
    const text = filteredLogs.map(l => `[${l.timestamp}] [${l.container}] ${l.message}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cloudops-logs-${new Date().toISOString()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6 h-[calc(100vh-140px)] flex flex-col"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white mb-1">
            System Logs
          </h1>
          <p className="text-slate-400">
            Centralized log viewer across all containers.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => setIsPaused(!isPaused)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${isPaused ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20' : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'}`}>
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          
          <button onClick={handleCopy} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-slate-300 text-sm font-medium">
            <Copy size={16} /> Copy
          </button>
          <button onClick={handleDownload} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-slate-300 text-sm font-medium">
            <Download size={16} /> Download
          </button>
        </div>
      </header>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center shrink-0">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
          />
        </div>
        <div className="flex bg-black/20 p-1 rounded-xl border border-white/10 shrink-0 w-full sm:w-auto">
          {['all', 'info', 'warning', 'error'].map(f => (
            <button
              key={f}
              onClick={() => setFilterLevel(f)}
              className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-lg capitalize transition-colors ${filterLevel === f ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Log Viewer */}
      <div className="flex-1 bg-[#0d1117] border border-white/10 rounded-xl overflow-hidden flex flex-col font-mono text-sm relative shadow-inner">
        <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10 shrink-0">
          <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Live Stream {isPaused && "(Paused)"}</span>
          <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer hover:text-slate-200 transition-colors">
            <input type="checkbox" checked={autoScroll} onChange={(e) => setAutoScroll(e.target.checked)} className="accent-brand-500" />
            Auto-scroll
          </label>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1 scroll-smooth">
          {filteredLogs.length === 0 ? (
            <div className="text-slate-500 italic">Waiting for logs...</div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="flex gap-3 hover:bg-white/5 px-2 py-1 -mx-2 rounded transition-colors group">
                <div className="text-slate-500 shrink-0 w-[180px] truncate">{log.timestamp.substring(0, 19).replace('T', ' ')}</div>
                <div className="text-brand-400/80 shrink-0 w-[140px] truncate font-medium">[{log.container}]</div>
                <div className={`flex items-start gap-2 flex-1 break-all ${getLogColor(log.severity)}`}>
                  {getLogIcon(log.severity)}
                  <span>{log.message}</span>
                </div>
              </div>
            ))
          )}
          <div ref={logsEndRef} />
        </div>
      </div>
    </motion.div>
  );
}
