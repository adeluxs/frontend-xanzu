"use client";

import { getSelectedLanguage, loadLanguages } from "@/utils/serverUtils";
import Cookies from "js-cookie";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { isRemoteMediaSource, normalizeMediaSource } from "@/utils/media";

const LanguageDropdown = ({ isOnlyIcon = false, isDashboard = false }) => {
  const [languageDropdown, setLanguageDropdown] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [selectedLang, setSelectedLang] = useState(null);
  const [isLanguageLoading, setIsLanguageLoading] = useState(true);
  const dropdownRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const getLanguages = async () => {
      try {
        const loadedLanguages = await loadLanguages();
        const locale = Cookies.get("NEXT_LOCALE") || "en";
        const selectedLanguage = getSelectedLanguage(loadedLanguages, locale);

        setLanguages(loadedLanguages);
        setSelectedLang(selectedLanguage);
        applyLanguageSettings(selectedLanguage);
      } catch (err) {
        console.error("Language load error:", err);
      } finally {
        setIsLanguageLoading(false);
      }
    };

    getLanguages();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setLanguageDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setLanguageDropdown(false);
  }, [pathname]);

  const applyLanguageSettings = (lang) => {
    if (!lang) return;
    document.documentElement.dir = lang.is_rtl ? "rtl" : "ltr";
    document.documentElement.lang = lang.locale;
    document.documentElement.setAttribute("data-language", lang.locale);
  };

  const handleSelect = (lang) => {
    setSelectedLang(lang);
    setLanguageDropdown(false);
    applyLanguageSettings(lang);
    Cookies.set("NEXT_LOCALE", lang.locale, { expires: 365 });

    window.dispatchEvent(
      new CustomEvent("languageChange", {
        detail: { language: lang },
      }),
    );

    router.refresh();
  };

  if (isLanguageLoading) {
    return (
      <div
        aria-hidden="true"
        className={`animate-pulse rounded-[10px] sm:rounded-[14px] h-[36px] sm:h-[44px] w-[92px] bg-[rgba(7,33,38,0.06)]`}
      />
    );
  }

  if (!selectedLang) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className={`flex items-center gap-[8px] cursor-pointer rounded-[10px] sm:rounded-[14px] h-[36px] sm:h-[44px]  ${
          isDashboard
            ? "bg-[rgba(7,33,38,0.04)] px-[10px] sm:px-[16px]"
            : "border border-grayish/10 px-[16px] sm:px-[24px]"
        }`}
        onClick={() => setLanguageDropdown((prev) => !prev)}
      >
        <div className={`flex items-center gap-[6px] sm:gap-[10px]`}>
          <span className={`text-base text-grayish font-medium`}>
            {selectedLang.name}
          </span>
        </div>
      </button>

      <div
        className={`absolute ltr:right-0 ltr:left-auto rtl:left-0 rtl:right-auto ${
          isOnlyIcon ? "mt-6.5 lg:mt-8.5" : "mt-[5px]"
        } w-[170px] bg-white border border-gray-200 rounded-[10px] shadow z-10 origin-top transform transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] p-1.5 ${
          languageDropdown
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-2 pointer-events-none"
        }`}
      >
        <ul>
          {languages.map((lang) => (
            <li key={lang.locale}>
              <button
                onClick={() => handleSelect(lang)}
                className={`w-full flex items-center gap-2 px-[12px] py-[8px] ltr:flex-row rtl:flex-row-reverse ltr:text-left rtl:text-right text-[14px] font-semibold transition-colors rounded-lg ${
                  selectedLang.locale === lang.locale
                    ? "text-grayish bg-primary/5"
                    : "text-grayish/60 hover:text-grayish"
                }`}
              >
                {lang.flag && (
                  <Image
                    src={normalizeMediaSource(lang.flag)}
                    alt={lang.name}
                    width={18}
                    height={18}
                    className="rounded-full object-cover"
                    unoptimized={isRemoteMediaSource(
                      normalizeMediaSource(lang.flag),
                    )}
                  />
                )}
                {lang.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LanguageDropdown;
