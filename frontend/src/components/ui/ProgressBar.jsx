import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export default function ProgressBar({ value, max = 100, className, barClassName, color = "bg-brand-500" }) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  return (
    <div className={cn("w-full bg-zinc-800/50 rounded-full h-2 overflow-hidden border border-white/5", className)}>
      <motion.div
        className={cn("h-full rounded-full relative", color, barClassName)}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite] -skew-x-12 transform -translate-x-full" />
      </motion.div>
    </div>
  );
}
