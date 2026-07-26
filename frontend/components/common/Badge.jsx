"use client";
import { FailedIcon, PendingIcon, SuccessIcon } from "@/icons";

const Badge = ({ status = "" }) => {
  const normalizedStatus = String(status).toLowerCase();

  const statusConfig = {
    success: {
      className: "badge-success",
      icon: <SuccessIcon />,
      label: "Success",
    },
    pending: {
      className: "badge-pending",
      icon: <PendingIcon />,
      label: "Pending",
    },
    refunded: {
      className: "badge-pending",
      icon: <PendingIcon />,
      label: "Refunded",
    },
    failed: {
      className: "badge-error",
      icon: <FailedIcon />,
      label: "Failed",
    },
    cancelled: {
      className: "badge-error",
      icon: <FailedIcon />,
      label: "Cancelled",
    },
    processing: {
      className: "badge-processing",
      icon: <PendingIcon />,
      label: "Processing",
    },
    completed: {
      className: "badge-success",
      icon: <SuccessIcon />,
      label: "Completed",
    },
    delivered: {
      className: "badge-success",
      icon: <SuccessIcon />,
      label: "Delivered",
    },
    waiting_for_delivery: {
      className: "badge-processing",
      icon: <PendingIcon />,
      label: "Waiting For Delivery",
    },
    payment_success: {
      className: "badge-success",
      icon: <SuccessIcon />,
      label: "Payment Success",
    },
    open: {
      className: "badge-success",
      icon: <SuccessIcon />,
      label: "Open",
    },
    closed: {
      className: "badge-error",
      icon: <FailedIcon />,
      label: "Closed",
    },
    draft: {
      className: "badge-error",
      icon: <PendingIcon />,
      label: "Draft",
    },
    active: {
      className: "badge-success",
      icon: <SuccessIcon />,
      label: "Active",
    },
    inactive: {
      className: "badge-error",
      icon: <PendingIcon />,
      label: "In-Active",
    },
    Rejected: {
      className: "badge-error",
      icon: <FailedIcon />,
      label: "Rejected",
    },
  };

  const currentStatus = statusConfig[normalizedStatus] || {
    className: "badge-default",
    icon: null,
    label: String(status)
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase()),
  };

  return (
    <span
      className={`${currentStatus.className} badge flex items-center gap-[6px]`}
    >
      {currentStatus.icon && (
        <span className="shrink-0">{currentStatus.icon}</span>
      )}
      {currentStatus.label}
    </span>
  );
};

export default Badge;
