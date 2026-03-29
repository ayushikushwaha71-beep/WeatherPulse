import { useState, useEffect, useCallback } from "react";
import { MapPin, RefreshCw, Thermometer } from "lucide-react";
import {
  getBrowserLocation,
  reverseGeocode,
  fetchCurrentWeather,
  fetchAirQuality,
  fetchHourlyForecast,
} from "@/lib/api";
import LocationSearch from "@/components/LocationSearch";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import CurrentWeatherSection from "@/components/CurrentWeatherSection";
import HourlyChartsSection from "@/components/HourlyChartsSection";
import HistoricalSection from "@/components/HistoricalSection";

export default function App() {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [hourly, setHourly] = useState(null);
  const [unit, setUnit] = useState("celsius");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchAllData = useCallback(async (loc) => {
    try {
      const [w, aq, h] = await Promise.all([
        fetchCurrentWeather(loc.latitude, loc.longitude),
        fetchAirQuality(loc.latitude, loc.longitude),
        fetchHourlyForecast(loc.latitude, loc.longitude),
      ]);
      setWeather(w);
      setAirQuality(aq);
      setHourly(h);
      setError("");
    } catch {
      setError("Failed to fetch weather data. Please try again.");
    }
  }, []);

  const initLocation = useCallback(async () => {
    setLoading(true);
    try {
      const pos = await getBrowserLocation();
      const loc = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
      setLocation(loc);
      await fetchAllData(loc);
    } catch {
      // Fallback to New Delhi if GPS fails
      const fallback = {
        latitude: 28.6139,
        longitude: 77.209,
        city: "New Delhi",
        country: "India",
      };
      setLocation(fallback);
      await fetchAllData(fallback);
    } finally {
      setLoading(false);
    }
  }, [fetchAllData]);

  useEffect(() => {
    initLocation();
  }, [initLocation]);

  const handleLocationSelect = async (loc) => {
    setLocation(loc);
    setLoading(true);
    await fetchAllData(loc);
    setLoading(false);
  };

  const handleRefresh = async () => {
    if (!location || refreshing) return;
    setRefreshing(true);
    await fetchAllData(location);
    setRefreshing(false);
  };

  const toggleUnit = () => {
    setUnit((prev) => (prev === "celsius" ? "fahrenheit" : "celsius"));
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-dashboard)" }}>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <h1
              className="text-2xl font-extrabold tracking-tight sm:text-3xl"
              style={{ color: "hsl(var(--foreground))" }}
            >
              WeatherPulse
            </h1>
            {location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" style={{ color: "var(--neon-cyan)" }} />
                <span className="text-sm font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {location.city}, {location.country}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <LocationSearch onSelect={handleLocationSelect} />
            <div className="flex gap-2">
              <button
                onClick={toggleUnit}
                className="glass-card flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-all"
                style={{ color: "var(--neon-cyan)" }}
              >
                <Thermometer className="h-3.5 w-3.5" />
                {"\u00B0"}{unit === "celsius" ? "C" : "F"}
              </button>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="glass-card flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-all"
                style={{ color: "var(--neon-cyan)" }}
              >
                <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </div>
        </header>

        {error && (
          <div
            className="glass-card-pink mb-6 px-5 py-4 text-center text-sm"
            style={{ color: "var(--neon-pink)" }}
          >
            {error}
          </div>
        )}

        {weather && airQuality && hourly && location && (
          <div className="space-y-10">
            <CurrentWeatherSection weather={weather} airQuality={airQuality} unit={unit} />
            <HourlyChartsSection forecast={hourly} />
            <HistoricalSection location={location} />
          </div>
        )}

        <footer className="mt-12 border-t pb-6 pt-6 text-center" style={{ borderColor: "var(--surface-border)" }}>
          <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
            Powered by Open-Meteo &middot; Air quality data from Open-Meteo Air Quality API
          </p>
        </footer>
      </div>
    </div>
  );
}
