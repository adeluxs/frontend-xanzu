"use client";

import { useT } from "@/context/TranslationContext";
import { EyeIcon, EyeSlashIcon } from "@/icons";
import { useRegisterMutation } from "@/lib/features/auth/authApi";
import {
  useGetAllCountryQuery,
  useGetRegisterSettingsQuery,
} from "@/lib/features/globalSettings/globalSettingsApi";
import { useGetUserQuery } from "@/lib/features/user/userApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Button from "../ui/button/Button";
import Checkbox from "../ui/forms/input/Checkbox";
import FileUpload from "../ui/forms/input/FileUpload";
import Input from "../ui/forms/input/InputField";
import Label from "../ui/forms/input/Label";
import ReactSelectInput from "../ui/forms/input/ReactSelect";
import TextArea from "../ui/forms/input/TextArea";
import AuthCommon from "./AuthCommon";
import SignUpSkeleton from "./Signupskeleton";

const parseRegisterSettings = (data = []) => {
  const raw = {};
  data.forEach(({ key, value }) => {
    raw[key] = value;
  });

  const buildField = (name) => ({
    show: raw[`merchant_${name}_show`] === "1",
    required: raw[`merchant_${name}_validation`] === "1",
  });

  const fieldConfig = {
    first_name: buildField("first_name"),
    last_name: buildField("last_name"),
    phone: buildField("phone"),
    country: buildField("country"),
    gender: buildField("gender"),
    username: {
      show: raw["merchant_username_show"] === "1",
      required: raw["merchant_username_validation"] === "1",
    },
    referral_code: {
      show: raw["merchant_referral_code_show"] === "1",
      required: raw["merchant_referral_code_validation"] === "1",
    },
  };

  const kycFields = Array.isArray(raw["kyc_fields"]) ? raw["kyc_fields"] : [];

  return { fieldConfig, kycFields };
};

