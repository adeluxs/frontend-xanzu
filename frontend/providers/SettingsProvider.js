"use client";

import { useGetSettingsQuery } from "@/lib/features/globalSettings/globalSettingsApi";

export default function SettingsProvider({ children }) {
  useGetSettingsQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
    pollingInterval: 6000000, // optional
  });

  return children;
}
