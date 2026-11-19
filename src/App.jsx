
import { useEffect, useState } from "react";
import {
  RefreshCw,
  MapPin,
  CloudSun,
  Sprout,
  Menu,
  X,
  CalendarDays,
  ShieldCheck,
  LayoutDashboard,
  Cloud,
  Map,
  Info,
  ArrowRight,
  Droplets,
  Wind,
  Thermometer,
  Compass
} from "lucide-react";

import LocationSelector from "./components/LocationSelector";
import RwandaWeatherMap from "./components/RwandaWeatherMap";
import CurrentWeather from "./components/CurrentWeather";
import WeatherDetails from "./components/WeatherDetails";
import Forecast from "./components/Forecast";
import RainAlert from "./components/RainAlert";
import HourlyForecast from "./components/HourlyForecast";
import SmartAdvice from "./components/SmartAdvice";

import {
  getDistrictCoordinates,
  getWeather
} from "./services/weatherApi";

import "./App.css";

const navigation = [
  { id: "home", label: "Overview", icon: LayoutDashboard },
  { id: "weather", label: "Weather", icon: Cloud },
  { id: "map", label: "Rwanda Map", icon: Map },
  { id: "farming", label: "Smart Farming", icon: Sprout },
  { id: "about", label: "About", icon: Info }
];

