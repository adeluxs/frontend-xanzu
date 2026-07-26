"use client";

import { useT } from "@/context/TranslationContext";
import {
  useEmailOtpSendMutation,
  useEmailOtpVerifyMutation,
} from "@/lib/features/auth/authApi";
import { useGetUserQuery } from "@/lib/features/user/userApi";
import { decrypt } from "@/utils/crypto";
import { formatTime, getCookie } from "@/utils/utils";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Button from "../ui/button/Button";
import AuthCommon from "./AuthCommon";

const VerifyEmailOtp = () => {
  const [emailOtpVerify, { isLoading, isSuccess: verifySuccess }] =
    useEmailOtpVerifyMutation();
  const [emailOtpSend, { isLoading: isResending }] = useEmailOtpSendMutation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const inputRefs = useRef([]);
  const searchParams = useSearchParams();
  const encryptedEmail = searchParams.get("email");
  const email = encryptedEmail
    ? decrypt(decodeURIComponent(encryptedEmail))
    : null;
  const router = useRouter();
  const { data: user, isLoading: isUserLoading } = useGetUserQuery(undefined, {
    skip: !verifySuccess,
  });
  const siteTwoFa = useSelector(
    (state) => state.settings.settings.fa_verification,
  );
  const t = useT();

  // input ref
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // time left
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsResendDisabled(false);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // handle change
  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
      setActiveIndex(index + 1);
    }
  };

  // handle keydown
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setActiveIndex(index - 1);
    }
  };

  // handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pasted)) return;
    const newOtp = pasted.split("");
    setOtp([...newOtp, "", "", "", "", ""].slice(0, 6));
    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
    setActiveIndex(nextIndex);
  };

  //handle focus
  const handleFocus = (index) => setActiveIndex(index);

  // handle otp submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length < 6) return;
    try {
      await emailOtpVerify({ email, otp: otpValue }).unwrap();
    } catch (err) {
      console.log(err);
    }
  };

  // handle resend otp
  const handleResendOtp = async () => {
    const token = getCookie("token");
    try {
      await emailOtpSend({ token }).unwrap();
      setTimeLeft(120);
      setIsResendDisabled(true);
    } catch (err) {
      console.log(err);
    }
  };

  // after verify email
  useEffect(() => {
    if (verifySuccess && user && !isUserLoading) {
      const userData = user?.data?.user ?? user?.data;
      if (userData.kyc === 0 && userData.kyc === 2 && userData.kyc === 3) {
        router.push("/auth/kyc-check");
      } else if (userData?.two_fa === true && siteTwoFa === "1") {
        router.push("/auth/verify-2fa");
      } else {
        router.push("/dashboard");
      }
    }
  }, [verifySuccess, user, isUserLoading, router, siteTwoFa]);

  return (
    <div>
      <AuthCommon>
        <div className="min-w-full sm:min-w-[455px] bg-white p-5 sm:p-7.5 rounded-[14px]">
          <h3 className="font-semibold text-2xl md:text-3xl text-grayish mb-5 md:mb-7.5">
            {t("auth.otpVerification")}
          </h3>

          <form onSubmit={handleSubmit}>
            <p className="text-center font-medium text-sm text-grayish/60 mb-5">
              {t("auth.otpIn")}:{" "}
              <span className="text-grayish font-semibold">
                {formatTime(timeLeft)}
              </span>
            </p>
            <div className="flex gap-1 sm:gap-2 justify-between px-0 sm:px-10.5 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  onFocus={() => handleFocus(index)}
                  className={`h-9 sm:w-12 w-9 sm:h-12 text-center text-sm font-semibold border-2 rounded-[10px] sm:rounded-[14px] ${
                    activeIndex === index
                      ? "border-primary"
                      : "border-grayish/16 bg-[rgba(7,33,38,0.04)]"
                  }`}
                />
              ))}
            </div>

            <div className="flex justify-center gap-2 mb-6">
              <p className="text-sm text-grayish/60 mt-0.5">
                {t("auth.dontReceiveOtp")}
              </p>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResendDisabled || isResending}
                className={`font-semibold ${
                  isResendDisabled || isResending
                    ? "text-grayish/80 !cursor-not-allowed"
                    : "text-primary hover:underline"
                }`}
              >
                {isResending ? t("auth.sending") : t("auth.resendOtp")}
              </button>
            </div>

            <Button
              type="submit"
              variant="primary-filled"
              size="lg"
              className="w-full"
              rounded="lg"
              disabled={otp.some((d) => !d) || isLoading}
              loading={isLoading}
            >
              {isLoading ? t("auth.verifying") : t("auth.verifyOtp")}
            </Button>
          </form>

          <div className="mt-6 sm:mt-10">
            <p className="text-center text-grayish/50">
              {t("auth.dontHaveAccount")}{" "}
              <Link
                href="/auth/register"
                className="font-medium hover:underline"
              >
                {t("auth.signUp")}
              </Link>
            </p>
          </div>
        </div>
      </AuthCommon>
    </div>
  );
};

export default VerifyEmailOtp;
