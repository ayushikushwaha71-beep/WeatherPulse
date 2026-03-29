export function celsiusToFahrenheit(c) {
  return Math.round((c * 9) / 5 + 32);
}

export function fahrenheitToCelsius(f) {
  return Math.round(((f - 32) * 5) / 9);
}

export function formatTemp(value, unit) {
  const converted = unit === "fahrenheit" ? celsiusToFahrenheit(value) : Math.round(value);
  return `${converted}\u00B0`;
}

export function mpsToKmh(mps) {
  return Math.round(mps * 3.6);
}

export function windDirectionToCompass(degrees) {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const idx = Math.round(degrees / 22.5) % 16;
  return dirs[idx];
}

export function formatTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
}

export function formatTimeIST(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" });
}

export function formatHour(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", { hour: "numeric", hour12: true });
}

export function getAQILabel(aqi) {
  if (aqi <= 50) return { label: "Good", color: "#22c55e" };
  if (aqi <= 100) return { label: "Moderate", color: "#eab308" };
  if (aqi <= 150) return { label: "Unhealthy (Sensitive)", color: "#f97316" };
  if (aqi <= 200) return { label: "Unhealthy", color: "#ef4444" };
  if (aqi <= 300) return { label: "Very Unhealthy", color: "#a855f7" };
  return { label: "Hazardous", color: "#991b1b" };
}

export function getUVLabel(uv) {
  if (uv <= 2) return { label: "Low", color: "#22c55e" };
  if (uv <= 5) return { label: "Moderate", color: "#eab308" };
  if (uv <= 7) return { label: "High", color: "#f97316" };
  if (uv <= 10) return { label: "Very High", color: "#ef4444" };
  return { label: "Extreme", color: "#a855f7" };
}

export function getWeatherIcon(code, isDay) {
  const icons = {
    0: isDay ? "\u2600\uFE0F" : "\uD83C\uDF19",
    1: isDay ? "\uD83C\uDF24\uFE0F" : "\uD83C\uDF19",
    2: "\u26C5",
    3: "\u2601\uFE0F",
    45: "\uD83C\uDF2B\uFE0F",
    48: "\uD83C\uDF2B\uFE0F",
    51: "\uD83C\uDF26\uFE0F",
    53: "\uD83C\uDF26\uFE0F",
    55: "\uD83C\uDF27\uFE0F",
    56: "\uD83C\uDF27\uFE0F",
    57: "\uD83C\uDF27\uFE0F",
    61: "\uD83C\uDF27\uFE0F",
    63: "\uD83C\uDF27\uFE0F",
    65: "\uD83C\uDF27\uFE0F",
    66: "\uD83C\uDF27\uFE0F",
    67: "\uD83C\uDF27\uFE0F",
    71: "\uD83C\uDF28\uFE0F",
    73: "\uD83C\uDF28\uFE0F",
    75: "\uD83C\uDF28\uFE0F",
    77: "\uD83C\uDF28\uFE0F",
    80: "\uD83C\uDF26\uFE0F",
    81: "\uD83C\uDF27\uFE0F",
    82: "\uD83C\uDF27\uFE0F",
    85: "\uD83C\uDF28\uFE0F",
    86: "\uD83C\uDF28\uFE0F",
    95: "\u26C8\uFE0F",
    96: "\u26C8\uFE0F",
    99: "\u26C8\uFE0F",
  };
  return icons[code] ?? "\uD83C\uDF24\uFE0F";
}

export function getWeatherDescription(code) {
  const descriptions = {
    0: "Clear Sky",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing Rime Fog",
    51: "Light Drizzle",
    53: "Moderate Drizzle",
    55: "Dense Drizzle",
    56: "Freezing Drizzle",
    57: "Dense Freezing Drizzle",
    61: "Slight Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    66: "Freezing Rain",
    67: "Heavy Freezing Rain",
    71: "Slight Snowfall",
    73: "Moderate Snowfall",
    75: "Heavy Snowfall",
    77: "Snow Grains",
    80: "Slight Rain Showers",
    81: "Moderate Rain Showers",
    82: "Violent Rain Showers",
    85: "Slight Snow Showers",
    86: "Heavy Snow Showers",
    95: "Thunderstorm",
    96: "Thunderstorm with Hail",
    99: "Thunderstorm with Heavy Hail",
  };
  return descriptions[code] ?? "Unknown";
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatDateFull(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
