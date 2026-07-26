import { getLocale } from "@/lib/i18n/get-locale";
import { loadLandingData } from "@/utils/serverUtils";
import LandingPage from "./pageComponents/LandingPage";

export const dynamic = "force-dynamic";

async function fetchLandingPageData() {
  const locale = await getLocale();
  return loadLandingData(locale || "en");
}

export async function generateMetadata() {
  const homeData = await fetchLandingPageData();
  const meta = homeData?.meta || {};
  const rawTitle = meta?.title || "Buy Now, Pay Later Made Simple1";

  return {
    title: { absolute: rawTitle },
    description:
      meta?.description?.trim() ||
      "Shop today and pay over time with BNPL Site. Transparent, interest-free BNPL for smarter spending and smoother checkout.",
    keywords: meta?.keywords?.trim(),
    icons: meta?.favicon
      ? {
          icon: {
            url: meta?.favicon,
            sizes: "32x32",
            type: "image/png",
          },
        }
      : undefined,
    openGraph: {
      title: meta?.title || rawTitle,
      description:
        meta?.description?.trim() ||
        "Shop today and pay over time with BNPL Site. Transparent, interest-free BNPL for smarter spending and smoother checkout.",
      type: "website",
    },
  };
}

export default async function Home() {
  const homeData = await fetchLandingPageData();
  const landingData = homeData?.data || null;

  return (
    <>
      <LandingPage landingData={landingData} />
    </>
  );
}
