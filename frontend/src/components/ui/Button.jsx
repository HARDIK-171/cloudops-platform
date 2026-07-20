import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export default function Button({ className, variant = "primary", size = "md", children, ...props }) {
  const variants = {
    primary: "bg-brand-600 text-white hover:bg-brand-500 shadow-[0_0_15px_rgba(79,70,229,0.5)] border border-brand-500/50",
    secondary: "bg-zinc-800 text-slate-200 hover:bg-zinc-700 border border-white/10",
    ghost: "bg-transparent text-slate-300 hover:bg-white/5 hover:text-white",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
