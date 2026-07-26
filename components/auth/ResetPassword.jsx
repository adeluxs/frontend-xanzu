"use client";

import { useT } from "@/context/TranslationContext";
import { EyeIcon, EyeSlashIcon } from "@/icons";
import { useResetPasswordMutation } from "@/lib/features/auth/authApi";
import { decrypt } from "@/utils/crypto";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Button from "../ui/button/Button";
import Input from "../ui/forms/input/InputField";
import Label from "../ui/forms/input/Label";
import AuthCommon from "./AuthCommon";

const ResetPassword = () => {
  const [
    resetPassword,
    { isLoading, error: responseError, isSuccess: resetPasswordSuccess },
  ] = useResetPasswordMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const searchParams = useSearchParams();
  const encryptedEmail = searchParams.get("email");
  const decodedEmail = encryptedEmail
    ? decodeURIComponent(encryptedEmail)
    : null;
  const email = decrypt(decodedEmail);
  const otp = searchParams.get("otp");
  const router = useRouter();
  const t = useT();

  // Submit handler
  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const requestBody = {
      email,
      otp,
      password,
      password_confirmation: confirmPassword,
    };
    resetPassword(requestBody);
  };

  // Success handling
  useEffect(() => {
    if (resetPasswordSuccess) {
      router.push("/auth/login");
    }
  }, [resetPasswordSuccess, router]);

  return (
    <div>
      <AuthCommon>
        <div className="min-w-full sm:min-w-[455px] bg-white p-5 sm:p-7.5 rounded-[14px]">
          <h3 className="font-semibold text-2xl md:text-3xl text-grayish mb-5 md:mb-7.5">
            {t("auth.resetPassword")}
          </h3>

          <form onSubmit={handleResetPassword}>
            <div className="grid grid-cols-12 gap-4 sm:gap-5">
              <div className="col-span-12">
                <Label htmlFor="password" required>
                  {t("auth.password")}
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder={t("auth.enterPassword")}
                    required
                    className="pr-12"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? <EyeIcon /> : <EyeSlashIcon />}
                  </span>
                </div>
              </div>

              <div className="col-span-12">
                <Label htmlFor="confirm-password" required>
                  {t("auth.confirmPassword")}
                </Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm-password"
                    placeholder={t("auth.enterConfirmPassword")}
                    required
                    className="pr-12"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <span
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showConfirmPassword ? <EyeIcon /> : <EyeSlashIcon />}
                  </span>
                </div>
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
                    {isLoading ? t("auth.resetting") : t("auth.passwordReset")}
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

export default ResetPassword;
