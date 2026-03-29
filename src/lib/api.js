const WEATHER_BASE = "https://api.open-meteo.com/v1/forecast";
const AIR_QUALITY_BASE = "https://air-quality-api.open-meteo.com/v1/air-quality";
const GEOCODING_BASE = "https://geocoding-api.open-meteo.com/v1";
const ARCHIVE_BASE = "https://archive-api.open-meteo.com/v1/archive";

export function getBrowserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000,
    });
  });
}

export async function reverseGeocode(lat, lon) {
  const res = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
  );
  const data = await res.json();
  return {
    latitude: lat,
    longitude: lon,
    city: data.city || data.locality || data.principalSubdivision || "Unknown",
    country: data.countryName || "Unknown",
  };
}

export async function searchLocations(query) {
  if (!query.trim()) return [];
  const res = await fetch(
    `${GEOCODING_BASE}/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
  );
  const data = await res.json();
  if (!data.results) return [];
  return data.results.map((r) => ({
    latitude: r.latitude,
    longitude: r.longitude,
    city: r.name,
    country: r.country,
  }));
}

export async function fetchCurrentWeather(lat, lon) {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "precipitation",
      "weather_code",
      "wind_speed_10m",
      "wind_direction_10m",
      "is_day",
      "apparent_temperature",
      "pressure_msl",
    ].join(","),
    daily: ["temperature_2m_max", "temperature_2m_min", "uv_index_max", "sunrise", "sunset"].join(","),
    timezone: "auto",
    forecast_days: "1",
  });
  const res = await fetch(`${WEATHER_BASE}?${params}`);
  const data = await res.json();
  const c = data.current;
  const d = data.daily;
  return {
    temperature: c.temperature_2m,
    temperatureMin: d.temperature_2m_min[0],
    temperatureMax: d.temperature_2m_max[0],
    humidity: c.relative_humidity_2m,
    precipitation: c.precipitation,
    uvIndex: d.uv_index_max[0],
    sunrise: d.sunrise[0],
    sunset: d.sunset[0],
    windSpeed: c.wind_speed_10m,
    windDirection: c.wind_direction_10m,
    weatherCode: c.weather_code,
    isDay: c.is_day === 1,
    apparentTemperature: c.apparent_temperature,
    pressureMsl: c.pressure_msl,
    visibility: 0,
  };
}

export async function fetchAirQuality(lat, lon) {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: [
      "european_aqi",
      "pm10",
      "pm2_5",
      "carbon_monoxide",
      "nitrogen_dioxide",
      "sulphur_dioxide",
      "ozone",
    ].join(","),
  });
  const res = await fetch(`${AIR_QUALITY_BASE}?${params}`);
  const data = await res.json();
  const c = data.current;
  return {
    aqi: c.european_aqi ?? 0,
    pm10: c.pm10 ?? 0,
    pm25: c.pm2_5 ?? 0,
    co: c.carbon_monoxide ?? 0,
    no2: c.nitrogen_dioxide ?? 0,
    so2: c.sulphur_dioxide ?? 0,
    o3: c.ozone ?? 0,
  };
}

export async function fetchHourlyForecast(lat, lon) {
  const weatherParams = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    hourly: [
      "temperature_2m",
      "relative_humidity_2m",
      "precipitation",
      "visibility",
      "wind_speed_10m",
    ].join(","),
    timezone: "auto",
    forecast_days: "2",
  });

  const aqParams = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    hourly: ["pm10", "pm2_5"].join(","),
    forecast_days: "2",
  });

  const [weatherRes, aqRes] = await Promise.all([
    fetch(`${WEATHER_BASE}?${weatherParams}`),
    fetch(`${AIR_QUALITY_BASE}?${aqParams}`),
  ]);

  const weatherData = await weatherRes.json();
  const aqData = await aqRes.json();

  const h = weatherData.hourly;
  const aq = aqData.hourly;

  return {
    time: h.time,
    temperature: h.temperature_2m,
    humidity: h.relative_humidity_2m,
    precipitation: h.precipitation,
    visibility: h.visibility.map((v) => v / 1000),
    windSpeed10m: h.wind_speed_10m,
    pm10: aq?.pm10 ?? [],
    pm25: aq?.pm2_5 ?? [],
  };
}

export async function fetchHistoricalWeather(lat, lon, startDate, endDate) {
  const weatherParams = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    daily: [
      "temperature_2m_mean",
      "temperature_2m_max",
      "temperature_2m_min",
      "sunrise",
      "sunset",
      "precipitation_sum",
      "wind_speed_10m_max",
      "wind_direction_10m_dominant",
    ].join(","),
    start_date: startDate,
    end_date: endDate,
    timezone: "auto",
  });

  const aqParams = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    hourly: ["pm10", "pm2_5"].join(","),
    start_date: startDate,
    end_date: endDate,
  });

  const [weatherRes, aqRes] = await Promise.all([
    fetch(`${ARCHIVE_BASE}?${weatherParams}`),
    fetch(`${AIR_QUALITY_BASE}?${aqParams}`).catch(() => null),
  ]);

  const weatherData = await weatherRes.json();
  const d = weatherData.daily;

  const dailyPM10 = {};
  const dailyPM25 = {};

  if (aqRes) {
    try {
      const aqData = await aqRes.json();
      const aqH = aqData.hourly;
      if (aqH?.time) {
        for (let i = 0; i < aqH.time.length; i++) {
          const day = aqH.time[i].substring(0, 10);
          if (aqH.pm10?.[i] != null) {
            if (!dailyPM10[day]) dailyPM10[day] = [];
            dailyPM10[day].push(aqH.pm10[i]);
          }
          if (aqH.pm2_5?.[i] != null) {
            if (!dailyPM25[day]) dailyPM25[day] = [];
            dailyPM25[day].push(aqH.pm2_5[i]);
          }
        }
      }
    } catch {
    }
  }

  const days = [];
  for (let i = 0; i < d.time.length; i++) {
    const date = d.time[i];
    const pm10Arr = dailyPM10[date];
    const pm25Arr = dailyPM25[date];
    days.push({
      date,
      temperatureMean: d.temperature_2m_mean[i],
      temperatureMax: d.temperature_2m_max[i],
      temperatureMin: d.temperature_2m_min[i],
      sunrise: d.sunrise[i],
      sunset: d.sunset[i],
      precipitationSum: d.precipitation_sum[i],
      windSpeedMax: d.wind_speed_10m_max[i],
      windDirectionDominant: d.wind_direction_10m_dominant[i],
      pm10Mean: pm10Arr ? Math.round(pm10Arr.reduce((a, b) => a + b, 0) / pm10Arr.length) : undefined,
      pm25Mean: pm25Arr ? Math.round(pm25Arr.reduce((a, b) => a + b, 0) / pm25Arr.length) : undefined,
    });
  }
  return days;
}
