"use client";
import AppPreloader from "@/components/common/AppPreloader";
import { usePathname } from "next/navigation";

export default function Loading() {
  const pathname = usePathname();

  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  return <AppPreloader />;
}
