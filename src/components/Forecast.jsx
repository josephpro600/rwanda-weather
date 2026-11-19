
import {
  Sun,
  Cloud,
  CloudRain,
  CloudLightning
} from "lucide-react";

import { getWeatherDescription } from "../services/weatherApi";

function Forecast({ weather }) {
  const daily = weather.daily;

  function WeatherIcon({ code }) {
    if ([95, 96, 99].includes(code)) {
      return <CloudLightning />;
    }

    if (code >= 51) {
      return <CloudRain />;
    }

    if (code === 0 || code === 1) {
      return <Sun />;
    }

    return <Cloud />;
  }

  return (
    <section className="dashboard-card">
      <h2>7-Day Forecast</h2>

      <div className="forecast-grid">
        {daily.time.map((date, index) => (
          <div className="forecast-card" key={date}>
            <h4>
              {index === 0
                ? "Today"
                : new Date(date + "T12:00:00").toLocaleDateString(
                    "en",
                    { weekday: "short" }
                  )}
            </h4>

            <WeatherIcon code={daily.weather_code[index]} />

            <p>{getWeatherDescription(daily.weather_code[index])}</p>

            <div className="forecast-temperatures">
              <strong>
                {Math.round(daily.temperature_2m_max[index])}°
              </strong>

              <span>
                {Math.round(daily.temperature_2m_min[index])}°
              </span>
            </div>

            <small>
              Rain: {daily.precipitation_probability_max[index] ?? 0}%
            </small>

            <small>
              UV: {daily.uv_index_max[index] ?? "N/A"}
            </small>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Forecast;
