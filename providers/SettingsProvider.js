"use client";

import { useGetSettingsQuery } from "@/lib/features/globalSettings/globalSettingsApi";

export default function SettingsProvider({ children }) {
  useGetSettingsQuery(undefined, {
    refetchOnReconnect: true,
    refetchOnMountOrArgChange: 300,
  });

  return children;
}
