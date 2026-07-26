"use client";
import { useT } from "@/context/TranslationContext";
import { useEmailOtpSendMutation } from "@/lib/features/auth/authApi";
import { getCookie } from "@/utils/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "../ui/button/Button";
import AuthCommon from "./AuthCommon";

const VerifyEmail = () => {
  const [
    emailOtpSend,
    { data, isLoading, error: responseError, isSuccess: emailSendSuccess },
  ] = useEmailOtpSendMutation();
  const [email, setEmail] = useState("");
  const router = useRouter();
  const t = useT();

  const handleEmailOtpSend = async (e) => {
    e.preventDefault();

    const token = getCookie("token");

    try {
      await emailOtpSend({ token }).unwrap();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (emailSendSuccess) {
      router.push("/auth/verify-email-otp");
    }
  }, [emailSendSuccess, router]);

  return (
    <div>
      <AuthCommon>
        <div className="min-w-full sm:min-w-[455px] bg-white p-5 sm:p-7.5 rounded-[14px]">
          <h3 className="font-semibold text-2xl md:text-3xl text-grayish mb-5 md:mb-7.5">
            {t("auth.emailVerify")}
          </h3>
          <form onSubmit={handleEmailOtpSend}>
            <div className="grid grid-cols-12 gap-4 sm:gap-5">
              <div className="col-span-12">
                <div className="mt-4">
                  <Button
                    type="submit"
                    variant="primary-filled"
                    size="lg"
                    className="w-full"
                    rounded="lg"
                    disabled={isLoading}
                    loading={isLoading}
                  >
                    {isLoading
                      ? t("auth.sending")
                      : t("auth.sendVerificationCode")}
                  </Button>
                </div>
              </div>
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

export default VerifyEmail;
