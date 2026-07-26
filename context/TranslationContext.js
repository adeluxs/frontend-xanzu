"use client";
import { createContext, useContext, useEffect, useState } from "react";

const TranslationContext = createContext();

export const TranslationProvider = ({
  children,
  initialLang,
  initialTranslations,
}) => {
  const [currentLang, setCurrentLang] = useState(initialLang);
  const [translations, setTranslations] = useState(initialTranslations);
  const [isLoading, setIsLoading] = useState(false);

  const loadTranslations = async (langCode) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/locales/${langCode}.json`);
      const data = await res.json();
      setTranslations(data);
      setCurrentLang(langCode);
    } catch (err) {
      // console.error("Translation load error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleLanguageChange = async (event) => {
      const newLang = event.detail.language.locale;

      // Load new translations for client components
      await loadTranslations(newLang);
    };

    window.addEventListener("languageChange", handleLanguageChange);
    return () =>
      window.removeEventListener("languageChange", handleLanguageChange);
  }, []);

  const t = (key) => {
    const keys = key.split(".");
    let value = translations;

    for (const k of keys) {
      value = value?.[k];
      if (!value) return key;
    }

    return value || key;
  };

  return (
    <TranslationContext.Provider value={{ t, currentLang, isLoading }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within TranslationProvider");
  }
  return context;
};

export const useT = () => {
  const { t } = useTranslation();
  return t;
};
