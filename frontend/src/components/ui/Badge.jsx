import { cn } from "../../utils/cn";

export default function Badge({ className, variant = "default", children, ...props }) {
  const variants = {
    default: "bg-zinc-800/80 text-zinc-300 border-zinc-700/50",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]",
    error: "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_10px_rgba(225,29,72,0.2)]",
    info: "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.2)]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-sm",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
