import React from "react";

interface FilterRangeSliderProps {
  minValue: number;
  maxValue: number;
  min: number;
  max: number;
  onChange: any;
  minName: string;
  maxName: string;
  label: string;
  icon?: string;
}

const FilterRangeSlider: React.FC<FilterRangeSliderProps> = ({
  minValue,
  maxValue,
  min,
  max,
  minName,
  maxName,
  onChange,
  label,
  icon = "",
}) => {
  let percentLeft = (minValue / max) * 100;
  let percentRight = 100 - (maxValue / max) * 100;

  return (
    <div className="filter-range-slider">
      <div className="header">
        <div className="title">{label}</div>
        <div className="value-container">
          <div className="value">{minValue}</div>-
          <div className="value">
            {maxValue}
            <img src={icon} alt="" />
          </div>
        </div>
      </div>
      <div className="slider">
        <div
          className="progress"
          style={{ left: percentLeft + "%", right: percentRight + "%" }}
        ></div>
      </div>
      <div className="range-input">
        <input
          name={minName}
          type="range"
          className="range-min"
          min={min}
          max={max}
          value={minValue}
          onChange={onChange}
        />
        <input
          name={maxName}
          type="range"
          className="range-max"
          min={min}
          max={max}
          value={maxValue}
          onChange={onChange}
        />
      </div>
      <div className="range-label">
        <div className="min-label">
          <div className="value">
            {min}
            <img src={icon} alt="" />
          </div>
        </div>
        <div className="value">
          {max}
          <img src={icon} alt="" />
        </div>
      </div>
    </div>
  );
};

export default FilterRangeSlider;
