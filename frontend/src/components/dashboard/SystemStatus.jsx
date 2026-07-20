import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ServerCrash, RefreshCw } from "lucide-react";
import Card from "../ui/Card";
import api from "../../services/api";

export default function SystemStatus() {
  const [status, setStatus] = useState("checking");
  const [version, setVersion] = useState("...");

  useEffect(() => {
    async function checkSystem() {
      try {
        const [healthRes, versionRes] = await Promise.all([
          api.get("/health"),
          api.get("/version"),
        ]);
        setStatus(healthRes.data.status === "healthy" ? "healthy" : "error");
        setVersion(versionRes.data.version || "1.0.0");
      } catch {
        setStatus("error");
      }
    }
    checkSystem();
  }, []);

  if (status === "checking") {
    return (
      <Card className="flex items-center justify-center p-8 mt-6">
        <RefreshCw className="animate-spin text-brand-500" />
      </Card>
    );
  }

  const isHealthy = status === "healthy";

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6"
    >
      <div className={`relative overflow-hidden rounded-2xl border ${isHealthy ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-rose-500/20 bg-rose-500/5'} p-6 shadow-lg backdrop-blur-md`}>
        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full mix-blend-screen filter blur-[80px] opacity-20 pointer-events-none ${isHealthy ? 'bg-emerald-500' : 'bg-rose-500'}`} />
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isHealthy ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
              {isHealthy ? <ShieldCheck size={28} /> : <ServerCrash size={28} />}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                {isHealthy ? "System Healthy" : "System Degraded"}
                {isHealthy && (
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                )}
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                {isHealthy ? "All core services and APIs are fully operational." : "One or more services are experiencing issues."}
              </p>
            </div>
          </div>
          
          <div className="hidden sm:block text-right">
            <div className="text-sm font-medium text-slate-300">Version {version}</div>
            <div className="text-xs text-slate-500 mt-1">Updated just now</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}