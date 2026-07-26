import { loadSiteSettings } from "@/utils/serverUtils";
import Image from "next/image";
import MaintenanceRefreshButton from "./MaintenanceRefreshButton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Maintenance",
  description: "site is temporarily unavailable while we complete updates.",
};

export default async function MaintenancePage() {
  const settings = await loadSiteSettings();
  const title =
    settings.maintenance_title ||
    "Site is currently under maintenance for a better experience.";
  const text =
    settings.maintenance_text ||
    "Sorry for interrupting! The site will be live soon.";
  const logo = settings.site_logo_dark || "/assets/common/logo/logo.svg";

  return (
    <main
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url('/assets/error/error-page-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center justify-center px-6">
        <div className="w-full rounded-[28px] border border-white/70 bg-white/85 px-6 py-8 shadow-[0_24px_70px_rgba(7,33,38,0.10)] backdrop-blur-sm sm:px-10 sm:py-12">
          <div className="mx-auto mb-6 flex w-fit items-center justify-center rounded-[18px] bg-white px-5 py-4 shadow-[0_14px_40px_rgba(7,33,38,0.08)]">
            <Image
              src={logo}
              alt="Xanzo logo"
              width={180}
              height={48}
              className="h-[24px] w-auto object-contain sm:h-[28px]"
              unoptimized={logo.startsWith("http")}
              priority
            />
          </div>

          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-bold text-2xl leading-tight tracking-tight text-grayish sm:text-[40px]">
              {title}
            </h1>
            <p className="mt-4 text-base font-medium leading-8 text-grayish/60 sm:text-lg">
              {text}
            </p>
          </div>

          <div className="mt-7 flex justify-center">
            <MaintenanceRefreshButton />
          </div>
        </div>
      </div>
    </main>
  );
}
