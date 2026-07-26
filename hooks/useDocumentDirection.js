import { useEffect, useState } from "react";

export function useDocumentDirection() {
  const [dir, setDir] = useState("ltr");

  useEffect(() => {
    // Set initial direction
    setDir(document.documentElement.dir || "ltr");

    // Watch for direction changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "dir") {
          setDir(document.documentElement.dir || "ltr");
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["dir"],
    });

    return () => observer.disconnect();
  }, []);

  return dir;
}
