import { useState } from "react";
import { LayoutDashboard, Activity, Box, Rocket, FileText, Settings, ChevronLeft, ChevronRight, Cloud, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Link } from "react-router-dom";
import { cn } from "../../utils/cn";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Monitoring", path: "/dashboard", icon: Activity }, // Or separate if needed
  { name: "Containers", path: "/containers", icon: Box },
  { name: "Deployments", path: "/deployments", icon: Rocket },
  { name: "Logs", path: "/logs", icon: FileText },
  { name: "Alerts", path: "/alerts", icon: Bell },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      initial={{ width: 220 }}
      animate={{ width: collapsed ? 72 : 220 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="h-screen bg-white/[0.03] backdrop-blur-3xl border-r border-white/10 text-slate-300 flex flex-col relative z-20 shadow-[4px_0_30px_rgba(0,0,0,0.4)]"
    >
      <div className="h-16 flex items-center px-6 border-b border-white/5 relative">
        <Cloud className="text-brand-500 mr-3 flex-shrink-0" size={28} />
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-xl font-semibold text-white tracking-tight text-gradient whitespace-nowrap"
            >
              CloudOps
            </motion.span>
          )}
        </AnimatePresence>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-zinc-800 border border-white/10 rounded-full flex items-center justify-center hover:bg-zinc-700 transition-colors z-50 text-white"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      <nav className="flex-1 py-6 px-3 flex flex-col gap-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "relative flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group w-full text-left",
                isActive ? "text-white" : "hover:text-white hover:bg-white/5 text-slate-400",
                collapsed && "justify-center"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav-bg"
                  className="absolute inset-0 bg-brand-500/10 border border-brand-500/20 rounded-lg shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                size={20}
                className={cn(
                  "relative z-10 transition-colors",
                  isActive ? "text-brand-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]" : "group-hover:text-slate-300 text-slate-500",
                  collapsed ? "mr-0" : "mr-3"
                )}
              />
              {!collapsed && (
                <span className="relative z-10 font-medium text-sm whitespace-nowrap">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-500 to-fuchsia-500 flex items-center justify-center text-white font-semibold text-sm shadow-[0_0_15px_rgba(99,102,241,0.4)] flex-shrink-0">
            H
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">Hardik</p>
              <p className="text-xs text-slate-500 truncate">Lead Engineer</p>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
}