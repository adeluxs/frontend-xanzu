import { TranslationProvider } from "@/context/TranslationContext";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import StoreProvider from "@/lib/StoreProvider";
import SettingsProvider from "@/providers/SettingsProvider";
import {
  getSelectedLanguage,
  loadLanguages,
  loadSiteSettings,
} from "@/utils/serverUtils";
import { ToastContainer } from "react-toastify";
import "./globals.css";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  try {
    const settings = await loadSiteSettings();
    const siteTitle =
      typeof settings?.site_title === "string" && settings.site_title.trim()
        ? settings.site_title.trim()
        : "BNPL";
    const siteFavicon =
      typeof settings?.site_favicon === "string" &&
      settings.site_favicon.trim()
        ? settings.site_favicon.trim()
        : "/favicon.png";

    return {
      title: siteTitle,
      icons: {
        icon: siteFavicon,
      },
    };
  } catch (err) {
    console.error("Failed to fetch settings:", err);

    return {
      title: "BNPL",
      description: "Empower Your Financial Journey",
      icons: {
        icon: "/favicon.png",
      },
    };
  }
}

export default async function RootLayout({ children }) {
  const locale = await getLocale();
  const dictionary = await getDictionary(locale);
  const languages = await loadLanguages();
  const selectedLanguage = getSelectedLanguage(languages, locale) || {
    is_rtl: false,
  };

  return (
    <html lang={locale} dir={selectedLanguage.is_rtl ? "rtl" : "ltr"}>
      <body>
        <StoreProvider>
          <TranslationProvider
            initialLang={locale}
            initialTranslations={dictionary}
          >
            <SettingsProvider>
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
              {children}
            </SettingsProvider>
          </TranslationProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
