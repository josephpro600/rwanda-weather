
import {
  Droplets,
  Wind,
  Gauge,
  Cloud,
  CloudRain,
  Compass,
  Eye,
  Sun
} from "lucide-react";

function WeatherDetails({ weather }) {
  const current = weather.current;

  const details = [
    {
      name: "Humidity",
      value: `${current.relative_humidity_2m}%`,
      icon: <Droplets />
    },
    {
      name: "Wind speed",
      value: `${current.wind_speed_10m} km/h`,
      icon: <Wind />
    },
    {
      name: "Pressure",
      value: `${current.pressure_msl} hPa`,
      icon: <Gauge />
    },
    {
      name: "Cloud cover",
      value: `${current.cloud_cover}%`,
      icon: <Cloud />
    },
    {
      name: "Precipitation",
      value: `${current.precipitation} mm`,
      icon: <CloudRain />
    },
    {
      name: "Wind direction",
      value: `${current.wind_direction_10m}°`,
      icon: <Compass />
    },
    {
      name: "Visibility",
      value: `${(current.visibility / 1000).toFixed(1)} km`,
      icon: <Eye />
    },
    {
      name: "UV index",
      value: current.uv_index,
      icon: <Sun />
    }
  ];

  return (
    <section className="details-grid">
      {details.map((item) => (
        <div className="detail-card" key={item.name}>
          {item.icon}
          <p>{item.name}</p>
          <h3>{item.value ?? "N/A"}</h3>
        </div>
      ))}
    </section>
  );
}

export default WeatherDetails;
