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
import { Outfit } from "next/font/google";
import { ToastContainer } from "react-toastify";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const dynamic = "force-dynamic";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export async function generateMetadata() {
  try {
    const settings = await loadSiteSettings();
    const siteTitle = settings?.site_title;
    const siteFavicon = settings?.site_favicon;

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
  const selectedLanguage = getSelectedLanguage(languages, locale) || languages[0] || { is_rtl: false };

  return (
    <html
      lang={locale}
      className={`${outfit.variable}`}
      dir={selectedLanguage.is_rtl ? "rtl" : "ltr"}
    >
      <body className={outfit.className}>
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
        <SpeedInsights />
      </body>
    </html>
  );
}
