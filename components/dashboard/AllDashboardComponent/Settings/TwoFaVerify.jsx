"use client";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/forms/input/InputField";
import Label from "@/components/ui/forms/input/Label";
import { useT } from "@/context/TranslationContext";
import { useTwoFaSecurityMutation } from "@/lib/features/auth/authApi";
import { useGetUserQuery } from "@/lib/features/user/userApi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const TwoFaVerify = () => {
  const [pin, setPin] = useState("");
  const [password, setPassword] = useState("");
  const { data: user, isLoading: isUserLoading } = useGetUserQuery();
  const [
    twoFaSecurity,
    { data, isLoading, error: responseError, isSuccess: twoFaSecuritySuccess },
  ] = useTwoFaSecurityMutation();
  const [currentAction, setCurrentAction] = useState(null);
  const [qrCode, setQrCode] = useState("");
  const t = useT();

  //generate qr code
  const handleGenerateQrCode = () => {
    setCurrentAction("generate");
    const requestBody = {
      type: "generate",
    };
    twoFaSecurity(requestBody);
  };

  //handle enable 2fa
  const handleEnable2fa = () => {
    setCurrentAction("enable");
    const requestBody = {
      type: "enable",
      one_time_password: pin,
    };
    twoFaSecurity(requestBody);
  };

  //handle disable 2fa
  const handleDisable2fa = () => {
    setCurrentAction("disable");
    const requestBody = {
      type: "disable",
      one_time_password: password,
    };
    twoFaSecurity(requestBody);
  };

  //handle error
  useEffect(() => {
    if (!responseError || !currentAction) return;

    const message =
      responseError?.data?.message ||
      responseError?.error ||
      "Something went wrong";

    if (currentAction === "generate") {
      toast.error(`QR generation failed: ${message}`);
    }

    if (currentAction === "enable") {
      toast.error(`Enable 2FA failed: ${message}`);
    }

    if (currentAction === "disable") {
      toast.error(`Disable 2FA failed: ${message}`);
    }

    setCurrentAction(null);
  }, [responseError, currentAction]);

  // handle success
  useEffect(() => {
    if (!twoFaSecuritySuccess || !currentAction) return;

    if (currentAction === "generate") {
      toast.success("QR code generated successfully!");
      setQrCode(data?.data?.qr_code);
    }

    if (currentAction === "enable") {
      toast.success("2FA enabled successfully!");
      setPin("");
    }

    if (currentAction === "disable") {
      toast.success("2FA disabled successfully!");
      setPassword("");
    }

    setCurrentAction(null);
  }, [twoFaSecuritySuccess, currentAction, data]);

  const isGenerating = isLoading && currentAction === "generate";
  const isEnabling = isLoading && currentAction === "enable";
  const isDisabling = isLoading && currentAction === "disable";

  if (isUserLoading) {
    return (
      <div>
        <div className="w-full max-w-[660px] rounded-[16px] border border-[rgba(7,33,38,0.16)] bg-white p-5 sm:p-7.5 h-80 animate-pulse"></div>
      </div>
    );
  }

  if (user?.data?.two_fa === true) {
    return (
      <div>
        <div className="w-full max-w-[660px] rounded-[16px] border border-[rgba(7,33,38,0.16)] bg-white p-5 sm:p-7.5">
          <div className="mb-7.5">
            <Label htmlFor="pass" required>
              {t("dashboard.enterPasswordToDisable2fa")}
            </Label>

            <Input
              type="password"
              id="pass"
              name="pass"
              placeholder={t("dashboard.enterYourPassword")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button
            type="button"
            variant="primary-filled"
            size="lg"
            className="w-full"
            rounded="lg"
            onClick={handleDisable2fa}
            disabled={isDisabling}
            loading={isDisabling}
          >
            {isDisabling ? t("dashboard.disabling") : t("dashboard.disable2fa")}
          </Button>
        </div>
      </div>
    );
  }
  if (user?.data?.two_fa === false) {
    if (
      user?.data?.google2fa_secret !== "" &&
      user?.data?.google2fa_secret != null &&
      qrCode != ""
    ) {
      return (
        <div>
          <div className="w-full max-w-[660px] rounded-[16px] border border-[rgba(7,33,38,0.16)] bg-white p-5 sm:p-7.5">
            <p className="text-base font-normal text-grayish/60 mb-5">
              {t("dashboard.scanQrCodeToEnable2fa")}
            </p>
            <div className="p-[4px] bg-heading/5 w-max border border-[rgba(7,33,38,0.16)] rounded-[16px]">
              <div
                className="w-full h-full"
                dangerouslySetInnerHTML={{
                  __html: qrCode,
                }}
              />
            </div>
            <div className="mb-7.5 mt-5">
              <Label htmlFor="pin" required>
                {t("dashboard.enterPinFromGoogleAuthenticator")}
              </Label>

              <Input
                type="text"
                id="pin"
                name="pin"
                placeholder={t("dashboard.enter6DigitPin")}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
              />
            </div>
            <Button
              type="button"
              variant="primary-filled"
              size="lg"
              className="w-full"
              rounded="lg"
              onClick={handleEnable2fa}
              disabled={isEnabling}
              loading={isEnabling}
            >
              {isEnabling ? t("dashboard.enabling") : t("dashboard.enable2fa")}
            </Button>
          </div>
        </div>
      );
    }
    return (
      <div className="">
        <div className="w-full max-w-[660px] rounded-[16px] border border-[rgba(7,33,38,0.16)] bg-white p-5 sm:p-7.5">
          <h1 className="text-xl font-bold mb-5 text-center">
            {t("dashboard.securitySettings")}
          </h1>
          <p className="text-gray-600 mb-6 text-center">
            {t("dashboard.twoFactorAuthDescription")}
          </p>
          <Button
            type="button"
            variant="primary-filled"
            size="lg"
            className="w-full"
            rounded="lg"
            onClick={handleGenerateQrCode}
            disabled={isGenerating}
            loading={isGenerating}
          >
            {isGenerating
              ? t("dashboard.generating")
              : t("dashboard.generateQrCode")}
          </Button>
        </div>
      </div>
    );
  }
};

export default TwoFaVerify;
