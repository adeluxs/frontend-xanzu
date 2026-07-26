"use client";

import Flatpickr from "react-flatpickr";
import { useRef } from "react";

const FilterDatePicker = ({
  value,
  onChange,
  placeholder = "Select date",
  icon: Icon,
  width = "w-[160px]",
  options = {},
  className = "",
}) => {
  const pickerRef = useRef(null);

  const handleToggle = () => {
    const fp = pickerRef.current?.flatpickr;
    if (!fp) return;
    if (fp.isOpen) {
      fp.close();
    } else {
      fp.open();
    }
  };

  return (
    <div className={`relative inline-block ${width}`}>
      {Icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-grayish">
          <Icon className="h-4 w-4" />
        </span>
      )}
      <Flatpickr
        ref={pickerRef}
        value={value}
        onChange={onChange}
        options={{
          position: "auto right",
          clickOpens: false,
          ...options,
        }}
        placeholder={placeholder}
        onClick={handleToggle}
        className={`w-full h-[36px] px-3 ${
          Icon ? "pl-9" : ""
        } border border-[#D1D5DB] rounded-lg bg-white text-[13px] font-medium text-grayish/80 placeholder:text-grayish/80 focus:outline-none focus:border-primary focus:shadow ${className}`}
      />
    </div>
  );
};

export default FilterDatePicker;
