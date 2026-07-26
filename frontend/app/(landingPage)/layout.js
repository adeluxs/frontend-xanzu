import { getLocale } from "@/lib/i18n/get-locale";
import { loadNavigationData } from "@/utils/serverUtils";
import Cookie from "./common/Cookie";
import Footer from "./common/Footer";
import Header from "./common/Header";
import ScrollToTop from "./common/ScrollToTop";

const layout = async ({ children }) => {
  const locale = await getLocale();
  const navigationResponse = await loadNavigationData(locale || "en");
  const navigationData = navigationResponse?.data || {};

  return (
    <div className="relative">
      <div className="fixed top-0 left-0 w-full z-50">
        <Header navigationData={navigationData} />
      </div>
      <div className="pt-[76px] lg:pt-[92px]">{children}</div>
      <div>
        <Footer navigationData={navigationData} />
      </div>
      <Cookie />
      <ScrollToTop />
    </div>
  );
};

export default layout;
