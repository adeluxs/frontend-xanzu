"use client";

import { useT } from "@/context/TranslationContext";
import {
  useKycDetailsQuery,
  useReRegisterMutation,
} from "@/lib/features/auth/authApi";
import {
  useGetAllCountryQuery,
  useGetRegisterSettingsQuery,
} from "@/lib/features/globalSettings/globalSettingsApi";
import { useGetUserQuery } from "@/lib/features/user/userApi";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import Button from "../ui/button/Button";
import FileUpload from "../ui/forms/input/FileUpload";
import Input from "../ui/forms/input/InputField";
import Label from "../ui/forms/input/Label";
import ReactSelectInput from "../ui/forms/input/ReactSelect";
import TextArea from "../ui/forms/input/TextArea";
import AuthCommon from "./AuthCommon";
import SignUpSkeleton from "./Signupskeleton";

// register settings parse function
const parseRegisterSettings = (data = []) => {
  const raw = {};
  data.forEach(({ key, value }) => {
    raw[key] = value;
  });

  const buildField = (name) => ({
    show: raw[`merchant_${name}_show`] === "1",
    required: raw[`merchant_${name}_validation`] === "1",
  });

  // field config
  const fieldConfig = {
    first_name: buildField("first_name"),
    last_name: buildField("last_name"),
    phone: buildField("phone"),
    country: buildField("country"),
    gender: buildField("gender"),
    username: {
      show: raw.merchant_username_show === "1",
      required: raw.merchant_username_validation === "1",
    },
    referral_code: {
      show: raw.merchant_referral_code_show === "1",
      required: raw.merchant_referral_code_validation === "1",
    },
  };

  return { fieldConfig };
};

