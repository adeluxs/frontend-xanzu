"use client";
import { X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

const CommonModal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  actions = [],
  footer,
  width = "max-w-md",
  bgColor = "bg-white",
  overlayColor = "bg-black/50",
  closeOnOverlayClick = true,
  closeOnEscape = true,
  lockBodyScroll = true,
  showCloseButton = true,
  bodyScrollable = false,
  bodyMaxHeight = "max-h-[70vh]",
  containerClassName = "",
  overlayClassName = "",
  modalClassName = "",
  headerClassName = "",
  bodyClassName = "",
  footerClassName = "",
  titleClassName = "",
  subtitleClassName = "",
  closeButtonClassName = "",
}) => {
  const [mounted, setMounted] = useState(false);
  const titleId = useId();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!lockBodyScroll) return;
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, lockBodyScroll]);

  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div
      className={`fixed inset-0 flex items-center justify-center w-full h-full p-4 ${containerClassName}`}
      style={{ zIndex: 9999, isolation: "isolate" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
    >
      {/* ✅ Overlay — click closes modal */}
      <div
        className={`absolute inset-0 ${overlayColor} backdrop-blur-sm animate-fadeIn ${overlayClassName}`}
        onClick={closeOnOverlayClick ? onClose : undefined}
      />

      {/* Modal Box */}
      <div
        className={`relative w-full ${width} rounded-2xl p-6 ${bgColor} shadow-2xl transform transition-all animate-scaleIn ${modalClassName}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {showCloseButton && (
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 text-grayish transition-colors duration-200 hover:bg-gray-100 rounded-full p-1 ${closeButtonClassName}`}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        )}

        {/* Header */}
        {(title || subtitle) && (
          <div className={`mb-4 pr-8 ${headerClassName}`}>
            {title && (
              <h2
                id={titleId}
                className={`text-[19px] font-bold text-grayish text-center ${titleClassName}`}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p
                className={`text-sm text-grayish/60 mt-1 text-center ${subtitleClassName}`}
              >
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Body */}
        <div
          className={`mb-0 ${
            bodyScrollable ? `overflow-y-auto ${bodyMaxHeight}` : ""
          } ${bodyClassName}`}
        >
          {children}
        </div>

        {/* Footer */}
        {footer ? (
          <div className={footerClassName}>{footer}</div>
        ) : (
          actions.length > 0 && (
            <div
              className={`flex justify-center gap-3 flex-wrap ${footerClassName}`}
            >
              {actions.map((btn, index) => (
                <button
                  key={index}
                  onClick={btn.onClick}
                  disabled={btn.disabled}
                  className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${btn.className}`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default CommonModal;
