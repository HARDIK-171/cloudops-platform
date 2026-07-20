import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import Card from "../ui/Card";
import ProgressBar from "../ui/ProgressBar";
import Badge from "../ui/Badge";
import { getMetricColor } from "../../utils/metricUtils";

export default function StatCard({ title, value, unit, icon, trend = 0 }) {
  const colors = getMetricColor(value);

  return (
    <Card hover className="flex flex-col h-full group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 group-hover:text-white transition-colors group-hover:scale-110 group-hover:rotate-3 duration-300">
            {icon}
          </div>
          <h3 className="text-slate-400 font-medium tracking-wide text-sm uppercase">
            {title}
          </h3>
        </div>
        <Badge variant={colors.variant}>
          {colors.status}
        </Badge>
      </div>

      <div className="flex-1 flex flex-col justify-end">
        <div className="flex items-baseline gap-2 mb-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={value}
            className={`text-5xl font-semibold tracking-tight ${colors.text} drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]`}
          >
            {Math.round(value)}
          </motion.div>
          <span className="text-xl text-slate-500 font-medium">{unit}</span>
          
          {trend !== 0 && (
            <div className={`ml-auto flex items-center text-sm font-medium ${trend > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {trend > 0 ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
              {Math.abs(trend)}%
            </div>
          )}
        </div>

        <ProgressBar 
          value={value} 
          color={colors.bar} 
          className="h-1.5 bg-black/40" 
        />
      </div>
    </Card>
  );
}