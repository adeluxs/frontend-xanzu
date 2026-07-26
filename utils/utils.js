export function transformRegisterSettings(settings = []) {
  const result = {};
  let customFields = [];

  settings.forEach((item) => {
    const { key, value } = item;

    if (!key.includes("_")) return;

    // merchant / agent ignore
    if (key.startsWith("merchant_")) return;
    if (key.startsWith("agent_")) return;

    // handle custom fields separately
    if (key === "register_custom_fields") {
      customFields = value || [];
      return;
    }

    const parts = key.split("_");
    const type = parts.pop(); // last => show / validation
    const field = parts.join("_");

    if (!result[field]) {
      result[field] = { show: false, validation: false };
    }

    result[field][type] = value === "1";
  });

  return {
    fieldConfig: result,
    customFields,
  };
}

export const formatTime = (seconds) => {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
};

// Formate text
export function formatText(text = "") {
  if (!text) return "";

  return text
    .toString()
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};

export const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const calculateChargeAndTotal = ({
  amount,
  transferCharge,
  transferChargeType,
}) => {
  const numAmount = Number(amount) || 0;
  const numCharge = Number(transferCharge) || 0;

  let charge = 0;
  if (transferChargeType === "percentage") {
    charge = (numAmount * numCharge) / 100;
  } else {
    charge = numCharge;
  }

  const total = numAmount + charge;

  return {
    charge: parseFloat(charge.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
  };
};

export const formatType = (type = "") =>
  type
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export const copyTextToClipboard = async (text = "") => {
  if (!text || typeof window === "undefined") return false;

  if (navigator?.clipboard?.writeText && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {}
  }

  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "fixed";
    textArea.style.top = "-9999px";
    textArea.style.left = "-9999px";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);

    return successful;
  } catch {
    return false;
  }
};
