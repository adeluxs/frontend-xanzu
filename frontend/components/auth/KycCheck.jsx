"use client";

import { useT } from "@/context/TranslationContext";
import { useGetUserQuery } from "@/lib/features/user/userApi";
import { Check, Clock, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Button from "../ui/button/Button";
import AuthCommon from "./AuthCommon";

//kyc status list
const KYC_STATUS = {
  NOT_SUBMITTED: 0,
  VERIFIED: 1,
  PENDING: 2,
  FAILED: 3,
};

// normalize kyc status
const normalizeKycStatus = (value) => {
  const numericValue = Number(value);
  return Number.isNaN(numericValue) ? KYC_STATUS.NOT_SUBMITTED : numericValue;
};

// get status content
const getStatusContent = (kycStatus, isCheckingStatus, t) => {
  if (kycStatus === KYC_STATUS.VERIFIED) {
    return {
      icon: <Check size={30} strokeWidth={2.5} className="text-white" />,
      iconBg: "bg-[#22C55E]",
      iconSoftBg: "bg-[#22C55E]/20",
      title: t("auth.kycVerified"),
      description: t("auth.kycVerifiedDescription"),
      buttonText: isCheckingStatus ? t("auth.checking") : t("auth.check"),
      actionType: "check",
    };
  }

  if (kycStatus === KYC_STATUS.PENDING) {
    return {
      icon: <Clock size={30} strokeWidth={2.5} className="text-white" />,
      iconBg: "bg-[#F59E0B]",
      iconSoftBg: "bg-[#F59E0B]/20",
      title: t("auth.verificationPending"),
      description: t("auth.verificationPendingDescription"),
      buttonText: isCheckingStatus ? t("auth.checking") : t("auth.check"),
      actionType: "check",
    };
  }

  if (kycStatus === KYC_STATUS.FAILED) {
    return {
      icon: <X size={30} strokeWidth={2.5} className="text-white" />,
      iconBg: "bg-[#ff4d4f]",
      iconSoftBg: "bg-[#ff4d4f]/20",
      title: t("auth.verifyRejected"),
      description: t("auth.verifyRejectedDescription"),
      buttonText: t("auth.reSubmit"),
      actionType: "link",
      href: "/auth/kyc-resubmit",
    };
  }

  return {
    icon: <X size={30} strokeWidth={2.5} className="text-white" />,
    iconBg: "bg-[#ff4d4f]",
    iconSoftBg: "bg-[#ff4d4f]/20",
    title: t("auth.kycNotSubmitted"),
    description: t("auth.kycNotSubmittedDescription"),
    buttonText: t("auth.submitKyc"),
    actionType: "link",
    href: "/auth/kyc-resubmit",
  };
};

// skeleton loading
const KycCheckSkeleton = () => {
  return (
    <div>
      <AuthCommon>
        <div className="w-full sm:min-w-[455px] rounded-[14px] bg-white px-5 py-8 sm:px-7.5 sm:py-10">
          <div className="flex flex-col items-center text-center">
            <div className="h-[70px] w-[70px] rounded-full bg-grayish/10 animate-pulse" />
            <div className="mt-6 h-6 w-48 rounded-md bg-grayish/10 animate-pulse" />
            <div className="mt-3 h-4 w-full max-w-[320px] rounded-md bg-grayish/10 animate-pulse" />
            <div className="mt-10 h-[52px] w-full rounded-xl bg-grayish/10 animate-pulse" />
          </div>
        </div>
      </AuthCommon>
    </div>
  );
};

const KycCheck = () => {
  const router = useRouter();
  const t = useT();
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  const { data: user, isLoading: isUserLoading, refetch } = useGetUserQuery();

  const siteTwoFa = useSelector(
    (state) => state.settings.settings.fa_verification,
  );

  const userData = user?.data?.user ?? user?.data;
  const kycStatus = normalizeKycStatus(userData?.kyc);

  const content = useMemo(
    () => getStatusContent(kycStatus, isCheckingStatus, t),
    [kycStatus, isCheckingStatus, t],
  );

  const handleCheck = async () => {
    setIsCheckingStatus(true);

    try {
      const response = await refetch();
      const latestUserData = response?.data?.data?.user ?? response?.data?.data;
      const latestKycStatus = normalizeKycStatus(latestUserData?.kyc);

      if (latestKycStatus === KYC_STATUS.VERIFIED) {
        if (latestUserData?.two_fa === true && siteTwoFa === "1") {
          router.replace("/auth/verify-2fa");
        } else {
          router.replace("/dashboard");
        }
        return;
      }

      if (
        latestKycStatus === KYC_STATUS.NOT_SUBMITTED ||
        latestKycStatus === KYC_STATUS.FAILED
      ) {
        router.replace("/auth/kyc-resubmit");
        return;
      }
    } finally {
      setIsCheckingStatus(false);
    }
  };

  if (isUserLoading || isCheckingStatus) {
    return <KycCheckSkeleton />;
  }

  return (
    <div>
      <AuthCommon>
        <div className="w-full sm:min-w-[455px] rounded-[14px] bg-white px-5 py-8 sm:px-7.5 sm:py-10">
          <div className="flex flex-col items-center text-center">
            <div
              className={`flex h-[70px] w-[70px] items-center justify-center rounded-full ${content.iconSoftBg}`}
            >
              <div
                className={`flex h-[52px] w-[52px] items-center justify-center rounded-full ${content.iconBg}`}
              >
                {content.icon}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold text-heading">
                {content.title}
              </h3>

              <p className="mt-2 text-sm font-normal text-grayish/50">
                {content.description}
              </p>
            </div>

            <div className="mt-5 w-full">
              {content.actionType === "check" ? (
                <Button
                  type="button"
                  variant="primary-filled"
                  size="lg"
                  className="w-full"
                  rounded="lg"
                  onClick={handleCheck}
                >
                  {content.buttonText}
                </Button>
              ) : (
                <Button
                  href={content.href}
                  variant="primary-filled"
                  size="lg"
                  className="w-full"
                  rounded="lg"
                >
                  {content.buttonText}
                </Button>
              )}
            </div>
          </div>
        </div>
      </AuthCommon>
    </div>
  );
};

export default KycCheck;
