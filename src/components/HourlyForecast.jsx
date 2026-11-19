
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

function HourlyForecast({ weather }) {
  const hourly = weather.hourly;

  const currentTime = new Date(weather.current.time).getTime();

  const next24Hours = hourly.time
    .map((time, index) => ({
      time,
      temperature: hourly.temperature_2m[index],
      rain: hourly.precipitation_probability[index]
    }))
    .filter(
      (item) => new Date(item.time).getTime() >= currentTime
    )
    .slice(0, 24);

  const chartData = next24Hours.map((item) => ({
    ...item,
    hour: new Date(item.time).toLocaleTimeString("en", {
      hour: "numeric",
      hour12: true
    })
  }));

  return (
    <section className="dashboard-card">
      <h2>Next 24 Hours</h2>
      <p className="section-description">
        Hourly temperature forecast
      </p>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="hour"
              tick={{ fontSize: 11 }}
              interval={3}
            />

            <YAxis
              unit="°C"
              tick={{ fontSize: 11 }}
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="temperature"
              name="Temperature"
              stroke="#0284c7"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h3 className="hourly-heading">Hourly rain probability</h3>

      <div className="hourly-list">
        {chartData.filter((_, index) => index % 3 === 0).map(
          (item) => (
            <div className="hourly-item" key={item.time}>
              <span>{item.hour}</span>
              <strong>{Math.round(item.temperature)}°</strong>
              <small>{item.rain ?? 0}% rain</small>
            </div>
          )
        )}
      </div>
    </section>
  );
}

export default HourlyForecast;
