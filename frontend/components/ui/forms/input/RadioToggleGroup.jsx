"use client";

const RadioToggleGroup = ({
  name,
  options,
  value,
  onChange,
  className = "",
}) => {
  return (
    <div className={`flex flex-wrap items-center gap-6 pt-1 ${className}`}>
      {options.map((option) => {
        const isActive = value === option.value;

        return (
          <label
            key={option.value}
            className="inline-flex cursor-pointer items-center gap-2.5 text-sm font-medium text-grayish/60"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={isActive}
              onChange={() => onChange(option.value)}
              className="h-5 w-5 accent-secondary"
              disabled={option.disabled}
            />
            <span>{option.label}</span>
          </label>
        );
      })}
    </div>
  );
};

export default RadioToggleGroup;
