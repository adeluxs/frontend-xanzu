"use client";

import { EyeIcon, EyeSlashIcon } from "@/icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "../ui/button/Button";
import Checkbox from "../ui/forms/input/Checkbox";
import Input from "../ui/forms/input/InputField";
import Label from "../ui/forms/input/Label";
import AuthCommon from "./AuthCommon";

import { useT } from "@/context/TranslationContext";
import { useLoginMutation } from "@/lib/features/auth/authApi";
import { useGetUserQuery } from "@/lib/features/user/userApi";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [formValidError, setFormValidError] = useState({});
  const [login, { isLoading, isSuccess: loginSuccess }] = useLoginMutation();
  const { data: user, isLoading: isUserLoading } = useGetUserQuery(undefined, {
    skip: !loginSuccess,
  });
  const router = useRouter();
  const siteTwoFa = useSelector(
    (state) => state.settings.settings.fa_verification,
  );
  const siteEmailVerification = useSelector(
    (state) => state.settings.settings.email_verification,
  );

  const t = useT();

  // form verification
  const handleFormValidation = () => {
    let newErrors = {};

    if (!form.email) {
      newErrors.email = "Please fill Email";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    if (!form.password) {
      newErrors.password = "Please fill Password";
    }

    setFormValidError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // handle submit login
  const handleLoginSubmit = (e) => {
    e.preventDefault();

    if (!handleFormValidation()) return;

    login({
      email: form.email,
      password: form.password,
      remember_me: form.rememberMe,
    });
  };

  // decide where to go after login
  useEffect(() => {
    if (loginSuccess && user && !isUserLoading) {
      const userData = user?.data?.user ?? user?.data;

      if (userData) {
        const kycStatus = Number(userData.kyc);

        if (
          siteEmailVerification === "1" &&
          userData.is_email_verified === false
        ) {
          router.push("/auth/verify-email");
          return;
        } else if (kycStatus === 2) {
          router.push("/auth/kyc-check");
        } else if ([0, 3].includes(kycStatus)) {
          router.push("/auth/kyc-resubmit");
        } else if (userData.two_fa === true && siteTwoFa === "1") {
          router.push("/auth/verify-2fa");
        } else {
          // toast.success("Login successful!");
          router.push("/dashboard");
        }
      }
    }
  }, [
    loginSuccess,
    user,
    isUserLoading,
    router,
    siteEmailVerification,
    siteTwoFa,
  ]);

  return (
    <div>
      <AuthCommon>
        <div className="min-w-full sm:min-w-[455px] bg-white p-5 sm:p-7.5 rounded-[14px]">
          <h3 className="font-semibold text-2xl md:text-3xl text-grayish mb-5 md:mb-7.5">
            {t("auth.login")}
          </h3>

          <form onSubmit={handleLoginSubmit}>
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
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                {formValidError.email && (
                  <p className="mt-1.5 text-xs font-medium text-error">
                    {formValidError.email}
                  </p>
                )}
              </div>

              <div className="col-span-12">
                <Label htmlFor="password" required>
                  {t("auth.password")}
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className="rtl:pl-12 ltr:pr-12"
                    placeholder={t("auth.enterPassword")}
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? <EyeIcon /> : <EyeSlashIcon />}
                  </span>
                </div>

                {formValidError.password && (
                  <p className="mt-1.5 text-xs font-medium text-error">
                    {formValidError.password}
                  </p>
                )}

                <div className="flex flex-wrap justify-between items-center gap-2 mt-2.5">
                  <Checkbox
                    id="terms"
                    label={t("auth.rememberMe")}
                    checked={form.rememberMe}
                    onChange={(e) => setForm({ ...form, rememberMe: e })}
                  />

                  <Link
                    href="/auth/login/forgot-password"
                    className="text-grayish text-sm font-semibold hover:!underline"
                  >
                    {t("auth.forgotPassword")}
                  </Link>
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
                    {isLoading ? t("auth.loggingIn") : t("auth.loginButton")}
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

export default SignIn;
