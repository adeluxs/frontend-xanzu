"use client";

import AuthCommon from "@/components/auth/AuthCommon";
import Button from "@/components/ui/button/Button";
import { useT } from "@/context/TranslationContext";
import { useTwoFaVerifyMutation } from "@/lib/features/auth/authApi";
import { useGetUserQuery } from "@/lib/features/user/userApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const VerifyTwoFa = () => {
  const [twoFaVerify, { isLoading }] = useTwoFaVerifyMutation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRefs = useRef([]);
  const router = useRouter();
  const t = useT();
  const { refetch: refetchUser } = useGetUserQuery();

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // handle change
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
    const pasted = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(pasted)) return;

    const digits = pasted.slice(0, 6).split("");
    const newOtp = [...otp];

    digits.forEach((d, i) => {
      if (i < 6) newOtp[i] = d;
    });

    setOtp(newOtp);
    const nextIndex = Math.min(digits.length, 5);
    inputRefs.current[nextIndex]?.focus();
    setActiveIndex(nextIndex);
  };

  // handle focus
  const handleFocus = (index) => {
    setActiveIndex(index);
  };

  // handle submit
  const handleSubmit = async () => {
    const code = otp.join("");
    try {
      await twoFaVerify({ code }).unwrap();
      const latestUser = await refetchUser().unwrap();
      const userData = latestUser?.data?.user ?? latestUser?.data;

      if (userData) {
        router.replace("/dashboard");
      }
    } catch (err) {}
  };

  return (
    <div>
      <AuthCommon>
        <div className="min-w-full sm:min-w-[455px] bg-white p-5 sm:p-7.5 rounded-[14px]">
          <h3 className="font-semibold text-2xl md:text-3xl text-grayish mb-5 md:mb-7.5">
            {t("auth.twoFaVerification")}
          </h3>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="mb-6">
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

            <div className="mt-4">
              <Button
                type="submit"
                variant="primary-filled"
                size="lg"
                className="w-full"
                rounded="lg"
                disabled={otp.some((d) => !d) || isLoading}
                loading={isLoading}
              >
                {isLoading ? t("auth.verifying") : t("auth.verify2fa")}
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

export default VerifyTwoFa;
