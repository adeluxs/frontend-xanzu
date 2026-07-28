"use client";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const DashboardLogo = () => {
  const [mounted, setMounted] = useState(false);
  const logo = useSelector(
    (state) => state?.settings?.settings?.site_logo_dark,
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !logo) {
    return (
      <div className="w-[120px] h-[22px] bg-gray-300 animate-pulse rounded-md" />
    );
  }

  return (
    <Image
      src={logo}
      alt="logo"
      width={150}
      height={40}
      className="w-full h-full object-contain"
    />
  );
};

export default DashboardLogo;
