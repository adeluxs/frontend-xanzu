"use client";
import Button from "@/components/ui/button/Button";
import FileUpload from "@/components/ui/forms/input/FileUpload";
import Input from "@/components/ui/forms/input/InputField";
import Label from "@/components/ui/forms/input/Label";
import ReactSelectInput from "@/components/ui/forms/input/ReactSelect";
import { useT } from "@/context/TranslationContext";
import {
  useGetAllCountryQuery,
  useGetRegisterSettingsQuery,
} from "@/lib/features/globalSettings/globalSettingsApi";
import {
  useGetUserQuery,
  useUpdateUserMutation,
} from "@/lib/features/user/userApi";
import { useEffect, useMemo, useRef, useState } from "react";
import AccountSettingsSkeleton from "./AccountSettingsSkeleton";

const parseRegisterSettings = (data = []) => {
  const raw = {};
  data.forEach(({ key, value }) => {
    raw[key] = value;
  });

  const buildField = (name) => ({
    show: raw[`merchant_${name}_show`] === "1",
    required: raw[`merchant_${name}_validation`] === "1",
  });

  return {
    first_name: buildField("first_name"),
    last_name: buildField("last_name"),
    phone: buildField("phone"),
    country: buildField("country"),
    gender: buildField("gender"),
    username: {
      show: raw["merchant_username_show"] === "1",
      required: raw["merchant_username_validation"] === "1",
    },
  };
};

// Strip a dial code prefix from a stored phone string if present
const stripDialCode = (phone = "", dialCode = "") => {
  if (!dialCode || !phone) return phone;
  const stripped = phone.replace(/\s+/g, "");
  const code = dialCode.replace(/\s+/g, "");
  if (stripped.startsWith(code)) return stripped.slice(code.length);
  return stripped;
};

