"use client";

import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

const ScrollToTop = () => {
  // const { settings } = useSettings();
  const [scrollPercent, setScrollPercent] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // const siteScrollToTop = getSettingValue(settings, "back_to_top");

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      const percent = height > 0 ? (scrolled / height) * 100 : 0;

      setScrollPercent(percent);
      setIsVisible(scrolled > 200);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={{
        background: `conic-gradient(#2CA77B ${scrollPercent}%, #44F1A6 ${scrollPercent}%)`,
      }}
      className={`fixed bottom-5 rtl:left-5 ltr:right-5 z-[999]
        w-[55px] h-[55px] rounded-full p-[4px]
        transition-all duration-300
        ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"}
      `}
    >
      <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
        <Icon icon="lucide:arrow-up" width="24" height="24" />
      </div>
    </button>
  );
};

export default ScrollToTop;
