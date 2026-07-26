"use client";

export default function RadioButton({
  id,
  name,
  label,
  value,
  checked,
  onChange,
  disabled = false,
}) {
  return (
    <label
      htmlFor={id}
      className={`flex items-center gap-3 cursor-pointer group ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        disabled={disabled}
        className="sr-only"
      />

      {/* Custom radio circle */}
      <span
        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-150 ${
          checked
            ? "border-primary"
            : "border-[rgba(31,42,55,0.10)] group-hover:border-[rgba(31,42,55,0.10)]"
        }`}
      >
        {checked && <span className="w-2 h-2 rounded-full bg-primary block" />}
      </span>

      {/* Label */}
      <span
        className={`text-sm font-medium transition-colors duration-150 ${
          checked ? "text-grayish" : "text-grayish/80 group-hover:text-grayish"
        }`}
      >
        {label}
      </span>
    </label>
  );
}
