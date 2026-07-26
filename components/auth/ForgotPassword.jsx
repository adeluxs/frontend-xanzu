"use client";

import { useForgotPasswordOtpSendMutation } from "@/lib/features/auth/authApi";
import { encrypt } from "@/utils/crypto";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "../ui/button/Button";
import Input from "../ui/forms/input/InputField";
import Label from "../ui/forms/input/Label";
import AuthCommon from "./AuthCommon";
import { useT } from "@/context/TranslationContext";

const ForgotPassword = () => {
  const [
    forgotPasswordOtpSend,
    { data, isLoading, error: responseError, isSuccess: forgotPasswordSuccess },
  ] = useForgotPasswordOtpSendMutation();
  const [email, setEmail] = useState("");
  const router = useRouter();
  const t = useT();

  //handle submit
  const handleEmailOtpSend = async (e) => {
    e.preventDefault();

    try {
      const requestBody = {
        email: email,
      };

      await forgotPasswordOtpSend(requestBody).unwrap();
      const encryptedEmail = encrypt(email);
      const encodedEmail = encodeURIComponent(encryptedEmail);
      router.push(
        `/auth/login/verify-forgot-password-otp?email=${encodedEmail}`,
      );
    } catch (err) {}
  };

  return (
    <div>
      <AuthCommon>
        <div className="min-w-full sm:min-w-[455px] bg-white p-5 sm:p-7.5 rounded-[14px]">
          <h3 className="font-semibold text-2xl md:text-3xl text-grayish mb-5 md:mb-7.5">
            {t("auth.forgotPasswordTitle")}
          </h3>
          <form onSubmit={handleEmailOtpSend}>
            <div className="grid grid-cols-12 gap-4 sm:gap-5">
              <div className="col-span-12">
                <Label htmlFor="email" required>
                  {t("auth.emailAddress")}
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder={t("auth.enterEmail")}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
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

export default ForgotPassword;
