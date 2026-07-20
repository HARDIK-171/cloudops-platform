import { motion } from "framer-motion";
import Card from "../ui/Card";

export default function InfoCard({ title, value, unit = "", icon }) {
  return (
    <Card hover className="flex flex-col group p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 group-hover:text-brand-400 transition-colors group-hover:scale-110 duration-300">
          {icon}
        </div>
        <h3 className="text-slate-400 font-medium tracking-wide text-sm uppercase">
          {title}
        </h3>
      </div>
      <div className="flex items-baseline gap-2 mt-auto">
        <div className="text-3xl font-semibold tracking-tight text-white">
          {value}
        </div>
        {unit && <span className="text-sm text-slate-500 font-medium">{unit}</span>}
      </div>
    </Card>
  );
}
