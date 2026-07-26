"use client";

import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/forms/input/InputField";
import Label from "@/components/ui/forms/input/Label";
import { useT } from "@/context/TranslationContext";
import { EyeIcon, EyeSlashIcon } from "@/icons";
import { useChangePasswordMutation } from "@/lib/features/auth/authApi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const PasswordSettings = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [changePassword, { data, isLoading, error, isSuccess }] =
    useChangePasswordMutation();
  const t = useT();

  // handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const requestBody = {
      current_password: currentPassword,
      password: newPassword,
      password_confirmation: confirmNewPassword,
    };
    changePassword(requestBody);
  };

  // after success
  useEffect(() => {
    if (isSuccess) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    }
  }, [isSuccess]);

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-[660px] rounded-[16px] border border-[rgba(7,33,38,0.16)] bg-white p-5 sm:p-7.5"
    >
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12">
          <Label htmlFor="password" required>
            {t("dashboard.currentPassword")}
          </Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder={t("dashboard.enterCurrentPassword")}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
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

        <div className="col-span-12">
          <Label htmlFor="password2" required>
            {t("dashboard.newPassword")}
          </Label>
          <div className="relative">
            <Input
              type={showNewPassword ? "text" : "password"}
              id="password2"
              placeholder={t("dashboard.enterNewPassword")}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="pr-12"
            />
            <span
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute -translate-y-1/2 cursor-pointer right-4 top-1/2"
            >
              {showNewPassword ? <EyeIcon /> : <EyeSlashIcon />}
            </span>
          </div>
        </div>

        <div className="col-span-12">
          <Label htmlFor="confirm-password" required>
            {t("dashboard.confirmPassword")}
          </Label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              id="confirm-password"
              placeholder={t("dashboard.enterConfirmPassword")}
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
              className="pr-12"
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute -translate-y-1/2 cursor-pointer right-4 top-1/2"
            >
              {showConfirmPassword ? <EyeIcon /> : <EyeSlashIcon />}
            </span>
          </div>
        </div>

        <div className="col-span-12">
          <div className="mt-4 w-full">
            <Button
              type="submit"
              variant="primary-filled"
              size="lg"
              className="w-full"
              rounded="lg"
              disabled={isLoading}
              loading={isLoading}
            >
              {isLoading ? t("dashboard.saving") : t("dashboard.saveChanges")}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PasswordSettings;
