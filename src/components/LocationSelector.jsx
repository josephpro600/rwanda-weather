
import { MapPin, MapPinned, ChevronDown } from "lucide-react";
import { provinces } from "../data/rwandaLocations";
import "./LocationSelector.css";

export default function LocationSelector({
  province,
  district,
  onProvinceChange,
  onDistrictChange
}) {
  const districts = province ? provinces[province] || [] : [];

  return (
    <div className="location-selector">
      <div className="location-field">
        <label htmlFor="province">
          <MapPin size={17} />
          Select Province
        </label>

        <div className="location-select-wrapper">
          <select
            id="province"
            value={province}
            onChange={(e) => onProvinceChange(e.target.value)}
          >
            <option value="">Choose your province</option>

            {Object.keys(provinces).map((provinceName) => (
              <option key={provinceName} value={provinceName}>
                {provinceName}
              </option>
            ))}
          </select>

          <ChevronDown className="select-chevron" size={18} />
        </div>
      </div>

      <div className="location-field">
        <label htmlFor="district">
          <MapPinned size={17} />
          Select District
        </label>

        <div className="location-select-wrapper">
          <select
            id="district"
            value={district}
            onChange={(e) => onDistrictChange(e.target.value)}
            disabled={!province}
          >
            <option value="">
              {province ? "Choose your district" : "Select province first"}
            </option>

            {districts.map((districtName) => (
              <option key={districtName} value={districtName}>
                {districtName}
              </option>
            ))}
          </select>

          <ChevronDown className="select-chevron" size={18} />
        </div>
      </div>

      {district && (
        <div className="selected-location">
          <MapPin size={17} />
          <span>
            Selected location: <strong>{district}, {province}</strong>
          </span>
        </div>
      )}
    </div>
  );
}
