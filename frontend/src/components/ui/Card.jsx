import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export default function Card({ className, children, hover = false, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
      className={cn(
        "glass-panel rounded-2xl p-6 relative overflow-hidden",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:opacity-0 before:transition-opacity hover:before:opacity-100",
        className
      )}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
