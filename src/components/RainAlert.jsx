
import { AlertTriangle, CloudRain, CheckCircle } from "lucide-react";

function RainAlert({ weather }) {
  const probability =
    weather.daily.precipitation_probability_max[0] ?? 0;

  const code = weather.current.weather_code;

  const isStorm = [95, 96, 99].includes(code);
  const isHeavyRain = code === 65 || code === 82;
  const hasRainRisk = probability >= 60;

  if (isStorm || isHeavyRain || hasRainRisk) {
    return (
      <section className="alert-card warning">
        <AlertTriangle size={25} />

        <div>
          <h3>Weather Alert</h3>

          <p>
            {isStorm
              ? "Thunderstorm conditions are currently reported."
              : isHeavyRain
              ? "Heavy rain conditions are currently reported."
              : `There is a ${probability}% chance of precipitation today.`}
          </p>

          <small>
            Check the forecast before planning outdoor activities.
          </small>
        </div>
      </section>
    );
  }

  return (
    <section className="alert-card success">
      <CheckCircle size={25} />

      <div>
        <h3>No Major Rain Alert</h3>
        <p>There is currently no high precipitation risk.</p>
      </div>

      <CloudRain size={25} />
    </section>
  );
}

export default RainAlert;
