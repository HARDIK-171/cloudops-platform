import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export default function LoadingSpinner({ className, size = 24 }) {
  return (
    <motion.div
      className={cn("border-2 border-brand-500/20 border-t-brand-500 rounded-full", className)}
      style={{ width: size, height: size }}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
}
