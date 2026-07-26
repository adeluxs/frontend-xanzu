"use client";
import { useSyncExternalStore } from "react";
import Select from "react-select";

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const SIZE_CONFIG = {
  xs: { height: 36, fontSize: 12, paddingX: 12 },
  sm: { height: 40, fontSize: 14, paddingX: 14 },
  md: { height: 44, fontSize: 14, paddingX: 16 }, // Height matches Input base
  lg: { height: 52, fontSize: 14, paddingX: 16 },
};

const ReactSelectInput = ({
  id,
  options = [],
  placeholder = "Select an option",
  value = "",
  onChange,
  className = "",
  disabled = false,
  loading = false,
  size = "lg",
  height,
  borderless = false,
  formatOptionLabel: customFormatOptionLabel,
  borderRadius,
}) => {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const sizeConfig = SIZE_CONFIG[size] || SIZE_CONFIG.md;
  const finalHeight = typeof height === "number" ? height : sizeConfig.height;
  const finalBorderRadius =
    typeof borderRadius === "number" ? borderRadius : 14;

  const mappedOptions = options.map((opt) => ({
    ...opt,
    value: opt.value,
    label: opt.label,
    image: opt.image || opt.flag || null,
    isDisabled: opt.disabled || false,
  }));

  const selectedValue =
    mappedOptions.find((opt) => opt.value === value) || null;

  const defaultFormatOptionLabel = (option) => (
    <div className="flex items-center gap-2">
      {option.image && (
        <img
          src={option.image}
          alt={option.label}
          className="h-4 w-auto rounded-[2px] object-cover"
        />
      )}
      <span>{option.label}</span>
    </div>
  );

  const finalFormatOptionLabel =
    customFormatOptionLabel || defaultFormatOptionLabel;

  if (!isMounted) {
    return (
      <div
        className={`w-full rounded-[8px] border border-grayish/16 ${className}`}
        style={{ height: finalHeight }}
      />
    );
  }

  const customStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: finalHeight,
      height: finalHeight,
      borderRadius: finalBorderRadius,
      backgroundColor: state.isFocused
        ? "rgba(7,33,38,0.04)"
        : "rgba(7,33,38,0.04)",
      border: "2px solid transparent",
      transition: "all 200ms ease",
      cursor: disabled ? "not-allowed" : "pointer",
      placeholder: "text-[#8D999B]",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#8D999B",
        backgroundColor: "transparent",
      },
      ...(state.isFocused && {
        borderColor: "#8D999B",
        backgroundColor: "rgba(7,33,38,0.04)",
      }),
    }),

    valueContainer: (base) => ({
      ...base,
      padding: `0 ${sizeConfig.paddingX}px`,
    }),

    placeholder: (base) => ({
      ...base,
      fontSize: sizeConfig.fontSize,
      fontWeight: 400,
      color: "#8D999B",
    }),

    singleValue: (base) => ({
      ...base,
      fontSize: sizeConfig.fontSize,
      fontWeight: 500,
      color: "#111827",
    }),

    input: (base) => ({
      ...base,
      color: "#111827",
      fontWeight: 500,
      fontSize: sizeConfig.fontSize,
      borderRadius: 0,
    }),

    menu: (base) => ({
      ...base,
      borderRadius: 14,
      overflow: "hidden",
      border: "2px solid rgba(7,33,38,0.10)",
      marginTop: 6,
      boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
      backgroundColor: "#fff",
      padding: "6px 10px",
      zIndex: "20",
    }),

    option: (base, state) => ({
      ...base,
      fontSize: sizeConfig.fontSize,
      fontWeight: 500,
      padding: "10px 12px",
      margin: "5px 0px 0px 0px",
      borderRadius: 10,

      backgroundColor: state.isSelected
        ? "rgba(7,33,38,0.04)"
        : state.isFocused
          ? "rgba(7,33,38,0.04)"
          : "transparent",

      color: "#111827",

      cursor: state.isDisabled ? "not-allowed" : "pointer",

      transition: "all 150ms ease",

      "&:active": {
        backgroundColor: "rgba(7,33,38,0.04)",
      },
    }),

    indicatorSeparator: () => ({ display: "none" }),

    dropdownIndicator: (base) => ({
      ...base,
      color: "#797F87",
      "&:hover": { color: "#8D999B" },
    }),
  };

  return (
    <Select
      inputId={id}
      isDisabled={disabled}
      options={mappedOptions}
      value={selectedValue}
      onChange={(selected) => onChange?.(selected?.value || "")}
      placeholder={placeholder}
      styles={customStyles}
      className={className}
      formatOptionLabel={finalFormatOptionLabel}
      isSearchable
      isLoading={loading}
    />
  );
};

export default ReactSelectInput;
