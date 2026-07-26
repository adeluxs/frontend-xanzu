"use client";

import Button from "@/components/ui/button/Button";
import { useT } from "@/context/TranslationContext";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const Cookie = () => {
  const [showCookie, setShowCookie] = useState(false);
  const t = useT();

  useEffect(() => {
    const savedConsent = Cookies.get("cookieConsent");
    if (!savedConsent) {
      setShowCookie(true);
    }
  }, []);

  const handleConsent = (value) => {
    Cookies.set("cookieConsent", value, { expires: 365 });
    setShowCookie(false);
  };

  if (!showCookie) return null;

  return (
    <div className="fixed bottom-5 sm:bottom-10 left-1/2 -translate-x-1/2 z-[90] max-w-[870px]">
      <div className="bg-white shadow-2xl w-full h-full rounded-[16px] p-4 border border-[rgba(7,33,38,0.16)] flex lg:items-center items-start flex-col lg:flex-row gap-4">
        <p className="text-[14px] font-medium text-[#394D51]">
          {t("auth.cookiesDescription")}
        </p>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="primary-filled"
            size="xs"
            className=""
            rounded="sm"
            onClick={() => handleConsent("allowed")}
          >
            {t("auth.accept")}
          </Button>
          <Button
            type="button"
            variant="danger"
            size="xs"
            className=""
            rounded="sm"
            onClick={() => handleConsent("declined")}
          >
            {t("auth.decline")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cookie;