export default function App() {
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [activePage, setActivePage] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  async function loadWeather(selectedDistrict) {
    if (!selectedDistrict) return;

    try {
      setLoading(true);
      setError("");

      const coordinates = await getDistrictCoordinates(selectedDistrict);

      const weatherData = await getWeather(
        coordinates.latitude,
        coordinates.longitude
      );

      setWeather(weatherData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || "Unable to load weather information.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (district) {
      loadWeather(district);
    } else {
      setWeather(null);
    }
  }, [district]);

  function handleProvinceChange(value) {
    setProvince(value);
    setDistrict("");
    setWeather(null);
    setError("");
  }

  function handleDistrictChange(value) {
    setDistrict(value);
  }

  function handleMapSelection(selectedProvince, selectedDistrict) {
    setProvince(selectedProvince);
    setDistrict(selectedDistrict);
    setActivePage("weather");
    setMenuOpen(false);
  }

  function handleRefresh() {
    if (district) loadWeather(district);
  }

  function navigateTo(page) {
    setActivePage(page);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const current = weather?.current;

 
const quickStats = [
  {
    label: "Temperature",
    value: current?.temperature_2m != null
      ? `${Math.round(current.temperature_2m)}°C`
      : "--",
    icon: Thermometer
  },
  {
    label: "Feels Like",
    value: current?.apparent_temperature != null
      ? `${Math.round(current.apparent_temperature)}°C`
      : "--",
    icon: CloudSun
  },
  {
    label: "Humidity",
    value: current?.relative_humidity_2m != null
      ? `${current.relative_humidity_2m}%`
      : "--",
    icon: Droplets
  },
  {
    label: "Wind Speed",
    value: current?.wind_speed_10m != null
      ? `${current.wind_speed_10m} km/h`
      : "--",
    icon: Wind
  },
  {
    label: "Rainfall",
    value: current?.precipitation != null
      ? `${current.precipitation} mm`
      : "--",
    icon: CloudSun
  },
  {
    label: "Cloud Cover",
    value: current?.cloud_cover != null
      ? `${current.cloud_cover}%`
      : "--",
    icon: Cloud
  },
  {
    label: "Pressure",
    value: current?.pressure_msl != null
      ? `${Math.round(current.pressure_msl)} hPa`
      : "--",
    icon: Compass
  },
  {
    label: "UV Index",
    value: current?.uv_index != null
      ? current.uv_index
      : "--",
    icon: ShieldCheck
  }
];


  function renderLocationSelector() {
    return (
      <LocationSelector
        province={province}
        district={district}
        onProvinceChange={handleProvinceChange}
        onDistrictChange={handleDistrictChange}
      />
    );
  }

  function renderLoadingAndError() {
    return (
      <>
        {loading && (
          <div className="loading">
            <RefreshCw className="spin" size={24} />
            <p>Loading weather information...</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </>
    );
  }

  function renderEmptyState(message) {
    return (
      <div className="empty-state">
        <CloudSun size={42} />
        <h3>Select a district to continue</h3>
        <p>{message}</p>
        <button
          className="primary-button"
          onClick={() => navigateTo("home")}
        >
          Choose a District
          <ArrowRight size={17} />
        </button>
      </div>
    );
  }

  return (
    <div className="app">
      {/* TOP NAVIGATION */}
      <header className="site-header">
        <div className="nav-container">
          <button
            className="site-brand"
            onClick={() => navigateTo("home")}
          >
            <div className="brand-logo">
              <CloudSun size={27} />
            </div>
            <div className="brand-name">
              <strong>Rwanda Weather</strong>
              <span>PRO</span>
            </div>
          </button>

          <button
            className="mobile-menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>

          <nav className={`main-nav ${menuOpen ? "open" : ""}`}>
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  className={activePage === item.id ? "nav-link active" : "nav-link"}
                  onClick={() => navigateTo(item.id)}
                >
                  <Icon size={17} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="main-content">
        {/* OVERVIEW PAGE */}
        {activePage === "home" && (
          <section className="page-section overview-page">
            <div className="welcome-banner">
              <div className="welcome-content">
                <span className="section-eyebrow">
                  <span className="live-dot"></span>
                  RWANDA WEATHER INFORMATION
                </span>

                <h1>
                  Welcome to <span>Rwanda Weather Pro</span>
                </h1>

                <p>
                  Understand the weather, plan your day and make
                  smarter farming decisions.
                </p>

                <div className="welcome-trust">
                  <span><ShieldCheck size={16} /> Weather data from Open-Meteo</span>
                  <span><MapPin size={16} /> Rwanda district coverage</span>
                </div>
              </div>

              <div className="welcome-icon">
                <CloudSun size={100} strokeWidth={1.2} />
              </div>
            </div>

            <div className="overview-grid">
              <section className="panel location-panel">
                <div className="panel-heading">
                  <div>
                    <span className="section-eyebrow">GET STARTED</span>
                    <h2>Choose your location</h2>
                    <p>Select a province and district.</p>
                  </div>
                  <MapPin size={25} />
                </div>

                {renderLocationSelector()}
              </section>

              <section className="panel current-summary-panel">
                <div className="panel-heading">
                  <div>
                    <span className="section-eyebrow">CURRENT LOCATION</span>
                    <h2>{district || "No district selected"}</h2>
                    <p>{province || "Select a location to see its weather"}</p>
                  </div>
                  <CloudSun size={27} />
                </div>

                {loading ? (
                  <div className="compact-loading">
                    <RefreshCw className="spin" size={22} />
                    Loading weather...
                  </div>
                ) : weather ? (
                  <>
                    <div className="summary-temperature">
                      {Math.round(current?.temperature_2m ?? 0)}°
                      <span>C</span>
                    </div>
                    <p className="summary-condition">
                      Current weather conditions
                    </p>
                    <button
                      className="text-link"
                      onClick={() => navigateTo("weather")}
                    >
                      View full weather <ArrowRight size={16} />
                    </button>
                  </>
                ) : (
                  <div className="summary-empty">
                    <CloudSun size={35} />
                    <p>Your weather summary will appear here.</p>
                  </div>
                )}
              </section>
            </div>

            {renderLoadingAndError()}

            {weather && (
              <section className="panel stats-panel">
                <div className="panel-heading">
                  <div>
                    <span className="section-eyebrow">LIVE CONDITIONS</span>
                    <h2>Weather at a glance</h2>
                  </div>

                  <button
                    className="refresh-button"
                    onClick={handleRefresh}
                    disabled={loading}
                  >
                    <RefreshCw size={16} />
                    Refresh
                  </button>
                </div>

                <div className="horizontal-stats">
                  {quickStats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                      <article className="stat-card" key={stat.label}>
                        <div className="stat-icon">
                          <Icon size={22} />
                        </div>
                        <div>
                          <span>{stat.label}</span>
                          <strong>{stat.value}</strong>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {lastUpdated && (
                  <p className="last-updated">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </p>
                )}
              </section>
            )}

            <section className="quick-access-section">
              <div className="section-title-row">
                <div>
                  <span className="section-eyebrow">EXPLORE FEATURES</span>
                  <h2>What would you like to explore?</h2>
                </div>
              </div>

              <div className="feature-grid">
                <button className="feature-card" onClick={() => navigateTo("weather")}>
                  <div className="feature-icon blue"><CloudSun size={25} /></div>
                  <h3>Weather Forecast</h3>
                  <p>Current conditions, hourly updates and 7-day forecasts.</p>
                  <span>Explore weather <ArrowRight size={16} /></span>
                </button>

                <button className="feature-card" onClick={() => navigateTo("map")}>
                  <div className="feature-icon cyan"><Map size={25} /></div>
                  <h3>Rwanda Map</h3>
                  <p>Explore districts and select a location on the map.</p>
                  <span>Explore map <ArrowRight size={16} /></span>
                </button>

                <button className="feature-card" onClick={() => navigateTo("farming")}>
                  <div className="feature-icon purple"><Sprout size={25} /></div>
                  <h3>Smart Farming</h3>
                  <p>Get practical weather-based farming recommendations.</p>
                  <span>Get advice <ArrowRight size={16} /></span>
                </button>
              </div>
            </section>
          </section>
        )}

        
{/* WEATHER PAGE */}
{activePage === "weather" && (
  <section className="page-section weather-dashboard-page">

    <div className="page-heading">
      <div>
        <span className="section-eyebrow">WEATHER DASHBOARD</span>
        <h1>Weather Overview</h1>
        <p>All your selected district's weather information in one dashboard.</p>
      </div>

      {weather && (
        <button
          className="refresh-button"
          onClick={handleRefresh}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      )}
    </div>

    <div className="panel page-location-panel">
      <div className="panel-heading">
        <div>
          <h2>Choose your location</h2>
          <p>Select a province and district.</p>
        </div>
        <MapPin size={24} />
      </div>

      {renderLocationSelector()}
    </div>

    {renderLoadingAndError()}

    {weather && !loading && (
      <>
        {/* CURRENT WEATHER + SUN TIMES */}
        <div className="weather-top-grid">

          <div className="current-weather-box">
            <div className="current-weather-info">
              <span>YOUR CURRENT WEATHER</span>
              <h2>{district}, Rwanda</h2>
              <p>{province}</p>

              <div className="dashboard-temperature">
                {Math.round(current?.temperature_2m ?? 0)}°C
              </div>

              <p className="dashboard-condition">
                Feels like {Math.round(current?.apparent_temperature ?? 0)}°C
              </p>
            </div>

            <CloudSun className="dashboard-weather-icon" size={85} />
          </div>

          <div className="sun-dashboard panel">
            <span className="section-eyebrow">DAYLIGHT</span>
            <h2>Sunrise & Sunset</h2>

            <div className="sun-dashboard-items">
              <div>
                <span>Sunrise</span>
                <strong>
                  {weather.daily?.sunrise?.[0]?.split("T")[1] || "--"}
                </strong>
              </div>

              <div>
                <span>Sunset</span>
                <strong>
                  {weather.daily?.sunset?.[0]?.split("T")[1] || "--"}
                </strong>
              </div>
            </div>
          </div>

        </div>

        {/* WEATHER STATISTICS */}
        <div className="dashboard-section">
          <div className="dashboard-section-heading">
            <div>
              <span className="section-eyebrow">LIVE MEASUREMENTS</span>
              <h2>Weather Conditions</h2>
            </div>
            <span className="horizontal-hint">Scroll horizontally →</span>
          </div>

          <div className="dashboard-horizontal">
            {quickStats.map((stat) => {
              const Icon = stat.icon;

              return (
                <article className="dashboard-stat-card" key={stat.label}>
                  <div className="dashboard-stat-icon">
                    <Icon size={23} />
                  </div>
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                </article>
              );
            })}
          </div>
        </div>

        {/* ALERT + ADDITIONAL WEATHER DETAILS */}
        <div className="weather-information-grid">
          <div className="panel dashboard-alert-panel">
            <span className="section-eyebrow">WEATHER ALERTS</span>
            <h2>Weather Notifications</h2>
            <RainAlert weather={weather} />
          </div>

          <div className="panel dashboard-details-panel">
            <span className="section-eyebrow">MORE INFORMATION</span>
            <h2>Weather Details</h2>
            <WeatherDetails weather={weather} />
          </div>
        </div>

        {/* HOURLY FORECAST */}
        <div className="panel dashboard-forecast-panel">
          <div className="dashboard-section-heading">
            <div>
              <span className="section-eyebrow">NEXT 24 HOURS</span>
              <h2>Hourly Forecast</h2>
            </div>
            <CalendarDays size={23} />
          </div>

          <div className="forecast-horizontal-content">
            <HourlyForecast weather={weather} />
          </div>
        </div>

        {/* SEVEN DAY FORECAST */}
        <div className="panel dashboard-forecast-panel">
          <div className="dashboard-section-heading">
            <div>
              <span className="section-eyebrow">UPCOMING DAYS</span>
              <h2>7-Day Weather Forecast</h2>
            </div>
            <CalendarDays size={23} />
          </div>

          <div className="forecast-horizontal-content">
            <Forecast weather={weather} />
          </div>
        </div>

        {lastUpdated && (
          <p className="last-updated">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </>
    )}

    {!weather && !loading && !error && (
      <div className="empty-state">
        <CloudSun size={45} />
        <h3>Your weather dashboard is ready</h3>
        <p>Select a province and district above to see the weather dashboard.</p>
      </div>
    )}

  </section>
)}


        {/* MAP PAGE */}
        {activePage === "map" && (
          <section className="page-section">
            <div className="page-heading">
              <div>
                <span className="section-eyebrow">EXPLORE RWANDA</span>
                <h1>Rwanda Weather Map</h1>
                <p>Select a district on the map to view its weather forecast.</p>
              </div>
              <div className="heading-icon"><MapPin size={28} /></div>
            </div>

            <div className="panel map-panel">
              <RwandaWeatherMap
                province={province}
                district={district}
                onSelectDistrict={handleMapSelection}
              />
            </div>
          </section>
        )}

        {/* SMART FARMING PAGE */}
        {activePage === "farming" && (
          <section className="page-section">
            <div className="page-heading">
              <div>
                <span className="section-eyebrow">WEATHER-BASED GUIDANCE</span>
                <h1>Smart Farming Assistant</h1>
                <p>Use weather information to help plan your farming activities.</p>
              </div>
              <div className="heading-icon farming-heading-icon">
                <Sprout size={30} />
              </div>
            </div>

            {!weather && (
              <div className="panel farming-location-panel">
                <h2>Choose your farming location</h2>
                <p>Select a district to receive weather-based recommendations.</p>
                {renderLocationSelector()}
                {renderLoadingAndError()}
              </div>
            )}

            {weather && (
              <>
                <div className="selected-location-heading">
                  <div>
                    <span className="section-eyebrow">YOUR FARM LOCATION</span>
                    <h2>{district}, Rwanda</h2>
                    <p>{province}</p>
                  </div>
                  <button
                    className="text-link"
                    onClick={() => navigateTo("weather")}
                  >
                    View weather <ArrowRight size={16} />
                  </button>
                </div>

                <div className="panel advice-panel">
                  <SmartAdvice
                    weather={weather}
                    district={district || "your selected district"}
                  />
                </div>
              </>
            )}

            <div className="farming-note">
              <ShieldCheck size={20} />
              <p>
                Recommendations are general guidance based on available weather
                data. Consider your crop, soil moisture, crop stage and local
                agricultural advice before making farming decisions.
              </p>
            </div>
          </section>
        )}

        {/* ABOUT PAGE */}
        {activePage === "about" && (
          <section className="page-section">
            <div className="page-heading">
              <div>
                <span className="section-eyebrow">ABOUT THE PLATFORM</span>
                <h1>About Rwanda Weather Pro</h1>
                <p>Weather information to support better everyday decisions.</p>
              </div>
              <div className="heading-icon"><Info size={28} /></div>
            </div>

            <div className="about-intro panel">
              <CloudSun size={55} />
              <h2>Understand the Weather. Plan a Better Day.</h2>
              <p>
                Rwanda Weather Pro brings weather forecasts, district
                exploration and practical weather-based guidance together
                in one platform.
              </p>
            </div>

            <div className="feature-grid about-feature-grid">
              <article className="feature-card about-feature">
                <div className="feature-icon blue"><CloudSun size={25} /></div>
                <h3>Weather updates</h3>
                <p>Check current weather conditions, hourly information and forecasts.</p>
              </article>

              <article className="feature-card about-feature">
                <div className="feature-icon purple"><Sprout size={25} /></div>
                <h3>Farming support</h3>
                <p>Use weather-based guidance to help plan farming activities.</p>
              </article>

              <article className="feature-card about-feature">
                <div className="feature-icon cyan"><Map size={25} /></div>
                <h3>Local information</h3>
                <p>Explore weather information for districts across Rwanda.</p>
              </article>
            </div>

            <div className="data-source-panel panel">
              <h2>Weather data provider</h2>
              <p>
                Weather information is provided through the Open-Meteo API.
                Forecasts are estimates and may change as new data becomes available.
              </p>
            </div>
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="brand-logo">
              <CloudSun size={25} />
            </div>
            <div className="brand-name">
              <strong>Rwanda Weather</strong>
              <span>PRO</span>
            </div>
          </div>

          <p>Helping Rwanda plan better with weather information.</p>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Rwanda Weather Pro.</span>
          <span>Weather data: Open-Meteo</span>
        </div>
      </footer>
    </div>
  );
}
