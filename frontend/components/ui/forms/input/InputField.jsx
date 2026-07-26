"use client";
import { twMerge } from "tailwind-merge";

const Input = ({
  type = "text",
  id,
  name,
  placeholder,
  value,
  onChange,
  className = "",
  disabled = false,
  readOnly = false,
  error = false,
  success = false,
  hint,
  required = false,
  showToggle = false,
  isPasswordVisible,
  togglePassword,
  rightAdornment,
}) => {
  let baseClasses =
    "h-[52px] w-full rounded-[14px] border-2 border-transparent bg-[rgba(7,33,38,0.04)] px-4 text-sm font-medium outline-none transition-all duration-200 hover:border-[#8D999B] hover:bg-transparent placeholder:text-[#8D999B] placeholder:font-normal";

  let stateClasses = "";

  if (disabled) {
    stateClasses =
      "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed";
  } else if (readOnly) {
    stateClasses =
      "border-[#8D999B]/20 bg-[rgba(7,33,38,0.03)] text-[#596A6E] cursor-default";
  } else if (error) {
    stateClasses = "border-error focus:ring-2 focus:ring-0";
  } else if (success) {
    stateClasses = "border-success focus:ring-2 focus:ring-0";
  } else {
    stateClasses =
      "focus:border-[#8D999B] focus:bg-transparent focus:ring-2 focus:ring-0";
  }

  const inputClasses = twMerge(
    baseClasses,
    stateClasses,
    rightAdornment ? "rtl:pl-22 ltr:pr-22" : "",
    className,
  );

  return (
    <div className="w-full">
      <div className="relative">
        <input
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          className={inputClasses}
        />
        {rightAdornment && (
          <div className="absolute inset-y-0 right-3 flex items-center">
            {rightAdornment}
          </div>
        )}
      </div>

      {hint && (
        <p
          className={twMerge(
            "mt-1.5 text-xs",
            error ? "text-error" : success ? "text-success" : "text-gray-500",
          )}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default Input;
