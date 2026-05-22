import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function AnalyticsChart({ data = [], type = "area", dataKey = "value", title = "Analytics" }) {
  return (
    <div className="rounded-[1.75rem] border border-bark/10 bg-white p-5 shadow-card">
      <h3 className="mb-4 text-lg font-bold text-ink">{title}</h3>
      {data.length === 0 ? (
        <div className="flex h-72 items-center justify-center">
          <p className="text-sm text-bark/50">No data available yet.</p>
        </div>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            {type === "bar" ? (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eadccb" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey={dataKey} fill="#49705b" radius={[12, 12, 0, 0]} />
              </BarChart>
            ) : (
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="paw-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#49705b" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#49705b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#eadccb" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey={dataKey} stroke="#49705b" fill="url(#paw-area)" strokeWidth={3} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
