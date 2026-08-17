import SafeImage from "@/components/common/SafeImage";
import { normalizeMediaSource } from "@/utils/media";
import { loadSiteSettings } from "@/utils/serverUtils";
import ServiceRefreshButton from "./ServiceRefreshButton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Service unavailable",
  description: "This service is temporarily unavailable.",
  robots: { index: false, follow: false },
};

export default async function ServiceSuspendedPage() {
  const settings = await loadSiteSettings();
  const message =
    typeof settings?.service_suspension_message === "string" &&
    settings.service_suspension_message.trim()
      ? settings.service_suspension_message.trim()
      : "Payment has not been made. Please contact the Developer to restore access.";
  const logo = normalizeMediaSource(
    settings?.site_logo_dark,
    "/assets/common/logo/logo.svg",
  );
  const logoFallback = normalizeMediaSource(
    settings?.site_logo,
    "/assets/common/logo/logo.svg",
  );

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#f7faf9] px-5 py-10">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-primary" />
      <div className="relative z-10 w-full max-w-2xl rounded-[28px] border border-grayish/10 bg-white px-6 py-9 text-center shadow-[0_24px_70px_rgba(7,33,38,0.10)] sm:px-12 sm:py-12">
        <div className="mx-auto mb-7 flex w-fit items-center justify-center rounded-[18px] bg-white px-5 py-4 shadow-[0_14px_40px_rgba(7,33,38,0.08)]">
          <SafeImage
            src={logo}
            fallbackSrc={logoFallback}
            alt="Site logo"
            width={180}
            height={48}
            sizes="180px"
            className="h-7 w-auto object-contain"
            priority
          />
        </div>

        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-2xl font-bold text-grayish">
          !
        </div>
        <h1 className="text-2xl font-bold leading-tight tracking-tight text-grayish sm:text-4xl">
          Service temporarily unavailable
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base font-medium leading-7 text-grayish/65 sm:text-lg">
          {message}
        </p>

        <div className="mt-8">
          <ServiceRefreshButton />
        </div>
      </div>
    </main>
  );
}
