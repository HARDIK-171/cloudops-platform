import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Box, Rocket, FileText, Activity, LayoutDashboard, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function GlobalSearch({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query) {
      setResults([
        { id: "p-dashboard", title: "Dashboard", type: "page", path: "/dashboard", icon: LayoutDashboard },
        { id: "p-containers", title: "Containers", type: "page", path: "/containers", icon: Box },
        { id: "p-deployments", title: "Deployments", type: "page", path: "/deployments", icon: Rocket },
        { id: "p-logs", title: "Logs", type: "page", path: "/logs", icon: FileText },
      ]);
      return;
    }

    const fetchResults = async () => {
      try {
        const [cRes, dRes] = await Promise.all([
          api.get("/containers"),
          api.get("/deployments")
        ]);

        const containers = cRes.data
          .filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.image.toLowerCase().includes(query.toLowerCase()))
          .map(c => ({ id: `c-${c.id}`, title: c.name, subtitle: c.image, type: "container", path: "/containers", icon: Box }));

        const deployments = dRes.data
          .filter(d => d.version.toLowerCase().includes(query.toLowerCase()) || d.commit_id.toLowerCase().includes(query.toLowerCase()))
          .map(d => ({ id: `d-${d.id}`, title: `Deployment ${d.version}`, subtitle: d.commit_id, type: "deployment", path: "/deployments", icon: Rocket }));

        const pages = [
          { id: "p-dashboard", title: "Dashboard", type: "page", path: "/dashboard", icon: LayoutDashboard },
          { id: "p-containers", title: "Containers", type: "page", path: "/containers", icon: Box },
          { id: "p-deployments", title: "Deployments", type: "page", path: "/deployments", icon: Rocket },
          { id: "p-logs", title: "Logs", type: "page", path: "/logs", icon: FileText },
        ].filter(p => p.title.toLowerCase().includes(query.toLowerCase()));

        setResults([...pages, ...containers, ...deployments].slice(0, 8));
        setSelectedIndex(0);
      } catch (err) {
        console.error("Search failed", err);
      }
    };

    const timeoutId = setTimeout(fetchResults, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  const handleSelect = (item) => {
    navigate(item.path);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-[15vh] left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center px-4 py-3 border-b border-white/10">
              <Search className="text-slate-400 mr-3" size={20} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search containers, deployments, pages..."
                className="flex-1 bg-transparent border-none text-white focus:outline-none placeholder:text-slate-500 text-lg"
              />
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white/5 rounded text-xs text-slate-400 font-mono">ESC</kbd>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {results.length === 0 ? (
                <div className="py-14 text-center text-slate-500">
                  No results found for "{query}"
                </div>
              ) : (
                results.map((item, index) => {
                  const Icon = item.icon;
                  const isSelected = index === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${isSelected ? 'bg-brand-500/20 text-white' : 'text-slate-300 hover:bg-white/5'}`}
                    >
                      <div className={`p-2 rounded-lg mr-4 ${isSelected ? 'bg-brand-500/20 text-brand-400' : 'bg-white/5 text-slate-400'}`}>
                        <Icon size={18} />
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="font-medium text-sm">{item.title}</h4>
                        {item.subtitle && <p className="text-xs text-slate-500 mt-0.5">{item.subtitle}</p>}
                      </div>
                      {isSelected && <ChevronRight size={18} className="text-brand-400" />}
                    </button>
                  );
                })
              )}
            </div>
            
            <div className="px-4 py-3 bg-black/20 border-t border-white/10 text-xs text-slate-500 flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white/10 rounded font-mono">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-white/10 rounded font-mono">↓</kbd>
                to navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white/10 rounded font-mono">Enter</kbd>
                to select
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
