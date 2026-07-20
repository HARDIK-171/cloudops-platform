import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Card from "../ui/Card";

export default function MetricChart({ title, data, dataKey, color = "#6366f1", gradientId = "colorValue" }) {
  return (
    <Card className="h-[300px] flex flex-col p-5">
      <h3 className="text-slate-400 font-medium tracking-wide text-sm uppercase mb-6">
        {title}
      </h3>
      <div className="flex-1 w-full h-full -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              hide 
            />
            <YAxis 
              domain={[0, 100]} 
              hide 
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#f8fafc' }}
              itemStyle={{ color: '#e2e8f0' }}
            />
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              strokeWidth={2}
              fillOpacity={1} 
              fill={`url(#${gradientId})`} 
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
