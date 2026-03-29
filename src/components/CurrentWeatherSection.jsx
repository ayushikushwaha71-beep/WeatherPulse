import {
  Thermometer,
  Droplets,
  CloudRain,
  Sun,
  Sunrise,
  Sunset,
  Wind,
  Gauge,
} from "lucide-react";
import GlassCard from "@/components/GlassCard";
import {
  formatTemp,
  formatTime,
  windDirectionToCompass,
  getUVLabel,
  getAQILabel,
  getWeatherIcon,
  getWeatherDescription,
} from "@/lib/conversions";

export default function CurrentWeatherSection({
  weather,
  airQuality,
  unit,
}) {
  const uvInfo = getUVLabel(weather.uvIndex);
  const aqiInfo = getAQILabel(airQuality.aqi);

  return (
    <section>
      <h2 className="section-title mb-4">Current Weather</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Temperature Card */}
        <GlassCard accent="cyan" className="sm:col-span-2 lg:col-span-2" delay={0}>
          <div className="flex items-start justify-between">
            <div>
              <p className="metric-label">Temperature</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-5xl font-extrabold tracking-tighter" style={{ color: "hsl(var(--foreground))" }}>
                  {formatTemp(weather.temperature, unit)}
                </span>
                <span className="text-2xl" aria-label={getWeatherDescription(weather.weatherCode)}>
                  {getWeatherIcon(weather.weatherCode, weather.isDay)}
                </span>
              </div>
              <p className="mt-1 text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                {getWeatherDescription(weather.weatherCode)} &middot; Feels like{" "}
                {formatTemp(weather.apparentTemperature, unit)}
              </p>
            </div>
            <Thermometer className="h-6 w-6 shrink-0" style={{ color: "var(--neon-cyan)" }} />
          </div>
          <div className="mt-4 flex gap-6">
            <div>
              <p className="metric-label">Min</p>
              <p className="text-lg font-semibold" style={{ color: "hsl(var(--foreground))" }}>
                {formatTemp(weather.temperatureMin, unit)}
              </p>
            </div>
            <div>
              <p className="metric-label">Max</p>
              <p className="text-lg font-semibold" style={{ color: "hsl(var(--foreground))" }}>
                {formatTemp(weather.temperatureMax, unit)}
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Humidity */}
        <GlassCard accent="cyan" delay={50}>
          <div className="flex items-start justify-between">
            <p className="metric-label">Humidity</p>
            <Droplets className="h-5 w-5" style={{ color: "var(--neon-cyan)" }} />
          </div>
          <p className="metric-value mt-2">{weather.humidity}<span className="metric-unit">%</span></p>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${weather.humidity}%`,
                background: "var(--gradient-neon-cyan)",
              }}
            />
          </div>
        </GlassCard>

        {/* Precipitation */}
        <GlassCard accent="pink" delay={100}>
          <div className="flex items-start justify-between">
            <p className="metric-label">Precipitation</p>
            <CloudRain className="h-5 w-5" style={{ color: "var(--neon-pink)" }} />
          </div>
          <p className="metric-value mt-2">
            {weather.precipitation}
            <span className="metric-unit"> mm</span>
          </p>
          <p className="mt-1 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
            Current rainfall rate
          </p>
        </GlassCard>

        {/* UV Index */}
        <GlassCard accent="orange" delay={150}>
          <div className="flex items-start justify-between">
            <p className="metric-label">UV Index</p>
            <Sun className="h-5 w-5" style={{ color: "var(--neon-orange)" }} />
          </div>
          <p className="metric-value mt-2">{Math.round(weather.uvIndex)}</p>
          <p className="mt-1 text-xs font-medium" style={{ color: uvInfo.color }}>
            {uvInfo.label}
          </p>
        </GlassCard>

        {/* Sunrise & Sunset */}
        <GlassCard accent="orange" delay={200}>
          <p className="metric-label">Sunrise & Sunset</p>
          <div className="mt-3 space-y-3">
            <div className="flex items-center gap-3">
              <Sunrise className="h-5 w-5" style={{ color: "var(--neon-orange)" }} />
              <div>
                <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Sunrise</p>
                <p className="text-sm font-semibold" style={{ color: "hsl(var(--foreground))" }}>
                  {formatTime(weather.sunrise)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Sunset className="h-5 w-5" style={{ color: "var(--neon-pink)" }} />
              <div>
                <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Sunset</p>
                <p className="text-sm font-semibold" style={{ color: "hsl(var(--foreground))" }}>
                  {formatTime(weather.sunset)}
                </p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Wind */}
        <GlassCard accent="cyan" delay={250}>
          <div className="flex items-start justify-between">
            <p className="metric-label">Wind</p>
            <Wind className="h-5 w-5" style={{ color: "var(--neon-cyan)" }} />
          </div>
          <p className="metric-value mt-2">
            {Math.round(weather.windSpeed)}
            <span className="metric-unit"> km/h</span>
          </p>
          <div className="mt-1 flex items-center gap-2">
            <span
              className="inline-block h-5 w-5 text-center text-xs leading-5"
              style={{
                color: "var(--neon-cyan)",
                transform: `rotate(${weather.windDirection}deg)`,
              }}
            >
              ↑
            </span>
            <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
              {windDirectionToCompass(weather.windDirection)} ({weather.windDirection}\u00B0)
            </span>
          </div>
        </GlassCard>

        {/* Air Quality */}
        <GlassCard accent="pink" className="sm:col-span-2" delay={300}>
          <div className="flex items-start justify-between">
            <div>
              <p className="metric-label">Air Quality Index</p>
              <div className="mt-1 flex items-baseline gap-3">
                <span className="metric-value">{airQuality.aqi}</span>
                <span className="text-sm font-medium" style={{ color: aqiInfo.color }}>
                  {aqiInfo.label}
                </span>
              </div>
            </div>
            <Gauge className="h-5 w-5" style={{ color: "var(--neon-pink)" }} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {[
              { label: "PM10", value: airQuality.pm10, unit: "\u00B5g/m\u00B3" },
              { label: "PM2.5", value: airQuality.pm25, unit: "\u00B5g/m\u00B3" },
              { label: "CO", value: airQuality.co, unit: "\u00B5g/m\u00B3" },
              { label: "NO\u2082", value: airQuality.no2, unit: "\u00B5g/m\u00B3" },
              { label: "SO\u2082", value: airQuality.so2, unit: "\u00B5g/m\u00B3" },
              { label: "O\u2083", value: airQuality.o3, unit: "\u00B5g/m\u00B3" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg p-2 text-center"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {item.label}
                </p>
                <p className="mt-0.5 text-sm font-bold" style={{ color: "hsl(var(--foreground))" }}>
                  {Math.round(item.value)}
                </p>
                <p className="text-[9px]" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {item.unit}
                </p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
