import { useState, useMemo, useCallback } from "react";
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
  LineChart,
  Line,
} from "recharts";
import { CalendarDays, Loader2 } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { fetchHistoricalWeather } from "@/lib/api";
import { formatDate, formatTimeIST, windDirectionToCompass } from "@/lib/conversions";

const NEON_CYAN = "#00cfff";
const NEON_PINK = "#ff7eb9";
const NEON_ORANGE = "#ffa500";

const PRESET_RANGES = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
  { label: "1Y", days: 365 },
  { label: "2Y", days: 730 },
];

const tooltipStyle = {
  background: "rgba(30,30,47,0.95)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "12px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
};
const tooltipLabelStyle = { color: "rgba(255,255,255,0.7)", fontSize: 12 };
const tooltipItemStyle = { color: "rgba(255,255,255,0.9)", fontSize: 13 };

export default function HistoricalSection({ location }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeRange, setActiveRange] = useState(null);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const loadData = useCallback(
    async (startDate, endDate, rangeDays) => {
      setLoading(true);
      setError("");
      setActiveRange(rangeDays ?? null);
      try {
        const result = await fetchHistoricalWeather(
          location.latitude,
          location.longitude,
          startDate,
          endDate
        );
        setData(result);
      } catch {
        setError("Failed to load historical data. The date range may be too far back.");
        setData([]);
      } finally {
        setLoading(false);
      }
    },
    [location]
  );

  const handlePreset = (days) => {
    const end = new Date();
    end.setDate(end.getDate() - 1);
    const start = new Date(end);
    start.setDate(start.getDate() - days);
    const fmt = (d) => d.toISOString().split("T")[0];
    loadData(fmt(start), fmt(end), days);
  };

  const handleCustom = () => {
    if (customStart && customEnd) {
      loadData(customStart, customEnd);
    }
  };

  const chartData = useMemo(() => {
    const maxPoints = 365;
    if (data.length <= maxPoints) {
      return data.map((d) => ({
        ...d,
        dateLabel: formatDate(d.date),
        sunriseIST: formatTimeIST(d.sunrise),
        sunsetIST: formatTimeIST(d.sunset),
        windDir: windDirectionToCompass(d.windDirectionDominant),
      }));
    }
    const step = Math.ceil(data.length / maxPoints);
    return data
      .filter((_, i) => i % step === 0)
      .map((d) => ({
        ...d,
        dateLabel: formatDate(d.date),
        sunriseIST: formatTimeIST(d.sunrise),
        sunsetIST: formatTimeIST(d.sunset),
        windDir: windDirectionToCompass(d.windDirectionDominant),
      }));
  }, [data]);

  const tickInterval = useMemo(() => {
    if (chartData.length <= 14) return 0;
    if (chartData.length <= 60) return 6;
    if (chartData.length <= 180) return 14;
    return 29;
  }, [chartData]);

  return (
    <section>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="section-title">Historical Data</h2>
        <div className="flex flex-wrap items-center gap-2">
          {/* Presets */}
          <div className="flex gap-1 rounded-lg p-0.5" style={{ background: "var(--surface)" }}>
            {PRESET_RANGES.map((r) => (
              <button
                key={r.days}
                onClick={() => handlePreset(r.days)}
                className="rounded-md px-3 py-1.5 text-xs font-medium transition-all"
                style={{
                  background: activeRange === r.days ? "rgba(0,207,255,0.15)" : "transparent",
                  color: activeRange === r.days ? NEON_CYAN : "hsl(var(--muted-foreground))",
                }}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Custom range picker */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="rounded-lg border px-2 py-1.5 text-xs"
              style={{
                background: "var(--surface)",
                borderColor: "var(--surface-border)",
                color: "hsl(var(--foreground))",
                colorScheme: "dark",
              }}
            />
            <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>to</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="rounded-lg border px-2 py-1.5 text-xs"
              style={{
                background: "var(--surface)",
                borderColor: "var(--surface-border)",
                color: "hsl(var(--foreground))",
                colorScheme: "dark",
              }}
            />
            <button
              onClick={handleCustom}
              disabled={!customStart || !customEnd}
              className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-all disabled:opacity-40"
              style={{ background: "rgba(0,207,255,0.15)", color: NEON_CYAN }}
            >
              <CalendarDays className="h-3 w-3" />
              Load
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: NEON_CYAN }} />
        </div>
      )}

      {error && (
        <div className="glass-card px-5 py-4 text-center text-sm" style={{ color: "var(--neon-pink)" }}>
          {error}
        </div>
      )}

      {!loading && !error && data.length === 0 && (
        <div
          className="glass-card px-5 py-12 text-center text-sm"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          Select a date range above to view historical weather data (up to 2 years).
        </div>
      )}

      {!loading && chartData.length > 0 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Temperature Trends */}
          <GlassCard className="!p-4 lg:col-span-2" delay={0}>
            <p className="mb-3 text-sm font-semibold" style={{ color: "hsl(var(--foreground))" }}>
              Temperature Trends
              <span className="ml-2 text-xs font-normal" style={{ color: "hsl(var(--muted-foreground))" }}>
                (\u00B0C)
              </span>
            </p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="grad-temp-max" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={NEON_ORANGE} stopOpacity={0.2} />
                      <stop offset="100%" stopColor={NEON_ORANGE} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="grad-temp-min" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={NEON_CYAN} stopOpacity={0.2} />
                      <stop offset="100%" stopColor={NEON_CYAN} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="dateLabel"
                    tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                    axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                    tickLine={false}
                    interval={tickInterval}
                  />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    labelStyle={tooltipLabelStyle}
                    itemStyle={tooltipItemStyle}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }} />
                  <Area type="monotone" dataKey="temperatureMax" name="Max" stroke={NEON_ORANGE} strokeWidth={1.5} fill="url(#grad-temp-max)" />
                  <Area type="monotone" dataKey="temperatureMean" name="Mean" stroke={NEON_PINK} strokeWidth={2} fill="none" />
                  <Area type="monotone" dataKey="temperatureMin" name="Min" stroke={NEON_CYAN} strokeWidth={1.5} fill="url(#grad-temp-min)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Sunrise & Sunset (IST) */}
          <GlassCard className="!p-4" delay={50}>
            <p className="mb-3 text-sm font-semibold" style={{ color: "hsl(var(--foreground))" }}>
              Sunrise & Sunset
              <span className="ml-2 text-xs font-normal" style={{ color: "hsl(var(--muted-foreground))" }}>(IST)</span>
            </p>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="dateLabel"
                    tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                    axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                    tickLine={false}
                    interval={tickInterval}
                  />
                  <YAxis
                    tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    hide
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    labelStyle={tooltipLabelStyle}
                    itemStyle={tooltipItemStyle}
                    formatter={(value) => value}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }} />
                  <Line type="monotone" dataKey="sunriseIST" name="Sunrise" stroke={NEON_ORANGE} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="sunsetIST" name="Sunset" stroke={NEON_PINK} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Precipitation */}
          <GlassCard className="!p-4" delay={100}>
            <p className="mb-3 text-sm font-semibold" style={{ color: "hsl(var(--foreground))" }}>
              Precipitation Totals
              <span className="ml-2 text-xs font-normal" style={{ color: "hsl(var(--muted-foreground))" }}>(mm)</span>
            </p>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="dateLabel"
                    tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                    axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                    tickLine={false}
                    interval={tickInterval}
                  />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    labelStyle={tooltipLabelStyle}
                    itemStyle={tooltipItemStyle}
                  />
                  <Bar dataKey="precipitationSum" name="Precipitation" fill={NEON_CYAN} radius={[3, 3, 0, 0]} fillOpacity={0.7} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Wind Speed & Direction */}
          <GlassCard className="!p-4" delay={150}>
            <p className="mb-3 text-sm font-semibold" style={{ color: "hsl(var(--foreground))" }}>
              Wind Speed & Direction
              <span className="ml-2 text-xs font-normal" style={{ color: "hsl(var(--muted-foreground))" }}>(km/h)</span>
            </p>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="grad-wind-hist" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={NEON_CYAN} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={NEON_CYAN} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="dateLabel"
                    tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                    axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                    tickLine={false}
                    interval={tickInterval}
                  />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    labelStyle={tooltipLabelStyle}
                    itemStyle={tooltipItemStyle}
                    formatter={(value, name, props) => {
                      if (name === "Wind Speed" && props.payload?.windDir) return [`${value} km/h (${props.payload.windDir})`, name];
                      return [value, name];
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="windSpeedMax"
                    name="Wind Speed"
                    stroke={NEON_CYAN}
                    strokeWidth={2}
                    fill="url(#grad-wind-hist)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* PM10 & PM2.5 Trends */}
          <GlassCard className="!p-4" delay={200}>
            <p className="mb-3 text-sm font-semibold" style={{ color: "hsl(var(--foreground))" }}>
              PM10 & PM2.5 Trends
              <span className="ml-2 text-xs font-normal" style={{ color: "hsl(var(--muted-foreground))" }}>(\u00B5g/m\u00B3)</span>
            </p>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="grad-pm10-hist" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={NEON_ORANGE} stopOpacity={0.25} />
                      <stop offset="100%" stopColor={NEON_ORANGE} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="grad-pm25-hist" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={NEON_PINK} stopOpacity={0.25} />
                      <stop offset="100%" stopColor={NEON_PINK} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="dateLabel"
                    tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                    axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                    tickLine={false}
                    interval={tickInterval}
                  />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    labelStyle={tooltipLabelStyle}
                    itemStyle={tooltipItemStyle}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }} />
                  <Area type="monotone" dataKey="pm10Mean" name="PM10" stroke={NEON_ORANGE} strokeWidth={2} fill="url(#grad-pm10-hist)" />
                  <Area type="monotone" dataKey="pm25Mean" name="PM2.5" stroke={NEON_PINK} strokeWidth={2} fill="url(#grad-pm25-hist)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
      )}
    </section>
  );
}
