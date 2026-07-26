"use client";

import { useT } from "@/context/TranslationContext";
import { useKycDetailsQuery } from "@/lib/features/auth/authApi";
import Image from "next/image";

const isImageUrl = (value) => {
  if (typeof value !== "string") return false;
  return (
    /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(value) ||
    value.startsWith("data:image/")
  );
};

const KycDetails = () => {
  const { data: kycDetails, isLoading: isKycDetailsLoading } =
    useKycDetailsQuery();
  const t = useT();

  const kycData = kycDetails?.data?.[0]?.data ?? {};
  const entries = Object.entries(kycData).filter(
    ([_, value]) => value !== null && value !== undefined && value !== "",
  );

  if (isKycDetailsLoading) {
    return (
      <div className="max-w-[796px] rounded-[16px] border border-[rgba(7,33,38,0.16)] bg-white p-5 sm:p-7.5">
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between py-3">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-4 w-48 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!entries.length) {
    return (
      <div className="max-w-[660px] rounded-[16px] border border-[rgba(7,33,38,0.16)] bg-white p-5 sm:p-7.5">
        <p className="text-sm text-grayish/60 text-center py-4">
          {t("dashboard.noKycDetailsFound")}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[660px] rounded-[16px] border border-[rgba(7,33,38,0.16)] bg-white p-5 sm:p-7.5">
      <h2 className="text-lg font-semibold text-grayish mb-5">
        {t("dashboard.kycDetails")}
      </h2>

      <div className="divide-y divide-[rgba(7,33,38,0.08)]">
        {entries.map(([key, value]) => {
          const label = key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
          const isImage = isImageUrl(value);

          return (
            <div
              key={key}
              className={`flex py-3.5 gap-4 ${isImage ? "flex-col items-start" : "flex-row items-center justify-between"}`}
            >
              <span className="text-sm font-medium text-grayish/60 shrink-0 sm:w-48">
                {label}
              </span>

              {isImage ? (
                <div className="relative w-full h-full rounded-lg overflow-hidden border border-[rgba(7,33,38,0.12)]">
                  <Image
                    src={value}
                    alt={label}
                    width={500}
                    height={500}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <span className="text-sm text-grayish font-medium text-right">
                  {String(value)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KycDetails;
