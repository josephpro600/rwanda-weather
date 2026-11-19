
import { useEffect, useMemo, useState } from "react";

import {
  MapContainer,
  TileLayer,
  GeoJSON,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  MapPin,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import { provinces } from "../data/rwandaLocations";

// Direct Git LFS media download instead of GitHub's pointer file.
const GEOJSON_URL =
  "https://media.githubusercontent.com/media/wmgeolab/geoBoundaries/9469f09/releaseData/gbOpen/RWA/ADM2/geoBoundaries-RWA-ADM2.geojson";

const RWANDA_CENTER = [-1.9403, 29.8739];

const normalize = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/district/g, "")
    .replace(/[^a-z]/g, "")
    .trim();

function getDistrictName(properties = {}) {
  return (
    properties.shapeName ||
    properties.shapeName_en ||
    properties.NAME_2 ||
    properties.name_2 ||
    properties.NAME_1 ||
    properties.name ||
    properties.NAME ||
    ""
  );
}

function findDistrict(feature) {
  const featureName = normalize(
    getDistrictName(feature?.properties)
  );

  if (!featureName) return null;

  for (const [province, districts] of Object.entries(provinces)) {
    for (const district of districts) {
      if (normalize(district) === featureName) {
        return { province, district };
      }
    }
  }

  return null;
}

function MapController({ selectedFeature }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedFeature) return;

    const bounds = L.geoJSON(selectedFeature).getBounds();

    if (bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [30, 30],
        maxZoom: 10,
        animate: true,
      });
    }
  }, [selectedFeature, map]);

  return null;
}

export default function RwandaWeatherMap({
  province,
  district,
  onSelectDistrict,
}) {
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFeature, setSelectedFeature] = useState(null);

  const loadMap = async () => {
    try {
      setLoading(true);
      setError("");
      setGeoData(null);

      console.log("Downloading Rwanda boundaries:", GEOJSON_URL);

      const response = await fetch(GEOJSON_URL);

      if (!response.ok) {
        throw new Error(
          `Map download failed. HTTP ${response.status}`
        );
      }

      const text = await response.text();

      // Check whether GitHub returned an LFS pointer.
      if (
        text.startsWith(
          "version https://git-lfs.github.com/spec/v1"
        )
      ) {
        throw new Error(
          "GitHub still returned a Git LFS pointer. The actual map file could not be downloaded."
        );
      }

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        console.error("Invalid map response:", text.slice(0, 300));

        throw new Error(
          "The server did not return valid GeoJSON. Check the network response."
        );
      }

      if (
        data.type !== "FeatureCollection" ||
        !Array.isArray(data.features) ||
        data.features.length === 0
      ) {
        throw new Error(
          "The downloaded file is not a valid Rwanda GeoJSON FeatureCollection."
        );
      }

      console.log(
        "Rwanda map successfully loaded:",
        data.features.length,
        "features"
      );

      console.log(
        "First feature properties:",
        data.features[0].properties
      );

      setGeoData(data);
    } catch (err) {
      console.error("Rwanda map loading error:", err);
      setError(err.message || "Unable to load Rwanda map.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMap();
  }, []);

  const visibleFeatures = useMemo(() => {
    if (!geoData) return [];

    if (!province) return geoData.features;

    return geoData.features.filter((feature) => {
      const match = findDistrict(feature);

      return (
        match &&
        normalize(match.province) === normalize(province)
      );
    });
  }, [geoData, province]);

  const selectedDistrictFeature = useMemo(() => {
    if (!geoData || !district) return null;

    return (
      geoData.features.find((feature) => {
        const match = findDistrict(feature);

        return (
          match &&
          normalize(match.district) === normalize(district) &&
          (!province ||
            normalize(match.province) === normalize(province))
        );
      }) || null
    );
  }, [geoData, district, province]);

  useEffect(() => {
    setSelectedFeature(selectedDistrictFeature);
  }, [selectedDistrictFeature]);

  const getStyle = (feature) => {
    const match = findDistrict(feature);

    const isSelected =
      match &&
      district &&
      normalize(match.district) === normalize(district) &&
      (!province ||
        normalize(match.province) === normalize(province));

    return {
      color: isSelected ? "#1d4ed8" : "#2563eb",
      weight: isSelected ? 3 : 1.3,
      fillColor: isSelected ? "#2563eb" : "#93c5fd",
      fillOpacity: isSelected ? 0.8 : 0.4,
    };
  };

  const handleDistrictClick = (feature) => {
    const match = findDistrict(feature);

    if (!match) {
      console.warn(
        "District name was not matched:",
        feature.properties
      );
      return;
    }

    setSelectedFeature(feature);

    if (typeof onSelectDistrict === "function") {
      onSelectDistrict(match.province, match.district);
    }
  };

  const onEachFeature = (feature, layer) => {
    const match = findDistrict(feature);
    const name = getDistrictName(feature.properties);

    layer.bindTooltip(
      match
        ? `${match.district}, ${match.province}`
        : name || "District",
      { sticky: true }
    );

    layer.on("click", () => {
      handleDistrictClick(feature);
    });

    layer.on("mouseover", (event) => {
      event.target.setStyle({
        weight: 3,
        fillOpacity: 0.8,
      });

      event.target.bringToFront();
    });

    layer.on("mouseout", (event) => {
      event.target.setStyle(getStyle(feature));
    });
  };

  if (loading) {
    return (
      <div className="rwanda-map-status">
        <RefreshCw size={30} className="spin" />
        <h3>Loading Rwanda Map...</h3>
        <p>Downloading actual district boundaries.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rwanda-map-error">
        <AlertCircle size={35} />

        <h3>Unable to display Rwanda map</h3>

        <p>{error}</p>

        <button type="button" onClick={loadMap}>
          <RefreshCw size={18} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section className="rwanda-map-section">
      <div className="rwanda-map-heading">
        <div>
          <h2>
            <MapPin size={23} />
            Explore Rwanda
          </h2>

          <p>
            Click a district on the map to check its weather.
          </p>
        </div>

        <div className="rwanda-map-selected">
          <span>Selected location</span>

          <strong>
            {district
              ? `${district}, ${province || "Rwanda"}`
              : "Select a district"}
          </strong>
        </div>
      </div>

      <div className="rwanda-map-container">
        <MapContainer
          center={RWANDA_CENTER}
          zoom={8}
          minZoom={7}
          maxZoom={13}
          scrollWheelZoom={true}
          style={{
            width: "100%",
            height: "520px",
            borderRadius: "16px",
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <GeoJSON
            key={province || "all"}
            data={{
              type: "FeatureCollection",
              features: visibleFeatures,
            }}
            style={getStyle}
            onEachFeature={onEachFeature}
          />

          <MapController selectedFeature={selectedFeature} />
        </MapContainer>
      </div>

      <div className="rwanda-map-legend">
        <div>
          <span className="legend-color legend-selected" />
          Selected district
        </div>

        <div>
          <span className="legend-color legend-default" />
          Other districts
        </div>
      </div>

      <div className="rwanda-map-footer">
        <p>{visibleFeatures.length} map features displayed</p>
        <p>Boundaries: GeoBoundaries</p>
      </div>
    </section>
  );
}
