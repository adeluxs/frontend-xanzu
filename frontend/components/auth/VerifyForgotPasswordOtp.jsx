"use client";

import { useT } from "@/context/TranslationContext";
import {
  useForgotPasswordOtpSendMutation,
  useForgotPasswordOtpVerifyMutation,
} from "@/lib/features/auth/authApi";
import { decrypt } from "@/utils/crypto";
import { formatTime } from "@/utils/utils";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Button from "../ui/button/Button";
import AuthCommon from "./AuthCommon";

const VerifyForgotPasswordOtp = () => {
  const [forgotPasswordOtpSend, { isLoading: resendIsLoading }] =
    useForgotPasswordOtpSendMutation();
  const [forgotPasswordOtpVerify, { isLoading }] =
    useForgotPasswordOtpVerifyMutation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRefs = useRef([]);
  const searchParams = useSearchParams();
  const encryptedEmail = searchParams.get("email");
  const decodedEmail = encryptedEmail
    ? decodeURIComponent(encryptedEmail)
    : null;
  const email = decrypt(decodedEmail);
  const router = useRouter();
  const TIMER_DURATION = 120;
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const t = useT();

  // Timer
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

  // Focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Handle input change
  const handleChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
      setActiveIndex(index + 1);
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setActiveIndex(index - 1);
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();

    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.slice(0, 6).split("");
    const newOtp = [...otp];

    digits.forEach((digit, index) => {
      if (index < 6) newOtp[index] = digit;
    });

    setOtp(newOtp);
    const nextIndex = Math.min(digits.length, 5);
    inputRefs.current[nextIndex]?.focus();
    setActiveIndex(nextIndex);
  };

  const handleFocus = (index) => {
    setActiveIndex(index);
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (isResendDisabled) return;

    try {
      await forgotPasswordOtpSend({ email }).unwrap();
      setTimeLeft(TIMER_DURATION);
      setIsResendDisabled(true);
    } catch (err) {}
  };

  // Verify OTP
  const handleSubmit = async () => {
    const otpValue = otp.join("");

    try {
      await forgotPasswordOtpVerify({
        email,
        otp: otpValue,
      }).unwrap();

      router.push(
        `/auth/login/reset-password?email=${encodeURIComponent(
          encryptedEmail,
        )}&otp=${encodeURIComponent(otpValue)}`,
      );
    } catch (err) {}
  };

  return (
    <div>
      <AuthCommon>
        <div className="min-w-full sm:min-w-[455px] bg-white p-5 sm:p-7.5 rounded-[14px]">
          <h3 className="font-semibold text-2xl md:text-3xl text-grayish mb-5 md:mb-7.5">
            {t("auth.otpVerification")}
          </h3>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="mb-6">
              <p className="text-center font-medium text-sm text-grayish/60 mb-5">
                {t("auth.otpIn")} :{" "}
                <span className="text-grayish font-semibold">
                  {formatTime(timeLeft)}
                </span>
              </p>

              <div className="flex gap-1 sm:gap-2 justify-between px-0 sm:px-10.5">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    onFocus={() => handleFocus(index)}
                    className={`h-9 sm:w-12 w-9 sm:h-12 text-center text-sm font-semibold border-2 rounded-[10px] sm:rounded-[14px] focus:outline-none transition-colors ${
                      activeIndex === index
                        ? "border-primary"
                        : "border-grayish/16 bg-[rgba(7,33,38,0.04)]"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-center gap-2">
                <p className="text-center font-medium text-sm text-grayish/60">
                  {t("auth.dontReceiveOtp")}
                </p>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResendDisabled || resendIsLoading}
                  className={`font-semibold transition ${
                    isResendDisabled
                      ? "text-grayish/80 !cursor-not-allowed"
                      : "text-primary hover:!underline"
                  }`}
                >
                  {resendIsLoading ? t("auth.sending") : t("auth.resendOtp")}
                </button>
              </div>
            </div>

            <div className="mt-4">
              <Button
                type="submit"
                variant="primary-filled"
                size="lg"
                className="w-full"
                rounded="lg"
                disabled={otp.some((digit) => !digit) || isLoading}
                loading={isLoading}
              >
                {isLoading ? t("auth.verifying") : t("auth.verifyOtp")}
              </Button>
            </div>
          </form>

          <div className="mt-6 sm:mt-10">
            <p className="text-center font-normal text-grayish/50">
              {t("auth.dontHaveAccount")}{" "}
              <Link
                className="font-medium text-grayish hover:!underline"
                href="/auth/register"
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

export default VerifyForgotPasswordOtp;
