"use client";
import { useT } from "@/context/TranslationContext";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { isRemoteMediaSource, normalizeMediaSource } from "@/utils/media";

const AuthCommon = ({ children }) => {
  const logo = useSelector(
    (state) => state?.settings?.settings?.site_logo_dark,
  );
  const logoSource = normalizeMediaSource(
    logo,
    "/assets/common/logo/logo.svg",
  );
  const t = useT();

  return (
    <div
      className="bg-cover bg-no-repeat bg-center w-screen min-h-screen lg:h-screen flex items-start lg:items-center overflow-y-auto lg:overflow-hidden py-0"
      style={{
        backgroundImage: "url('/assets/auth-page/auth-bg.png')",
      }}
    >
      <div className="custom-container mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-7.5 mt-10 lg:mt-0">
          <div className="left">
            <div className="flex flex-col items-center lg:items-start">
              <Link
                href="/"
                className="inline-block h-[20px] sm:h-[22px] w-auto mb-6 lg:mb-9"
              >
                {logoSource ? (
                  <Image
                    src={logoSource}
                    alt="logo"
                    width={150}
                    height={40}
                    className="w-full h-full object-contain"
                    unoptimized={isRemoteMediaSource(logoSource)}
                    priority
                  />
                ) : (
                  <div className="w-[120px] h-[22px] bg-gray-300 animate-pulse rounded-md" />
                )}
              </Link>
              <h3 className="text-2xl lg:text-3xl font-semibold text-grayish w-[70%] text-center lg:rtl:text-right lg:ltr:text-left">
                {t("auth.welcomeToMerchantAccount")}
              </h3>
            </div>
            <div className="mt-[80px] hidden lg:block">
              <div className="w-[400px] xl:w-[533px] h-[400px]">
                <Image
                  src="/assets/auth-page/auth-img.png"
                  alt="logo"
                  width={550}
                  height={540}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
          <div className="right w-full lg:w-auto lg:max-h-[calc(100vh-2.5rem)] lg:overflow-y-auto py-0 lg:py-5 no-scrollbar-show">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthCommon;
