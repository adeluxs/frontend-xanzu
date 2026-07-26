"use client";
import { twMerge } from "tailwind-merge";

const Checkbox = ({
  label,
  checked,
  id,
  onChange,
  inputClassName = "",
  labelClassName = "",
  disabled = false,
}) => {
  return (
    <label
      className={twMerge(
        "flex items-center gap-2 cursor-pointer select-none",
        disabled && "cursor-not-allowed opacity-60",
      )}
    >
      <div className="relative flex justify-center items-center">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className={twMerge(
            `
            peer
            h-[18px] w-[18px]
            appearance-none
            rounded-[8px]
            border border-[#E6E9E9]
            bg-white
            transition-all duration-200
            cursor-pointer
            checked:bg-primary
            checked:border-primary
            focus:outline-none
            focus:ring-2
            focus:ring-primary/20
          `,
            inputClassName,
          )}
        />

        {/* Checkmark */}
        <svg
          className="absolute inset-0 m-auto h-[12px] w-[12px] text-grayish opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity duration-200"
          viewBox="0 0 15 15"
          fill="none"
        >
          <path
            d="M11.5 4L6 9.5L3.5 7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {label && (
        <span
          className={twMerge(
            "text-sm font-normal text-[#596A6E]",
            labelClassName,
          )}
        >
          {label}
        </span>
      )}
    </label>
  );
};

export default Checkbox;
