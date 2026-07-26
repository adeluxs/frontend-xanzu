const Select = ({
  id,
  options = [],
  placeholder = "Select an option",
  value = "",
  onChange,
  className = "",
  disabled = false,
  size = "lg",
  key = "",
  ref, // Added ref for React 19
}) => {
  const baseClasses =
    "w-full rounded-lg border bg-transparent px-4 text-sm font-medium appearance-none transition-colors duration-200 ease-in-out shadow-[2px_2px_10px_rgba(0,0,0,0.06)]";

  const stateClasses = disabled
    ? "cursor-not-allowed border-[#C5C5C5] opacity-50"
    : "border-[#C5C5C5] focus:border-[#004037] focus:ring-2 focus:ring-heading/15 focus:outline-none";

  const textColor = value ? "text-grayish" : "text-grayish";

  // Size mapping
  const sizeClasses = {
    xs: "h-9 text-xs",
    sm: "h-10 text-sm",
    md: "h-11 text-sm",
    lg: "h-13 text-base",
  };

  return (
    <select
      ref={ref}
      id={id}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange?.(e.target.value)}
      className={`${baseClasses} ${stateClasses} ${sizeClasses[size]} ${textColor} ${className}`}
      aria-disabled={disabled}
    >
      {/* Placeholder - only show if no value selected and not in options */}
      {!value && !options.some((opt) => opt.value === "") && (
        <option value="" disabled className="text-grayish/50">
          {placeholder}
        </option>
      )}

      {/* Options */}
      {options.map(({ value: optValue, label, disabled, key }) => (
        <option
          key={optValue}
          value={optValue}
          disabled={disabled}
          className={disabled ? "text-grayish/40 h-13" : "text-grayish"}
        >
          {label}
        </option>
      ))}
    </select>
  );
};

export default Select;
