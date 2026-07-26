"use client";

import { ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const FilterSelect = ({
  placeholder,
  options = [],
  icon: Icon,
  value,
  onChange,
  width = "w-[160px]",
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = options.find((opt) => opt.value === value);

  const handleSelect = (option) => {
    onChange(option.value);
    setOpen(false);
  };

  useEffect(() => {
    const handler = (e) => {
      if (!ref.current?.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className={`relative inline-block ${width}`}>
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-between gap-2 px-3 h-[36px] border border-[#D1D5DB] rounded-lg bg-white text-[13px] font-medium text-grayish/80 ${width} ${open ? "border-primary shadow" : ""}`}
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4" />}
          {selected?.label || placeholder}
        </div>

        <ChevronRight
          className={`w-4 h-4 transition-transform ${open ? "rotate-90" : ""}`}
        />
      </button>

      {/* Dropdown */}
      <div
        className={`absolute left-0 mt-1 ${width} bg-white border border-grayish/20 rounded-lg shadow-lg p-2 z-50 origin-top transition-all duration-200 ease-out ${open ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-1 pointer-events-none"}`}
      >
        {options.map((option) => (
          <div
            key={option.value}
            onClick={() => handleSelect(option)}
            className={`px-3 py-2 text-[13px] font-medium rounded-md cursor-pointer ${
              value === option.value
                ? "bg-primary/10 text-grayish"
                : "text-grayish/80 hover:bg-gray-100 hover:text-primary"
            }`}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterSelect;
