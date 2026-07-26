"use client";
import { useState } from "react";

export default function DividerInput({
  prefix = "",
  placeholder = "",
  type = "text",
  value,
  onChange,
  className = "",
  position = "left", // "left" or "right"
  disabled = false, // ✅ added
}) {
  const [internalValue, setInternalValue] = useState("");

  // Determine if this is a controlled or uncontrolled component
  const isControlled = value !== undefined;
  const inputValue = isControlled ? value : internalValue;

  const handleChange = (e) => {
    if (disabled) return; // ✅ prevent change when disabled

    const newValue = e.target.value;

    if (!isControlled) {
      setInternalValue(newValue);
    }

    if (onChange) {
      onChange(e);
    }
  };

  const isLeft = position === "left";

  return (
    <div className="relative flex items-center">
      {/* Prefix/Divider positioned left */}
      {isLeft && (
        <div
          className={`absolute left-4 text-sm font-semibold border-r-2 pr-3
            ${
              disabled
                ? "text-grayish/40 border-heading/20"
                : "text-grayish/80 border-heading/40"
            }`}
        >
          {prefix}
        </div>
      )}

      <input
        type={type}
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`h-13 w-full rounded-lg border border-[#C5C5C5]
          shadow-[2px_2px_10px_rgba(0,0,0,0.06)] bg-transparent py-3 text-sm
          text-grayish placeholder:text-grayish font-medium transition-colors
          focus:border-heading focus:ring-2 focus:ring-heading/15 focus:outline-none
          focus:shadow-none
          ${isLeft ? "pr-4" : "pl-4"}
          ${disabled ? "opacity-50 cursor-not-allowed focus:ring-0" : ""}
          ${className}`}
      />

      {/* Prefix/Divider positioned right */}
      {!isLeft && (
        <div
          className={`absolute right-4 text-sm font-semibold border-l-2 pl-3
            ${
              disabled
                ? "text-grayish/40 border-heading/20"
                : "text-grayish/60 border-heading/40"
            }`}
        >
          {prefix}
        </div>
      )}
    </div>
  );
}
