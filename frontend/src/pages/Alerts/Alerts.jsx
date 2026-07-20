import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, Trash2, AlertTriangle, AlertCircle, Info, RefreshCcw } from "lucide-react";
import api from "../../services/api";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const res = await api.get("/alerts");
      setAlerts(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch alerts", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, []);

  const handleDismiss = async (id) => {
    try {
      await api.post(`/alerts/${id}/dismiss`);
      fetchAlerts();
    } catch (err) {
      alert("Failed to dismiss alert");
    }
  };

  const getAlertColor = (severity, dismissed) => {
    if (dismissed) return 'bg-white/5 border-white/5 opacity-60';
    switch (severity) {
      case 'critical': return 'bg-rose-500/10 border-rose-500/30';
      case 'error': return 'bg-orange-500/10 border-orange-500/30';
      case 'warning': return 'bg-amber-500/10 border-amber-500/30';
      default: return 'bg-blue-500/10 border-blue-500/30';
    }
  };

  const getAlertIcon = (severity, dismissed) => {
    const colorClass = dismissed ? 'text-slate-500' : 
      (severity === 'critical' || severity === 'error' ? 'text-rose-400' : 
       severity === 'warning' ? 'text-amber-400' : 'text-blue-400');
       
    switch (severity) {
      case 'critical':
      case 'error': return <AlertCircle size={20} className={colorClass} />;
      case 'warning': return <AlertTriangle size={20} className={colorClass} />;
      default: return <Info size={20} className={colorClass} />;
    }
  };

  const activeAlerts = alerts.filter(a => !a.dismissed);
  const dismissedAlerts = alerts.filter(a => a.dismissed);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-8"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white mb-1 flex items-center gap-3">
            Alerts
            {activeAlerts.length > 0 && (
              <Badge variant="error" className="animate-pulse">
                {activeAlerts.length} Active
              </Badge>
            )}
          </h1>
          <p className="text-slate-400">
            System notifications and rule-based alerts.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={fetchAlerts} className="flex items-center justify-center p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-slate-300">
            <RefreshCcw size={18} className={loading ? "animate-spin text-brand-500" : ""} />
          </button>
        </div>
      </header>

      <section>
        <h2 className="text-lg font-medium text-white mb-4">Active Alerts</h2>
        <div className="space-y-3">
          <AnimatePresence>
            {activeAlerts.length === 0 ? (
              <div className="p-6 text-center text-slate-500 border border-white/5 rounded-xl bg-white/5 border-dashed">
                <Bell className="mx-auto mb-2 opacity-50" size={24} />
                No active alerts. Your cluster is healthy!
              </div>
            ) : (
              activeAlerts.map(alert => (
                <motion.div
                  key={alert.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className={`p-4 flex items-start gap-4 ${getAlertColor(alert.severity, alert.dismissed)}`}>
                    <div className="shrink-0 mt-1">
                      {getAlertIcon(alert.severity, alert.dismissed)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="font-semibold text-white truncate">{alert.title}</h3>
                        <span className="text-xs font-medium text-slate-400 shrink-0 uppercase tracking-wider">{alert.type}</span>
                      </div>
                      <p className="text-sm text-slate-300 mt-1">{alert.message}</p>
                      <p className="text-xs text-slate-500 mt-2">{new Date(alert.timestamp).toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => handleDismiss(alert.id)}
                      className="shrink-0 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      title="Dismiss"
                    >
                      <Check size={18} />
                    </button>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </section>

      {dismissedAlerts.length > 0 && (
        <section>
          <h2 className="text-lg font-medium text-white mb-4">Alert History</h2>
          <div className="space-y-3">
            {dismissedAlerts.map(alert => (
              <Card key={alert.id} className={`p-4 flex items-start gap-4 ${getAlertColor(alert.severity, alert.dismissed)}`}>
                <div className="shrink-0 mt-1">
                  {getAlertIcon(alert.severity, alert.dismissed)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-medium text-slate-300 line-through truncate opacity-70">{alert.title}</h3>
                    <span className="text-xs font-medium text-slate-500 shrink-0 uppercase tracking-wider">{alert.type}</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1 line-through opacity-70">{alert.message}</p>
                  <p className="text-xs text-slate-500 mt-2">{new Date(alert.timestamp).toLocaleString()}</p>
                </div>
                <div className="shrink-0 pt-1">
                  <Badge variant="default" className="opacity-60">Dismissed</Badge>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
}
