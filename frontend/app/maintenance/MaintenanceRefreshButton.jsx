"use client";

import Button from "@/components/ui/button/Button";
import { RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MaintenanceRefreshButton() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    window.location.reload();
  };

  return (
    <Button
      type="button"
      variant="primary-filled"
      size="compact"
      rounded="md"
      className="min-w-[160px] px-6"
      onClick={handleRefresh}
      loading={isRefreshing}
      startIcon={
        <RotateCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
      }
    >
      Try Again
    </Button>
  );
}
