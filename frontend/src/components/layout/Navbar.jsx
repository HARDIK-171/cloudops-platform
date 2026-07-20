import { useState, useEffect } from "react";
import { Bell, Search, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function Navbar({ onSearchOpen }) {
  const [status, setStatus] = useState("checking");
  const [activeAlerts, setActiveAlerts] = useState(0);

  useEffect(() => {
    async function checkHealth() {
      try {
        await api.get("/health");
        setStatus("healthy");
      } catch {
        setStatus("error");
      }
    }
    
    async function checkAlerts() {
      try {
        const res = await api.get("/alerts?active=true");
        setActiveAlerts(res.data.length);
      } catch {
        // ignore
      }
    }
    
    checkHealth();
    checkAlerts();
    
    const interval = setInterval(() => {
      checkHealth();
      checkAlerts();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 glass-nav sticky top-0 z-10 flex items-center justify-between px-6">
      <div className="flex items-center gap-4 flex-1">
        <button className="md:hidden text-slate-400 hover:text-white">
          <Menu size={20} />
        </button>
        <div 
          onClick={onSearchOpen}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full w-64 hover:w-80 hover:bg-white/10 transition-all cursor-pointer group"
        >
          <Search size={16} className="text-slate-500 group-hover:text-slate-400 transition-colors" />
          <span className="text-sm text-slate-500 group-hover:text-slate-300 transition-colors flex-1 text-left">
            Search resources...
          </span>
          <div className="flex gap-1 text-[10px] text-slate-500 font-medium">
            <kbd className="px-1.5 py-0.5 bg-white/10 rounded">⌘</kbd>
            <kbd className="px-1.5 py-0.5 bg-white/10 rounded">K</kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            {status === "healthy" && (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              </>
            )}
            {status === "error" && (
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 shadow-[0_0_8px_rgba(225,29,72,0.8)]"></span>
            )}
            {status === "checking" && (
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"></span>
            )}
          </span>
          <span className="text-xs font-medium text-slate-400 hidden sm:block">
            {status === "healthy" ? "All Systems Operational" : status === "error" ? "System Error" : "Checking..."}
          </span>
        </div>

        <div className="h-6 w-px bg-white/10"></div>

        <Link to="/alerts" className="relative text-slate-400 hover:text-white transition-colors">
          <Bell size={20} />
          {activeAlerts > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-[0_0_8px_rgba(225,29,72,0.8)] animate-pulse">
              {activeAlerts}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}