const AccountSettings = () => {
  const fileInputRef = useRef(null);
  const { data: user, isLoading: isUserLoading } = useGetUserQuery();
  const { data: countriesData, isLoading: isCountriesLoading } =
    useGetAllCountryQuery();
  const { data: registerSettingsData, isLoading: isSettingsLoading } =
    useGetRegisterSettingsQuery();
  const isLoading = isUserLoading || isCountriesLoading || isSettingsLoading;
  const [updateUser, { isLoading: isUpdateUserLoading }] =
    useUpdateUserMutation();
  const [fieldConfig, setFieldConfig] = useState({});
  const [avatar, setAvatar] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [countryValue, setCountryValue] = useState("");
  const [genderValue, setGenderValue] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const t = useT();

  useEffect(() => {
    if (!registerSettingsData?.data?.length) return;
    setFieldConfig(parseRegisterSettings(registerSettingsData.data));
  }, [registerSettingsData]);

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

  const selectedCountry = useMemo(
    () => countryOptions.find((o) => o.value === countryValue) ?? null,
    [countryOptions, countryValue],
  );

  const dialCode = selectedCountry?.dial_code ?? "";

  // Load user data
  useEffect(() => {
    if (!user?.data || !countriesData?.data) return;
    const u = user.data;

    setAvatar(u.avatar || "");
    setFirstName(u.first_name || "");
    setLastName(u.last_name || "");
    setEmail(u.email || "");
    setUsername(u.username || "");
    setCountryValue(u.country || "");
    setGenderValue(u.gender || "");
    setAddress(u.address || "");
    setCity(u.city || "");
    setZip(u.zip || "");
    setDateOfBirth(u.date_of_birth || "");
    const savedCountry = countriesData.data.find((c) => c.name === u.country);
    const savedDialCode = savedCountry?.dial_code ?? "";
    setPhone(stripDialCode(u.phone || "", savedDialCode));
  }, [user, countriesData]);

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  // handle image change
  const handleImageChange = (files) => {
    const file = files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatar(URL.createObjectURL(file));
  };

  // handle update
  const handleUpdateUser = () => {
    const formData = new FormData();
    if (avatarFile) formData.append("avatar", avatarFile);
    if (fieldConfig?.first_name?.show) formData.append("first_name", firstName);
    if (fieldConfig?.last_name?.show) formData.append("last_name", lastName);
    if (fieldConfig?.username?.show) formData.append("username", username);
    if (fieldConfig?.gender?.show) formData.append("gender", genderValue ?? "");
    if (fieldConfig?.country?.show)
      formData.append("country", countryValue ?? "");
    if (fieldConfig?.phone?.show)
      formData.append("phone", dialCode ? `${dialCode}${phone}` : phone);
    formData.append("date_of_birth", dateOfBirth);
    formData.append("address", address);
    formData.append("city", city);
    formData.append("zip_code", zip);

    updateUser(formData);
  };

  // Return Skeleton while loading
  if (isLoading) {
    return <AccountSettingsSkeleton />;
  }

  return (
    <div className="max-w-[796px] rounded-[16px] border border-[rgba(7,33,38,0.16)] bg-white p-5 sm:p-7.5">
      <div className="grid grid-cols-2 sm:grid-cols-12 gap-5">
        <div className="col-span-2 sm:col-span-12">
          <Label htmlFor="image">{t("dashboard.profilePhoto")}</Label>
          <FileUpload
            accept=".png,.jpg,.jpeg,.gif"
            maxSizeMB={2}
            multiple={false}
            defaultValue={avatar ? [avatar] : []}
            onChange={handleImageChange}
          />
        </div>

        {fieldConfig?.first_name?.show !== false && (
          <div className="col-span-2 sm:col-span-6">
            <Label
              htmlFor="first-name"
              required={fieldConfig?.first_name?.required}
            >
              {t("dashboard.firstName")}
            </Label>
            <Input
              type="text"
              id="first-name"
              name="first-name"
              placeholder={t("dashboard.enterFirstName")}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required={fieldConfig?.first_name?.required}
            />
          </div>
        )}

        {fieldConfig?.last_name?.show !== false && (
          <div className="col-span-2 sm:col-span-6">
            <Label
              htmlFor="last-name"
              required={fieldConfig?.last_name?.required}
            >
              {t("dashboard.lastName")}
            </Label>
            <Input
              type="text"
              id="last-name"
              name="last-name"
              placeholder={t("dashboard.enterLastName")}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required={fieldConfig?.last_name?.required}
            />
          </div>
        )}

        <div className="col-span-2 sm:col-span-6">
          <Label htmlFor="email" required>
            {t("dashboard.email")}
          </Label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder={t("dashboard.enterEmail")}
            value={email}
            disabled
          />
        </div>

        {fieldConfig?.username?.show && (
          <div className="col-span-2 sm:col-span-6">
            <Label
              htmlFor="username"
              required={fieldConfig?.username?.required}
            >
              {t("dashboard.username")}
            </Label>
            <Input
              type="text"
              id="username"
              name="username"
              placeholder={t("dashboard.enterUsername")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required={fieldConfig?.username?.required}
            />
          </div>
        )}

        {fieldConfig?.country?.show && (
          <div className="col-span-2 sm:col-span-6">
            <Label required={fieldConfig?.country?.required}>
              {t("dashboard.country")}
            </Label>
            <ReactSelectInput
              options={countryOptions}
              placeholder={t("dashboard.selectCountry")}
              value={countryValue}
              onChange={(val) => setCountryValue(val)}
              formatOptionLabel={(option) => (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{option.label}</span>
                </div>
              )}
            />
          </div>
        )}

        {fieldConfig?.phone?.show && (
          <div className="col-span-2 sm:col-span-6">
            <Label htmlFor="phone" required={fieldConfig?.phone?.required}>
              {t("dashboard.phone")}
            </Label>
            <div className="relative">
              <Input
                type="text"
                id="phone"
                name="phone"
                placeholder={t("dashboard.enterPhone")}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required={fieldConfig?.phone?.required}
                className={dialCode ? "pl-14" : ""}
              />
              {dialCode && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                  <span className="text-sm font-medium text-grayish/60">
                    {dialCode}
                  </span>
                  <span className="text-sm font-medium text-grayish/60">|</span>
                </div>
              )}
            </div>
          </div>
        )}

        {fieldConfig?.gender?.show && (
          <div className="col-span-2 sm:col-span-6">
            <Label required={fieldConfig?.gender?.required}>
              {t("dashboard.gender")}
            </Label>
            <ReactSelectInput
              options={genderOptions}
              value={genderValue}
              onChange={(val) => setGenderValue(val)}
              placeholder={t("dashboard.selectGender")}
            />
          </div>
        )}

        <div className="col-span-2 sm:col-span-6">
          <Label htmlFor="date-of-birth">{t("dashboard.dateOfBirth")}</Label>
          <Input
            type="date"
            id="date-of-birth"
            name="date-of-birth"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            // disabled={!!user?.data?.date_of_birth}
          />
        </div>

        <div className="col-span-2 sm:col-span-12">
          <div className="mt-4 w-full">
            <Button
              type="button"
              variant="primary-filled"
              size="lg"
              className="w-full"
              rounded="lg"
              onClick={handleUpdateUser}
              disabled={isUpdateUserLoading}
              loading={isUpdateUserLoading}
            >
              {isUpdateUserLoading
                ? t("dashboard.saving")
                : t("dashboard.saveChanges")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
