"use client";
import { twMerge } from "tailwind-merge";

const TextArea = ({
  id,
  name,
  placeholder = "",
  rows = 4,
  value,
  onChange,
  className = "",
  disabled = false,
  readOnly = false,
  error = false,
  success = false,
  hint = "",
  required = false,
  ref,
}) => {
  // Base styles matching your Input.js
  let baseClasses =
    "w-full rounded-[14px] border-2 border-transparent bg-[rgba(7,33,38,0.04)] px-4 py-3 text-sm font-medium outline-none transition-all duration-200 bg-[rgba(7,33,38,0.04)] hover:border-[#8D999B] hover:bg-transparent placeholder:text-[#8D999B] placeholder:font-normal resize-none";

  let stateClasses = "";

  if (disabled) {
    stateClasses =
      "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed opacity-100";
  } else if (readOnly) {
    stateClasses =
      "border-[#8D999B] bg-[rgba(7,33,38,0.02)] text-grayish cursor-default";
  } else if (error) {
    stateClasses = "border-error focus:ring-0";
  } else if (success) {
    stateClasses = "border-success focus:ring-0";
  } else {
    // Matching the Purple focus and Grayish border from your Input
    stateClasses =
      "focus:border-[#8D999B] focus:bg-transparent focus:ring-2 focus:ring-0";
  }

  const textareaClasses = twMerge(baseClasses, stateClasses, className);

  return (
    <div className="w-full">
      <div className="relative">
        <textarea
          ref={ref}
          id={id}
          name={name}
          placeholder={placeholder}
          rows={rows}
          value={value}
          onChange={onChange}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          className={textareaClasses}
        />
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

export default TextArea;