const KycResubmit = () => {
  const t = useT();
  const router = useRouter();
  const hasRedirectedRef = useRef(false);

  const { data: user, isLoading: isUserLoading } = useGetUserQuery();
  const {
    data: kycHistory,
    isLoading: isKycHistoryLoading,
    isFetching: isKycHistoryFetching,
  } = useKycDetailsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const { data: registerSettingsData } = useGetRegisterSettingsQuery();
  const { data: countriesData } = useGetAllCountryQuery();

  const [reRegister, { isLoading: isSubmitting, isSuccess: isSubmitSuccess }] =
    useReRegisterMutation();

  const [fieldConfig, setFieldConfig] = useState({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [countryValue, setCountryValue] = useState("");
  const [genderValue, setGenderValue] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [kycValues, setKycValues] = useState({});

  const userData = user?.data?.user ?? user?.data;
  const latestKycHistory = kycHistory?.data?.[0];
  const latestKycData = latestKycHistory?.data ?? {};
  const kycFields = latestKycHistory?.orgKyc?.fields ?? [];
  const rejectionReason = isKycHistoryFetching
    ? ""
    : kycHistory?.meta?.last_rejection_reason;

  useEffect(() => {
    if (!registerSettingsData?.data?.length) return;
    const { fieldConfig: nextFieldConfig } = parseRegisterSettings(
      registerSettingsData.data,
    );
    setFieldConfig(nextFieldConfig);
  }, [registerSettingsData]);

  useEffect(() => {
    if (!userData) return;

    setFirstName(userData.first_name ?? "");
    setLastName(userData.last_name ?? "");
    setEmail(userData.email ?? "");
    setUsername(userData.username ?? "");
    setPhone(userData.phone ?? "");
    setCountryValue(userData.country ?? "");
    setGenderValue(userData.gender ?? "");
    setReferralCode(userData.referral_code ?? "");
  }, [userData]);

  useEffect(() => {
    if (!kycFields.length) return;

    const nextKycValues = {};
    kycFields.forEach((field) => {
      nextKycValues[field.id] = latestKycData?.[field.name] ?? "";
    });
    setKycValues(nextKycValues);
  }, [kycFields, latestKycData]);

  const countryOptions = useMemo(
    () =>
      countriesData?.data?.map((country) => ({
        value: country.name,
        label: country.name,
        dial_code: country.dial_code,
        selected: country.selected,
      })) ?? [],
    [countriesData],
  );

  useEffect(() => {
    if (!countryOptions.length || countryValue) return;
    const defaultCountry =
      countryOptions.find((option) => option.selected) ?? countryOptions[0];
    if (defaultCountry?.value) {
      setCountryValue(defaultCountry.value);
    }
  }, [countryOptions, countryValue]);

  const selectedCountry = useMemo(
    () =>
      countryOptions.find((option) => option.value === countryValue) ?? null,
    [countryOptions, countryValue],
  );

  const dialCode = selectedCountry?.dial_code ?? "";

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  useEffect(() => {
    if (isSubmitSuccess && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
      router.replace("/auth/kyc-check");
    }
  }, [isSubmitSuccess, router]);

  const setKycValue = (id, value) =>
    setKycValues((prev) => ({ ...prev, [id]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("first_name", firstName);
    payload.append("last_name", lastName);
    payload.append("email", email);

    if (fieldConfig?.username?.show || username) {
      payload.append("username", username);
    }

    if (fieldConfig?.phone?.show || phone) {
      const normalizedPhone =
        dialCode && phone && !phone.startsWith(dialCode)
          ? `${dialCode}${phone}`
          : phone;
      payload.append("phone", normalizedPhone ?? "");
    }

    if (fieldConfig?.country?.show || countryValue) {
      payload.append("country", countryValue ?? "");
    }

    if (fieldConfig?.gender?.show || genderValue) {
      payload.append("gender", genderValue ?? "");
    }

    if (fieldConfig?.referral_code?.show || referralCode) {
      payload.append("referral_code", referralCode ?? "");
    }

    const missingFile = kycFields.find((field) => {
      const value = kycValues[field.id];
      return (
        (field.type === "file" || field.type === "camera") &&
        field.validation === "required" &&
        !value
      );
    });

    if (missingFile) {
      toast.error(`${missingFile.title} is required.`);
      return;
    }

    kycFields.forEach((field) => {
      const value = kycValues[field.id];
      if (field.validation === "required" && !value) return;

      const key = `kyc_fields[${field.id}]`;

      if (field.type === "file" || field.type === "camera") {
        if (value instanceof File) {
          payload.append(key, value);
        }
      } else {
        payload.append(key, value ?? "");
      }
    });

    reRegister(payload);
  };

  const renderKycField = (field) => {
    const value = kycValues[field.id] ?? "";
    const isRequired = field.validation === "required";
    const isFileField = field.type === "file" || field.type === "camera";
    const colSpan =
      field.type === "textarea" || isFileField
        ? "col-span-2 2xl:col-span-12"
        : "col-span-2 2xl:col-span-6";

    return (
      <div className={colSpan} key={field.id}>
        <Label required={isRequired}>{field.title}</Label>

        {field.type === "text" && (
          <Input
            type="text"
            placeholder={`Enter ${field.title}`}
            value={value}
            onChange={(e) => setKycValue(field.id, e.target.value)}
            required={isRequired}
          />
        )}

        {field.type === "textarea" && (
          <TextArea
            placeholder={`Enter ${field.title}`}
            value={value}
            onChange={(e) => setKycValue(field.id, e.target.value)}
            required={isRequired}
            rows={4}
          />
        )}

        {isFileField && (
          <FileUpload
            accept="image/*"
            capture={field.type === "camera" ? "environment" : undefined}
            maxSizeMB={2}
            multiple={false}
            defaultValue={typeof value === "string" && value ? [value] : []}
            onChange={(files) => setKycValue(field.id, files?.[0] || null)}
          />
        )}

        {field.type === "date" && (
          <Input
            type="date"
            value={value}
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
  const isLoading = isUserLoading || isKycHistoryLoading || isSettingsLoading;

  if (isLoading) {
    return (
      <div>
        <AuthCommon>
          <SignUpSkeleton />
        </AuthCommon>
      </div>
    );
  }

  return (
    <div>
      <AuthCommon>
        <div className="min-w-full sm:min-w-[480px] 2xl:min-w-[645px] bg-white p-5 sm:p-7.5 rounded-[14px]">
          <h3
            className={`font-semibold text-2xl md:text-3xl text-grayish ${rejectionReason ? "mb-2" : "mb-5 md:mb-7.5"}`}
          >
            {t("auth.reSubmitKyc")}
          </h3>
          {rejectionReason && (
            <p className="text-base font-medium text-grayish/60 mb-5">
              <span className="text-grayish">{t("auth.rejectionReason")}:</span>{" "}
              {rejectionReason}
            </p>
          )}

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
                  readOnly
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
                    onChange={(value) => setCountryValue(value)}
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
                  <Label htmlFor="phone" required={fieldConfig.phone.required}>
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
                    onChange={(value) => setGenderValue(value)}
                    placeholder={t("auth.selectGender")}
                  />
                </div>
              )}

              {/* {fieldConfig?.referral_code?.show && (
                <div className="col-span-2 2xl:col-span-6">
                  <Label
                    htmlFor="referral-code"
                    required={fieldConfig.referral_code.required}
                  >
                    {t("auth.referralCode")}
                  </Label>
                  <Input
                    type="text"
                    id="referral-code"
                    placeholder={t("auth.referralCode")}
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    required={fieldConfig.referral_code.required}
                  />
                </div>
              )} */}

              {kycFields.map((field) => renderKycField(field))}

              <div className="col-span-2 2xl:col-span-12">
                <Button
                  type="submit"
                  variant="primary-filled"
                  size="lg"
                  className="w-full"
                  rounded="lg"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  {isSubmitting ? t("auth.submitting") : t("auth.reSubmit")}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </AuthCommon>
    </div>
  );
};

export default KycResubmit;
