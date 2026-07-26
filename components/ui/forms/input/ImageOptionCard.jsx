"use client";

import { CheckIcon2 } from "@/icons";
import Image from "next/image";

const ImageOptionCard = ({
  id,
  name,
  label,
  image,
  value,
  checked,
  onChange,
  type = "single",
  disabled = false,
  showLabel = false,
}) => {
  const inputType = type === "multiple" ? "checkbox" : "radio";

  return (
    <label
      htmlFor={id}
      className={`relative block cursor-pointer rounded-[14px] border overflow-hidden transition-all duration-200 h-[100px] sm:h-[130px] w-[100px] sm:w-[130px] ${
        checked
          ? "border-primary shadow-[0_8px_20px_rgba(110,74,255,0.10)]"
          : "border-grayish/16 hover:border-primary/40"
      } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
    >
      <input
        id={id}
        type={inputType}
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={() => onChange(value ?? id)}
        className="sr-only"
      />

      <div className="relative w-full h-full bg-grayish/5">
        <Image
          src={image}
          alt={label}
          width={200}
          height={200}
          className="object-cover w-full h-full"
        />
      </div>
      {showLabel && (
        <p className="text-grayish text-sm font-medium px-3 py-2">{label}</p>
      )}

      {checked && (
        <span className="absolute top-2 right-2 h-5.5 w-5.5 rounded-full bg-primary text-white flex items-center justify-center shadow-md ring-2 ring-white">
          <CheckIcon2 className="h-3 w-3" />
        </span>
      )}
    </label>
  );
};

export default ImageOptionCard;
