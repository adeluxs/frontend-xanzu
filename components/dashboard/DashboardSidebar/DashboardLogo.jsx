"use client";
import SafeImage from "@/components/common/SafeImage";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { normalizeMediaSource } from "@/utils/media";

const DashboardLogo = () => {
  const [mounted, setMounted] = useState(false);
  const darkLogo = useSelector(
    (state) => state?.settings?.settings?.site_logo_dark,
  );
  const logo = useSelector((state) => state?.settings?.settings?.site_logo);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSource = normalizeMediaSource(
    darkLogo,
    "/assets/common/logo/logo.svg",
  );
  const logoFallback = normalizeMediaSource(
    logo,
    "/assets/common/logo/logo.svg",
  );

  if (!mounted) {
    return (
      <div className="w-[120px] h-[22px] bg-gray-300 animate-pulse rounded-md" />
    );
  }

  return (
    <SafeImage
      src={logoSource}
      fallbackSrc={logoFallback}
      alt="logo"
      width={150}
      height={40}
      className="w-full h-full object-contain"
    />
  );
};

export default DashboardLogo;
