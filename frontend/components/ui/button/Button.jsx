"use client";
import { cn } from "@/utils/cn";
import Link from "next/link";
import React from "react";

/* -------------------------------------------------------------------------- */
/* BASE STYLE                                */
/* -------------------------------------------------------------------------- */

const BASE_STYLE =
  "group relative inline-flex items-center justify-center gap-2 font-semibold tracking-wide transition-all duration-300 ease-out disabled:opacity-50 disabled:pointer-events-none overflow-hidden select-none";

/* -------------------------------------------------------------------------- */
/* VARIANT STYLES                               */
/* -------------------------------------------------------------------------- */

// Note: Hover states removed from here because the "bubble" overlay handles the color transition
const variantStyles = {
  primary: "bg-primary text-grayish hover:text-white",
  secondary: "bg-dark text-grayish hover:text-white",
  "primary-filled": "bg-primary text-grayish hover:text-white",
  "secondary-filled": "bg-dark text-white hover:text-grayish",
  "danger-filled": "bg-danger text-white hover:text-white",
  "success-filled": "bg-success text-grayish hover:text-white",
  "warning-filled": "bg-warning text-grayish hover:text-white",
  "info-filled": "bg-info text-grayish hover:text-white",
  "heading-filled": "bg-heading text-grayish hover:text-white",
  outline: "border border-primary text-primary bg-transparent hover:text-white",
  "primary-outline":
    "border border-primary text-grayish bg-transparent hover:text-grayish",
  "secondary-outline":
    "border border-secondary text-grayish bg-transparent hover:text-white",
  "danger-outline":
    "border border-danger text-danger bg-transparent hover:text-white",
  "success-outline":
    "border border-success text-success bg-transparent hover:text-white",
  "warning-outline":
    "border border-warning text-warning bg-transparent hover:text-white",
  "info-outline":
    "border border-info text-info bg-transparent hover:text-white",
  "heading-outline":
    "border border-heading/20 text-grayish bg-transparent hover:text-white",
  "primary-filled-outline":
    "bg-primary/10 backdrop-blur-sm border border-primary/30 text-primary hover:text-white",
  "secondary-filled-outline":
    "bg-secondary/10 backdrop-blur-sm border border-secondary/30 text-grayish hover:text-white",
  "danger-filled-outline":
    "bg-danger/10 backdrop-blur-sm border border-danger/30 text-danger hover:text-white",
  "success-filled-outline":
    "bg-success/10 backdrop-blur-sm border border-success/30 text-success hover:text-white",
  "warning-filled-outline":
    "bg-warning/10 backdrop-blur-sm border border-warning/30 text-warning hover:text-white",
  "info-filled-outline":
    "bg-info/10 backdrop-blur-sm border border-info/30 text-info hover:text-white",
  danger: "bg-danger text-white hover:text-white",
  success: "bg-success text-white hover:text-success",
  warning: "bg-warning text-white hover:text-warning",
  info: "bg-info text-white hover:text-info",
};

// Logic for the sliding background color
const hoverBgColors = {
  primary: "bg-dark",
  secondary: "bg-primary",
  "primary-filled": "bg-dark",
  "secondary-filled": "bg-primary",
  outline: "bg-primary",
  "primary-outline": "bg-primary",
  "secondary-outline": "bg-secondary",
  "danger-filled": "bg-red-800",
  // Add more mappings as needed
};

/* -------------------------------------------------------------------------- */
/* SIZE STYLES                               */
/* -------------------------------------------------------------------------- */

const sizeStyles = {
  xxs: "px-3 h-8 text-xs rounded-md",
  xs: "px-4 h-9 text-sm rounded-md",
  compact: "px-4 sm:px-5 h-10 text-sm rounded-[10px]",
  sm: "px-4 sm:px-5 h-12 text-sm rounded-lg",
  md: "px-6 sm:px-7 h-12 text-sm rounded-xl",
  lg: "px-5 sm:px-[32px] h-[46px] sm:h-[52px] text-sm rounded-[14px]",
  xl: "px-6 sm:px-10 h-14 text-lg rounded-2xl",
};

/* -------------------------------------------------------------------------- */
/* ROUNDED STYLES                              */
/* -------------------------------------------------------------------------- */

const roundedStyles = {
  none: "rounded-none",
  xs: "rounded-[5px]",
  sm: "rounded-[8px]",
  md: "rounded-[10px]",
  lg: "rounded-[14px]",
  full: "rounded-full",
};

/* -------------------------------------------------------------------------- */
/* COMPONENT                                 */
/* -------------------------------------------------------------------------- */

export const Button = React.forwardRef(function Button(
  {
    href,
    type = "button",
    children,
    className,
    onClick,
    disabled = false,
    loading = false,
    target,
    variant = "primary",
    size = "md",
    rounded = "full",
    startIcon,
    endIcon,
    bubble = true, // Default to true for your desired effect
    ...props
  },
  ref,
) {
  const buttonClasses = cn(
    BASE_STYLE,
    variantStyles[variant],
    sizeStyles[size],
    roundedStyles[rounded],
    className,
  );

  /* ------------------------------ Render Content --------------------------- */

  const renderContent = () => {
    return (
      <>
        {loading && (
          <span className="absolute top-0 left-0 w-full h-[3px] overflow-hidden rounded-t-inherit">
            <span className="block h-full w-1/3 bg-grayish/70 button-loading-bar" />
          </span>
        )}

        {startIcon && !loading && (
          <span className="flex items-center relative z-10">{startIcon}</span>
        )}

        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>

        {endIcon && !loading && (
          <span className="flex items-center relative z-10">{endIcon}</span>
        )}
      </>
    );
  };

  const hoverOverlay = bubble && (
    <span
      className={cn(
        "absolute inset-0 z-0 w-full h-full transition-transform duration-500 ease-in-out -translate-y-full group-hover:translate-y-0",
        hoverBgColors[variant] || "bg-black/10",
      )}
    />
  );

  /* -------------------------- Support Link / Button ------------------------ */

  const commonProps = {
    className: buttonClasses,
    ref: ref,
    "aria-disabled": disabled || loading,
  };

  if (href) {
    return (
      <Link href={href} target={target} {...commonProps}>
        {renderContent()}
        {hoverOverlay}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      {...commonProps}
      {...props}
    >
      {renderContent()}
      {hoverOverlay}
    </button>
  );
});

Button.displayName = "Button";
export default Button;
