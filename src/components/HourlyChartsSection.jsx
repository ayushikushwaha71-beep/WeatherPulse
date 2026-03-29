import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import GlassCard from "@/components/GlassCard";
import { formatHour } from "@/lib/conversions";

const NEON_CYAN = "#00cfff";
const NEON_PINK = "#ff7eb9";
const NEON_ORANGE = "#ffa500";

const CHARTS = [
  { title: "Temperature", dataKey: "temperature", color: NEON_CYAN, unit: "\u00B0C", type: "area" },
  { title: "Humidity", dataKey: "humidity", color: NEON_PINK, unit: "%", type: "area" },
  { title: "Precipitation", dataKey: "precipitation", color: NEON_CYAN, unit: "mm", type: "bar" },
  { title: "Visibility", dataKey: "visibility", color: NEON_ORANGE, unit: "km", type: "area" },
  { title: "Wind Speed (10m)", dataKey: "windSpeed10m", color: NEON_CYAN, unit: "km/h", type: "area" },
  {
    title: "PM10 & PM2.5",
    dataKey: "pm10",
    color: NEON_ORANGE,
    unit: "\u00B5g/m\u00B3",
    type: "dual-area",
    secondaryKey: "pm25",
    secondaryColor: NEON_PINK,
    secondaryLabel: "PM2.5",
  },
];

const tooltipStyle = {
  background: "rgba(30,30,47,0.95)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px",
  backdropFilter: "blur(10px)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
};
const tooltipLabelStyle = { color: "rgba(255,255,255,0.7)", fontSize: 12 };
const tooltipItemStyle = { color: "rgba(255,255,255,0.9)", fontSize: 13 };

export default function HourlyChartsSection({ forecast }) {
  const [zoom, setZoom] = useState(24);

  const chartData = useMemo(() => {
    const count = Math.min(zoom, forecast.time.length);
    return Array.from({ length: count }, (_, i) => ({
      time: formatHour(forecast.time[i]),
      temperature: forecast.temperature[i],
      humidity: forecast.humidity[i],
      precipitation: forecast.precipitation[i],
      visibility: forecast.visibility[i],
      windSpeed10m: forecast.windSpeed10m[i],
      pm10: forecast.pm10[i] ?? 0,
      pm25: forecast.pm25[i] ?? 0,
    }));
  }, [forecast, zoom]);

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="section-title">Hourly Forecast</h2>
        <div className="flex gap-1 rounded-lg p-0.5" style={{ background: "var(--surface)" }}>
          {[24, 48].map((h) => (
            <button
              key={h}
              onClick={() => setZoom(h)}
              className="rounded-md px-3 py-1.5 text-xs font-medium transition-all"
              style={{
                background: zoom === h ? "rgba(0,207,255,0.15)" : "transparent",
                color: zoom === h ? NEON_CYAN : "hsl(var(--muted-foreground))",
              }}
            >
              {h}h
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {CHARTS.map((chart, idx) => (
          <GlassCard key={chart.dataKey} delay={idx * 50} className="!p-4">
            <p className="mb-3 text-sm font-semibold" style={{ color: "hsl(var(--foreground))" }}>
              {chart.title}
              <span className="ml-2 text-xs font-normal" style={{ color: "hsl(var(--muted-foreground))" }}>
                ({chart.unit})
              </span>
            </p>
            <div className="h-56 w-full overflow-x-auto">
              <div style={{ minWidth: zoom > 24 ? "700px" : "100%", height: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  {chart.type === "bar" ? (
                    <BarChart data={chartData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis
                        dataKey="time"
                        tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                        axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                        tickLine={false}
                        interval={zoom > 24 ? 5 : 2}
                      />
                      <YAxis
                        tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={tooltipStyle}
                        labelStyle={tooltipLabelStyle}
                        itemStyle={tooltipItemStyle}
                      />
                      <Bar
                        dataKey={chart.dataKey}
                        fill={chart.color}
                        radius={[4, 4, 0, 0]}
                        fillOpacity={0.7}
                      />
                    </BarChart>
                  ) : chart.type === "dual-area" ? (
                    <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                      <defs>
                        <linearGradient id={`grad-${chart.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={chart.color} stopOpacity={0.3} />
                          <stop offset="100%" stopColor={chart.color} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id={`grad-${chart.secondaryKey}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={chart.secondaryColor} stopOpacity={0.3} />
                          <stop offset="100%" stopColor={chart.secondaryColor} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis
                        dataKey="time"
                        tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                        axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                        tickLine={false}
                        interval={zoom > 24 ? 5 : 2}
                      />
                      <YAxis
                        tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={tooltipStyle}
                        labelStyle={tooltipLabelStyle}
                        itemStyle={tooltipItemStyle}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}
                      />
                      <Area
                        type="monotone"
                        dataKey={chart.dataKey}
                        name="PM10"
                        stroke={chart.color}
                        strokeWidth={2}
                        fill={`url(#grad-${chart.dataKey})`}
                      />
                      <Area
                        type="monotone"
                        dataKey={chart.secondaryKey}
                        name={chart.secondaryLabel}
                        stroke={chart.secondaryColor}
                        strokeWidth={2}
                        fill={`url(#grad-${chart.secondaryKey})`}
                      />
                    </AreaChart>
                  ) : (
                    <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                      <defs>
                        <linearGradient id={`grad-${chart.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={chart.color} stopOpacity={0.3} />
                          <stop offset="100%" stopColor={chart.color} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis
                        dataKey="time"
                        tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                        axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                        tickLine={false}
                        interval={zoom > 24 ? 5 : 2}
                      />
                      <YAxis
                        tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={tooltipStyle}
                        labelStyle={tooltipLabelStyle}
                        itemStyle={tooltipItemStyle}
                      />
                      <Area
                        type="monotone"
                        dataKey={chart.dataKey}
                        stroke={chart.color}
                        strokeWidth={2}
                        fill={`url(#grad-${chart.dataKey})`}
                      />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
