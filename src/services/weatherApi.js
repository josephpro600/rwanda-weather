
const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

export async function getDistrictCoordinates(district) {
  const params = new URLSearchParams({
    name: district,
    count: "10",
    language: "en",
    format: "json",
    countryCode: "RW"
  });

  const response = await fetch(`${GEO_URL}?${params}`);

  if (!response.ok) {
    throw new Error("Could not search for this district.");
  }

  const data = await response.json();

  const location = data.results?.find(
    (item) => item.country_code === "RW"
  );

  if (!location) {
    throw new Error(`Location not found in Rwanda: ${district}`);
  }

  return location;
}

export async function getWeather(latitude, longitude) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    timezone: "Africa/Kigali",
    forecast_days: "7",

    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "is_day",
      "precipitation",
      "weather_code",
      "cloud_cover",
      "pressure_msl",
      "wind_speed_10m",
      "wind_direction_10m",
      "visibility",
      "uv_index"
    ].join(","),

    hourly: [
      "temperature_2m",
      "precipitation_probability",
      "relative_humidity_2m",
      "weather_code",
      "uv_index"
    ].join(","),

    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "sunrise",
      "sunset",
      "precipitation_probability_max",
      "uv_index_max",
      "precipitation_sum"
    ].join(",")
  });

  const response = await fetch(`${WEATHER_URL}?${params}`);

  if (!response.ok) {
    throw new Error("Unable to fetch weather information.");
  }

  return response.json();
}

export function getWeatherDescription(code) {
  const conditions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Heavy drizzle",
    56: "Freezing drizzle",
    57: "Heavy freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    77: "Snow grains",
    80: "Rain showers",
    81: "Moderate rain showers",
    82: "Heavy rain showers",
    85: "Snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with hail",
    99: "Heavy thunderstorm with hail"
  };

  return conditions[code] || "Unknown condition";
}
