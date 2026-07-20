import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import GlobalSearch from "./GlobalSearch";

export default function DashboardLayout({ children }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-50 overflow-hidden font-sans relative">
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      
      {/* Background base and noise */}
      <div className="absolute inset-0 bg-noise opacity-50 mix-blend-overlay pointer-events-none z-0"></div>

      {/* Animated gradient backgrounds blending two colors: Cyan & Indigo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-600/30 blur-[150px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-indigo-600/30 blur-[150px]" 
        />
      </div>

      {/* Interactive mouse cursor glowing orb */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 w-80 h-80 bg-cyan-400/20 rounded-full blur-[100px] z-0"
        animate={{
          x: mousePosition.x - 160,
          y: mousePosition.y - 160,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 25, mass: 0.5 }}
      />
      
      <Sidebar />

      <div className="flex flex-1 flex-col h-screen overflow-hidden relative z-10">
        <Navbar onSearchOpen={() => setSearchOpen(true)} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 scroll-smooth pb-24 z-10">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-7xl relative"
          >
            {/* Added glass morphism wrapper around main content to enhance responsiveness and look */}
            <div className="glass-panel bg-white/5 backdrop-blur-2xl border border-white/10 p-6 md:p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
               <div className="relative z-10">
                 {children}
               </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}