const SignUp = () => {
  const router = useRouter();
  const t = useT();

  const { data: countriesData } = useGetAllCountryQuery();
  const { data: registerSettingsData } = useGetRegisterSettingsQuery();

  const [
    register,
    { isLoading, error: responseError, isSuccess: registerSuccess },
  ] = useRegisterMutation();

  const { data: user, isLoading: isUserLoading } = useGetUserQuery(undefined, {
    skip: !registerSuccess,
  });

  const siteTwoFa = useSelector(
    (state) => state.settings.settings.fa_verification,
  );
  const siteEmailVerification = useSelector(
    (state) => state.settings.settings.email_verification,
  );

  const [fieldConfig, setFieldConfig] = useState({});
  const [kycFields, setKycFields] = useState([]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [countryValue, setCountryValue] = useState("");
  const [genderValue, setGenderValue] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [terms, setTerms] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [kycValues, setKycValues] = useState({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!registerSettingsData?.data?.length) return;
    const { fieldConfig: fc, kycFields: kyc } = parseRegisterSettings(
      registerSettingsData.data,
    );
    setFieldConfig(fc);
    setKycFields(kyc);

    const init = {};
    kyc.forEach((f) => (init[f.id] = ""));
    setKycValues(init);
  }, [registerSettingsData]);

  useEffect(() => {
    if (registerSuccess && user && !isUserLoading) {
      const userData = user?.data?.user ?? user?.data;
      if (!userData) return;

      const kycStatus = Number(userData.kyc);

      if (
        siteEmailVerification === "1" &&
        userData.is_email_verified === false
      ) {
        router.push("/auth/verify-email");
      } else if (kycStatus === 2) {
        router.push("/auth/kyc-check");
      } else if ([0, 3].includes(kycStatus)) {
        router.push("/auth/kyc-resubmit");
      } else if (userData.two_fa === true && siteTwoFa === "1") {
        router.push("/auth/verify-2fa");
      } else {
        router.push("/dashboard");
      }
    }
  }, [
    registerSuccess,
    user,
    isUserLoading,
    router,
    siteEmailVerification,
    siteTwoFa,
  ]);

  const setKycValue = (id, value) =>
    setKycValues((prev) => ({ ...prev, [id]: value }));

  const countryOptions = useMemo(
    () =>
      countriesData?.data?.map((c) => ({
        value: c.name,
        label: c.name,
        dial_code: c.dial_code,
        selected: c.selected,
      })) ?? [],
    [countriesData],
  );

  useEffect(() => {
    if (!countryOptions.length || countryValue) return;
    const def = countryOptions.find((o) => o.selected) ?? countryOptions[0];
    if (def?.value) setCountryValue(def.value);
  }, [countryOptions, countryValue]);

  const selectedCountry = useMemo(
    () => countryOptions.find((o) => o.value === countryValue) ?? null,
    [countryOptions, countryValue],
  );

  const dialCode = selectedCountry?.dial_code ?? "";

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("first_name", firstName);
    payload.append("last_name", lastName);
    payload.append("email", email);
    payload.append("password", password);
    payload.append("password_confirmation", passwordConfirm);
    payload.append("i_agree", terms ? "1" : "0");

    if (fieldConfig?.username?.show || username)
      payload.append("username", username);
    if (fieldConfig?.phone?.show || phone)
      payload.append("phone", dialCode ? `${dialCode}${phone}` : phone);
    if (fieldConfig?.country?.show || countryValue)
      payload.append("country", countryValue ?? "");
    if (fieldConfig?.gender?.show || genderValue)
      payload.append("gender", genderValue ?? "");
    if (fieldConfig?.referral_code?.show || referralCode)
      payload.append("referral_code", referralCode);

    const missingFile = kycFields.find(
      (f) =>
        (f.type === "file" || f.type === "camera") &&
        f.validation === "required" &&
        !kycValues[f.id],
    );
    if (missingFile) {
      toast.error(`${missingFile.title} is required.`);
      return;
    }

    kycFields.forEach((f) => {
      const val = kycValues[f.id];
      if (f.validation === "required" && !val) return;
      const key = `kyc_fields[${f.id}]`;
      if (f.type === "file" || f.type === "camera") {
        if (val) payload.append(key, val);
      } else {
        payload.append(key, val ?? "");
      }
    });

    register(payload);
  };

  const renderKycField = (field) => {
    const val = kycValues[field.id] ?? "";
    const isRequired = field.validation === "required";
    const colSpan =
      field.type === "textarea" ||
      field.type === "file" ||
      field.type === "camera"
        ? "col-span-2 2xl:col-span-12"
        : "col-span-2 2xl:col-span-6";

    return (
      <div className={colSpan} key={field.id}>
        <Label required={isRequired}>{field.title}</Label>

        {field.type === "text" && (
          <Input
            type="text"
            placeholder={`Enter ${field.title}`}
            value={val}
            onChange={(e) => setKycValue(field.id, e.target.value)}
            required={isRequired}
          />
        )}

        {field.type === "textarea" && (
          <TextArea
            placeholder={`Enter ${field.title}`}
            value={val}
            onChange={(e) => setKycValue(field.id, e.target.value)}
            required={isRequired}
            rows={4}
          />
        )}

        {(field.type === "file" || field.type === "camera") && (
          <FileUpload
            accept="image/*"
            capture={field.type === "camera" ? "environment" : undefined}
            maxSizeMB={2}
            onChange={(files) => setKycValue(field.id, files?.[0] || null)}
            multiple={false}
          />
        )}

        {field.type === "date" && (
          <Input
            type="date"
            value={val}
            onChange={(e) => setKycValue(field.id, e.target.value)}
            required={isRequired}
          />
        )}

        {field?.description && (
          <p className="mt-1 text-xs text-grayish/60">{field.description}</p>
        )}
      </div>
    );
  };

  const isSettingsLoading = !registerSettingsData;

  return (
    <div>
      <AuthCommon>
        {isSettingsLoading ? (
          <SignUpSkeleton />
        ) : (
          <div className="min-w-full sm:min-w-[480px] 2xl:min-w-[645px] bg-white p-5 sm:p-7.5 rounded-[14px]">
            <h3 className="font-semibold text-2xl md:text-3xl text-grayish mb-5 md:mb-7.5">
              {t("auth.createAccount")}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 2xl:grid-cols-12 gap-4 sm:gap-5">
                {fieldConfig?.first_name?.show !== false && (
                  <div className="col-span-2 2xl:col-span-6">
                    <Label
                      htmlFor="first-name"
                      required={fieldConfig.first_name?.required}
                    >
                      {t("auth.firstName")}
                    </Label>
                    <Input
                      type="text"
                      id="first-name"
                      placeholder={t("auth.enterFirstName")}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required={fieldConfig.first_name?.required}
                    />
                  </div>
                )}

                {fieldConfig?.last_name?.show !== false && (
                  <div className="col-span-2 2xl:col-span-6">
                    <Label
                      htmlFor="last-name"
                      required={fieldConfig.last_name?.required}
                    >
                      {t("auth.lastName")}
                    </Label>
                    <Input
                      type="text"
                      id="last-name"
                      placeholder={t("auth.enterLastName")}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required={fieldConfig.last_name?.required}
                    />
                  </div>
                )}

                <div className="col-span-2 2xl:col-span-6">
                  <Label htmlFor="email" required>
                    {t("auth.email")}
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    placeholder={t("auth.enterEmail")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {fieldConfig?.username?.show && (
                  <div className="col-span-2 2xl:col-span-6">
                    <Label
                      htmlFor="username"
                      required={fieldConfig.username.required}
                    >
                      {t("auth.username")}
                    </Label>
                    <Input
                      type="text"
                      id="username"
                      placeholder={t("auth.enterUsername")}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required={fieldConfig.username.required}
                    />
                  </div>
                )}

                {fieldConfig?.country?.show && (
                  <div className="col-span-2 2xl:col-span-6">
                    <Label required={fieldConfig.country.required}>
                      {t("auth.country")}
                    </Label>
                    <ReactSelectInput
                      options={countryOptions}
                      placeholder={t("auth.selectCountry")}
                      value={countryValue}
                      onChange={(val) => setCountryValue(val)}
                      formatOptionLabel={(option) => (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {option.label}
                          </span>
                        </div>
                      )}
                    />
                  </div>
                )}

                {fieldConfig?.phone?.show && (
                  <div className="col-span-2 2xl:col-span-6">
                    <Label
                      htmlFor="phone"
                      required={fieldConfig.phone.required}
                    >
                      {t("auth.phone")}
                    </Label>
                    <div className="relative">
                      <Input
                        type="text"
                        id="phone"
                        placeholder={t("auth.enterPhone")}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required={fieldConfig.phone.required}
                        className="pl-14"
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium text-grayish/60">
                            {dialCode}
                          </span>
                          {dialCode && (
                            <span className="text-sm font-medium text-grayish/60">
                              |
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {fieldConfig?.gender?.show && (
                  <div className="col-span-2 2xl:col-span-6">
                    <Label required={fieldConfig.gender.required}>
                      {t("auth.gender")}
                    </Label>
                    <ReactSelectInput
                      options={genderOptions}
                      value={genderValue}
                      onChange={(val) => setGenderValue(val)}
                      placeholder={t("auth.selectGender")}
                    />
                  </div>
                )}

                {kycFields.map((field) => renderKycField(field))}

                <div className="col-span-2 2xl:col-span-6">
                  <Label htmlFor="password" required>
                    {t("auth.password")}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder={t("auth.enterPassword")}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pr-12"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? <EyeIcon /> : <EyeSlashIcon />}
                    </span>
                  </div>
                </div>

                <div className="col-span-2 2xl:col-span-6">
                  <Label htmlFor="confirm-password" required>
                    {t("auth.confirmPassword")}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirm-password"
                      placeholder={t("auth.enterConfirmPassword")}
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      required
                      className="pr-12"
                    />
                    <span
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showConfirmPassword ? <EyeIcon /> : <EyeSlashIcon />}
                    </span>
                  </div>
                </div>

                <div className="col-span-2 2xl:col-span-12">
                  <Checkbox
                    id="terms"
                    checked={terms}
                    onChange={(e) => setTerms(e)}
                    label={
                      <span className="text-sm text-grayish/70">
                        {t("auth.iAgreeToThe")}{" "}
                        <Link
                          href="/terms-and-condition"
                          className="text-grayish hover:underline font-medium"
                        >
                          {t("auth.termsAndConditions")}
                        </Link>
                      </span>
                    }
                  />
                </div>

                <div className="col-span-2 2xl:col-span-12">
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
                      ? t("auth.creatingAccount")
                      : t("auth.signUpButton")}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-6 sm:mt-10">
              <p className="text-center font-normal text-grayish/50">
                {t("auth.alreadyHaveAnAccount")}{" "}
                <Link
                  className="font-medium text-grayish hover:!underline"
                  href="/auth/login"
                >
                  {t("auth.signIn")}
                </Link>
              </p>
            </div>
          </div>
        )}
      </AuthCommon>
    </div>
  );
};

export default SignUp;
