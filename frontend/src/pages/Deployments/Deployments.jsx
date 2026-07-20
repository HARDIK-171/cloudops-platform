import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, RefreshCcw, GitCommit, User, Clock, CheckCircle2, XCircle, RotateCcw, AlertCircle } from "lucide-react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

export default function Deployments() {
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDeployments = async () => {
    try {
      const res = await api.get("/deployments");
      setDeployments(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch deployments", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeployments();
    const interval = setInterval(fetchDeployments, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDeploy = async () => {
    if (!window.confirm("Trigger a new deployment?")) return;
    try {
      await api.post("/deploy", {
        version: `v1.0.${Math.floor(Math.random() * 10) + 3}`,
        commit_id: Math.random().toString(36).substring(2, 9),
        author: "User",
        environment: "Production"
      });
      fetchDeployments();
    } catch (err) {
      alert("Failed to trigger deployment");
    }
  };

  const handleRollback = async (id) => {
    if (!window.confirm("Are you sure you want to rollback to this deployment?")) return;
    try {
      await api.post("/rollback", { deployment_id: id });
      fetchDeployments();
    } catch (err) {
      alert("Failed to trigger rollback");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'failed': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'running': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle2 size={16} />;
      case 'failed': return <XCircle size={16} />;
      case 'running': return <RefreshCcw size={16} className="animate-spin" />;
      default: return <AlertCircle size={16} />;
    }
  };

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
            Deployments
          </h1>
          <p className="text-slate-400">
            View deployment history and trigger rollbacks.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={fetchDeployments} className="flex items-center justify-center p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-slate-300">
            <RefreshCcw size={18} className={loading ? "animate-spin text-brand-500" : ""} />
          </button>
          <button onClick={handleDeploy} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium transition-colors border border-brand-500/50 shadow-lg shadow-brand-500/20">
            <Rocket size={18} /> Deploy Now
          </button>
        </div>
      </header>

      {/* Deployment Timeline */}
      <div className="relative pl-6 md:pl-8 border-l border-white/10 space-y-6 md:space-y-8">
        <AnimatePresence>
          {deployments.length === 0 ? (
            <div className="text-slate-500">No deployments found.</div>
          ) : (
            deployments.map((d, index) => (
              <motion.div
                key={d.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="relative"
              >
                {/* Timeline Dot */}
                <div className={`absolute -left-[30px] md:-left-[38px] top-4 w-4 h-4 rounded-full border-4 border-slate-950 ${d.status === 'success' ? 'bg-emerald-500' : d.status === 'failed' ? 'bg-rose-500' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]'}`} />
                
                <Card className="p-5 md:p-6 hover:border-white/20 transition-all group">
                  <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-white">{d.version}</h3>
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border uppercase tracking-wider ${getStatusColor(d.status)}`}>
                        {getStatusIcon(d.status)}
                        {d.status}
                      </div>
                      <Badge variant="default">{d.environment}</Badge>
                    </div>
                    
                    <div className="text-sm text-slate-400 flex items-center gap-1.5">
                      <Clock size={14} />
                      {new Date(d.start_time).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <GitCommit size={16} className="text-slate-500" />
                      <span className="text-slate-400">Commit:</span> 
                      <span className="font-mono bg-white/5 px-1.5 py-0.5 rounded">{d.commit_id}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <User size={16} className="text-slate-500" />
                      <span className="text-slate-400">Author:</span> {d.author}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <Clock size={16} className="text-slate-500" />
                      <span className="text-slate-400">Duration:</span> {d.duration}
                    </div>
                  </div>

                  <div className="flex items-center justify-end border-t border-white/5 pt-4">
                    <button
                      onClick={() => handleRollback(d.id)}
                      disabled={d.status === 'running'}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <RotateCcw size={16} /> Rollback to this version
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
