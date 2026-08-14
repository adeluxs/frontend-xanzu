"use client";

import { useState } from "react";

export default function ServiceRefreshButton() {
  const [isChecking, setIsChecking] = useState(false);

  const checkAgain = () => {
    setIsChecking(true);
    window.location.reload();
  };

  return (
    <button
      type="button"
      onClick={checkAgain}
      disabled={isChecking}
      className="inline-flex min-h-11 items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-grayish transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
    >
      {isChecking ? "Checking…" : "Check again"}
    </button>
  );
}
