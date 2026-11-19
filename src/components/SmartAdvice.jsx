
import {
  Sprout,
  Droplets,
  Tractor,
  Sun,
  ShieldAlert,
  Shirt,
  Umbrella,
  HeartPulse,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

function getFarmingAdvice(weather) {
  const current = weather.current;
  const daily = weather.daily;

  const rainProbability =
    daily.precipitation_probability_max?.[0] ?? 0;

  const rainfall = daily.precipitation_sum?.[0] ?? 0;
  const temperature = current.temperature_2m;
  const wind = current.wind_speed_10m;
  const humidity = current.relative_humidity_2m;
  const uv = current.uv_index ?? 0;

  const advice = [];

  // Planting advice
  if (rainProbability >= 60 || rainfall >= 5) {
    advice.push({
      title: "Planting conditions",
      status: "Favorable with caution",
      description:
        "Rain is expected or has been recorded. It may be a suitable time to plant crops if the soil is moist but not waterlogged. Check soil conditions before planting.",
      icon: Sprout,
      type: "good"
    });
  } else if (temperature > 30 && rainProbability < 30) {
    advice.push({
      title: "Planting conditions",
      status: "Use caution",
      description:
        "Hot and relatively dry conditions are expected. Avoid planting seeds in very dry soil unless irrigation is available.",
      icon: Sun,
      type: "warning"
    });
  } else {
    advice.push({
      title: "Planting conditions",
      status: "Check soil moisture",
      description:
        "Weather conditions may allow field preparation and planting. Check the moisture in your soil before sowing seeds.",
      icon: Sprout,
      type: "good"
    });
  }

  // Irrigation advice
  if (rainProbability >= 60 || rainfall >= 5) {
    advice.push({
      title: "Irrigation",
      status: "Reduce irrigation",
      description:
        "Rain is likely or rainfall is forecast. Check soil moisture before watering to avoid wasting water and waterlogging crops.",
      icon: Droplets,
      type: "good"
    });
  } else {
    advice.push({
      title: "Irrigation",
      status: "Check crops for water needs",
      description:
        "There is limited expected rainfall. Monitor soil moisture and irrigate when crops need water, preferably early in the morning or late in the afternoon.",
      icon: Droplets,
      type: "warning"
    });
  }

  // Spraying advice
  if (rainProbability >= 50 || wind >= 20) {
    advice.push({
      title: "Crop spraying",
      status: "Consider postponing",
      description:
        "Rain or strong wind may reduce the effectiveness of spraying. Follow the pesticide label and only spray when weather and safety conditions are suitable.",
      icon: ShieldAlert,
      type: "warning"
    });
  } else {
    advice.push({
      title: "Crop spraying",
      status: "Check product instructions",
      description:
        "Rain and wind risks appear lower. Before spraying, check the product label, wind conditions, temperature and required protective equipment.",
      icon: ShieldAlert,
      type: "good"
    });
  }

  // Harvesting advice
  if (rainProbability >= 60 || rainfall >= 5) {
    advice.push({
      title: "Harvesting",
      status: "Protect harvested crops",
      description:
        "Rain may affect harvesting and drying. If crops are ready, plan for covered storage and avoid leaving harvested produce exposed to rain.",
      icon: Tractor,
      type: "warning"
    });
  } else {
    advice.push({
      title: "Harvesting",
      status: "Potentially suitable",
      description:
        "The forecast suggests a lower chance of rain. It may be a useful period for harvesting and drying crops, provided the crop is ready.",
      icon: Tractor,
      type: "good"
    });
  }

  // Heat and crop protection
  if (temperature >= 30 || uv >= 8) {
    advice.push({
      title: "Crop and soil protection",
      status: "Protect from heat",
      description:
        "High temperature or UV conditions may increase heat stress. Consider appropriate mulching, monitoring young plants and watering according to soil moisture.",
      icon: Sun,
      type: "warning"
    });
  }

  return advice;
}

function getDailyAdvice(weather) {
  const current = weather.current;

  const temperature = current.temperature_2m;
  const rain = current.precipitation ?? 0;
  const humidity = current.relative_humidity_2m;
  const wind = current.wind_speed_10m;
  const uv = current.uv_index ?? 0;

  const advice = [];

  if (rain > 0) {
    advice.push({
      title: "Carry an umbrella",
      description:
        "Rain is currently being recorded. Carry an umbrella or raincoat when going outside.",
      icon: Umbrella
    });
  } else {
    advice.push({
      title: "Outdoor activities",
      description:
        "No current precipitation is being recorded. Check the hourly forecast before planning a long outdoor activity.",
      icon: Sun
    });
  }

  if (temperature >= 28 || uv >= 8) {
    advice.push({
      title: "Protect yourself from the sun",
      description:
        "Wear a hat, use sunscreen and avoid unnecessary exposure to strong midday sunlight.",
      icon: HeartPulse
    });
  } else if (temperature <= 16) {
    advice.push({
      title: "Wear warm clothing",
      description:
        "The temperature is relatively cool. Consider wearing a sweater or jacket when going outside.",
      icon: Shirt
    });
  } else {
    advice.push({
      title: "Clothing advice",
      description:
        "Light and comfortable clothing should be suitable for the current temperature.",
      icon: Shirt
    });
  }

  if (humidity >= 80) {
    advice.push({
      title: "Humidity",
      description:
        "Humidity is high. Allow wet clothes and equipment to dry properly and pay attention to ventilation.",
      icon: Droplets
    });
  }

  if (wind >= 30) {
    advice.push({
      title: "Wind conditions",
      description:
        "Wind is strong. Take care around trees, temporary structures and exposed outdoor equipment.",
      icon: AlertTriangle
    });
  }

  advice.push({
    title: "Stay hydrated",
    description:
      "Drink water regularly, especially when working outdoors or doing physical activities.",
    icon: HeartPulse
  });

  return advice;
}

export default function SmartAdvice({ weather, district }) {
  if (!weather?.current || !weather?.daily) return null;

  const farmingAdvice = getFarmingAdvice(weather);
  const dailyAdvice = getDailyAdvice(weather);

  return (
    <section className="smart-advice-section">
      <div className="advice-heading">
        <div>
          <span className="section-eyebrow">WEATHER INTELLIGENCE</span>
          <h2>Smart Daily Advice</h2>
          <p>
            Recommendations based on today's weather in {district}.
          </p>
        </div>

        <div className="advice-live-label">
          <span className="live-dot"></span>
          Weather based
        </div>
      </div>

      <div className="advice-group">
        <div className="advice-group-heading">
          <div className="advice-heading-icon farming-icon">
            <Sprout size={23} />
          </div>

          <div>
            <h3>Smart Farming Assistant</h3>
            <p>Practical weather guidance for farmers</p>
          </div>
        </div>

        <div className="advice-grid">
          {farmingAdvice.map((item, index) => {
            const Icon = item.icon;

            return (
              <article
                className={`advice-card ${item.type}`}
                key={index}
              >
                <div className="advice-card-top">
                  <div className="advice-card-icon">
                    <Icon size={21} />
                  </div>

                  {item.type === "warning" ? (
                    <AlertTriangle size={17} />
                  ) : (
                    <CheckCircle size={17} />
                  )}
                </div>

                <h4>{item.title}</h4>
                <span className="advice-status">
                  {item.status}
                </span>

                <p>{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>

      <div className="advice-group lifestyle-group">
        <div className="advice-group-heading">
          <div className="advice-heading-icon lifestyle-icon">
            <HeartPulse size={23} />
          </div>

          <div>
            <h3>Daily Life Assistant</h3>
            <p>Make better decisions throughout your day</p>
          </div>
        </div>

        <div className="daily-advice-list">
          {dailyAdvice.map((item, index) => {
            const Icon = item.icon;

            return (
              <article className="daily-advice-item" key={index}>
                <div className="daily-advice-icon">
                  <Icon size={21} />
                </div>

                <div>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="advice-disclaimer">
        <AlertTriangle size={17} />

        <p>
          Advice is generated from weather data, not a professional
          agricultural diagnosis. Actual farming decisions should
          also consider soil moisture, crop type, crop growth stage,
          local conditions and agricultural expert guidance.
        </p>
      </div>
    </section>
  );
}
