
import {
  MapPin,
  Thermometer,
  Droplets,
  Wind,
  Cloud,
  Sun,
  CloudSun,
  CloudRain,
  CloudLightning,
  CloudSnow,
  Eye,
} from "lucide-react";

const getWeatherInfo = (code) => {
  const weatherCodes = {
    0: { name: "Clear sky", icon: Sun },
    1: { name: "Mainly clear", icon: Sun },
    2: { name: "Partly cloudy", icon: CloudSun },
    3: { name: "Overcast", icon: Cloud },
    45: { name: "Fog", icon: Cloud },
    48: { name: "Depositing rime fog", icon: Cloud },
    51: { name: "Light drizzle", icon: CloudRain },
    53: { name: "Moderate drizzle", icon: CloudRain },
    55: { name: "Dense drizzle", icon: CloudRain },
    56: { name: "Freezing drizzle", icon: CloudSnow },
    57: { name: "Heavy freezing drizzle", icon: CloudSnow },
    61: { name: "Slight rain", icon: CloudRain },
    63: { name: "Moderate rain", icon: CloudRain },
    65: { name: "Heavy rain", icon: CloudRain },
    66: { name: "Freezing rain", icon: CloudSnow },
    67: { name: "Heavy freezing rain", icon: CloudSnow },
    71: { name: "Slight snowfall", icon: CloudSnow },
    73: { name: "Moderate snowfall", icon: CloudSnow },
    75: { name: "Heavy snowfall", icon: CloudSnow },
    77: { name: "Snow grains", icon: CloudSnow },
    80: { name: "Slight rain showers", icon: CloudRain },
    81: { name: "Moderate rain showers", icon: CloudRain },
    82: { name: "Violent rain showers", icon: CloudRain },
    85: { name: "Slight snow showers", icon: CloudSnow },
    86: { name: "Heavy snow showers", icon: CloudSnow },
    95: { name: "Thunderstorm", icon: CloudLightning },
    96: { name: "Thunderstorm with hail", icon: CloudLightning },
    99: { name: "Severe thunderstorm with hail", icon: CloudLightning },
  };

  return weatherCodes[code] || {
    name: "Weather information unavailable",
    icon: Cloud,
  };
};

function CurrentWeather({ weather, district, province }) {
  // Prevent errors when weather data has not loaded.
  if (!weather || !weather.current) {
    return (
      <section className="current-weather weather-unavailable">
        <div className="weather-empty-icon">
          <CloudSun size={45} />
        </div>
        <h2>Weather information unavailable</h2>
        <p>
          Please select a province and district to view current weather
          information.
        </p>
      </section>
    );
  }

  const current = weather.current;

  const temperature = current.temperature_2m;
  const feelsLike = current.apparent_temperature;
  const humidity = current.relative_humidity_2m;
  const windSpeed = current.wind_speed_10m;
  const weatherCode = current.weather_code;

  const weatherInfo = getWeatherInfo(weatherCode);
  const WeatherIcon = weatherInfo.icon;

  const locationName =
    district ||
    weather.location?.name ||
    weather.name ||
    "Rwanda";

  const provinceName = province || "";

  const formatValue = (value, unit = "") =>
    value !== undefined && value !== null
      ? `${value}${unit}`
      : "--";

  return (
    <section className="current-weather">
      <div className="current-weather-top">
        <div>
          <div className="weather-location">
            <MapPin size={18} />
            <span>
              {locationName}
              {provinceName ? `, ${provinceName}` : ""}
            </span>
          </div>

          <p className="weather-condition">
            {weatherInfo.name}
          </p>
        </div>

        <div className="weather-main-icon">
          <WeatherIcon size={65} strokeWidth={1.5} />
        </div>
      </div>

      <div className="weather-temperature">
        <h1>
          {formatValue(temperature, "°C")}
        </h1>

        <p>
          Feels like {formatValue(feelsLike, "°C")}
        </p>
      </div>

      <div className="current-weather-details">
        <div className="current-weather-detail">
          <Droplets size={23} />
          <div>
            <span>Humidity</span>
            <strong>{formatValue(humidity, "%")}</strong>
          </div>
        </div>

        <div className="current-weather-detail">
          <Wind size={23} />
          <div>
            <span>Wind speed</span>
            <strong>{formatValue(windSpeed, " km/h")}</strong>
          </div>
        </div>

        <div className="current-weather-detail">
          <Thermometer size={23} />
          <div>
            <span>Feels like</span>
            <strong>{formatValue(feelsLike, "°C")}</strong>
          </div>
        </div>

        <div className="current-weather-detail">
          <Eye size={23} />
          <div>
            <span>Cloud cover</span>
            <strong>
              {formatValue(current.cloud_cover, "%")}
            </strong>
          </div>
        </div>
      </div>

      <p className="weather-updated">
        Current weather powered by Open-Meteo
      </p>
    </section>
  );
}

export default CurrentWeather;
