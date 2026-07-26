"use client";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/forms/input/InputField";
import Label from "@/components/ui/forms/input/Label";
import { useT } from "@/context/TranslationContext";
import {
  useGenerateCredentialMutation,
  useGetApiCredentialsQuery,
} from "@/lib/features/merchantApiManagemnt/merchantApiManagemnt";
import { copyTextToClipboard } from "@/utils/utils";
import { useState } from "react";
import { toast } from "react-toastify";

const ApiManagement = () => {
  const { data, isFetching } = useGetApiCredentialsQuery();
  const [generateCredential, { isLoading: isGenerating }] =
    useGenerateCredentialMutation();
  const [copiedField, setCopiedField] = useState("");

  const credentials = data?.data?.credentials || {};
  const isRegenerating = isGenerating || (isFetching && !!data);
  const t = useT();

  const handleRegenerate = async () => {
    try {
      await generateCredential().unwrap();
    } catch {
      // Toast is handled in the API slice.
    }
  };

  const handleCopy = async (fieldName, value) => {
    const isCopied = await copyTextToClipboard(value);

    if (!isCopied) {
      toast.error("Failed to copy text. Please try again.");
      return;
    }

    setCopiedField(fieldName);
    toast.success("Copied to clipboard");

    setTimeout(() => {
      setCopiedField((currentField) =>
        currentField === fieldName ? "" : currentField,
      );
    }, 2000);
  };

  const renderCopyButton = (fieldName, value) => {
    if (!value) return null;

    return (
      <button
        type="button"
        onClick={() => handleCopy(fieldName, value)}
        className="inline-flex h-9 min-w-[68px] items-center justify-center rounded-[10px] bg-grayish/8 px-3 text-xs font-semibold text-grayish transition hover:bg-grayish/12"
      >
        {copiedField === fieldName
          ? t("dashboard.copied")
          : t("dashboard.copy")}
      </button>
    );
  };

  if (isFetching) {
    return (
      <div className="dashboard-top-gap">
        <div className="max-w-[660px] rounded-[16px] border border-[rgba(7,33,38,0.16)] bg-white p-6 sm:p-8">
          <div className="flex min-h-[320px] items-center justify-center">
            <LoadingSpinner message={t("dashboard.loadingApiManagementData")} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-top-gap">
      <div className="max-w-[660px] rounded-[16px] border border-[rgba(7,33,38,0.16)] bg-white p-3 sm:p-5">
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12">
            <Label htmlFor="secretKey" required>
              {t("dashboard.apiSecretKey")}
            </Label>
            <Input
              type="text"
              id="secretKey"
              name="secretKey"
              placeholder=""
              value={credentials?.secret_key ?? ""}
              readOnly
              rightAdornment={renderCopyButton(
                "secret_key",
                credentials?.secret_key,
              )}
            />
          </div>
          <div className="col-span-12">
            <Label htmlFor="publicKey" required>
              {t("dashboard.apiPublicKey")}
            </Label>
            <Input
              type="text"
              id="publicKey"
              name="publicKey"
              placeholder=""
              value={credentials?.public_key ?? ""}
              readOnly
              rightAdornment={renderCopyButton(
                "public_key",
                credentials?.public_key,
              )}
            />
          </div>
          <div className="col-span-12">
            <Label htmlFor="webSecretKey" required>
              {t("dashboard.webhookSecretKey")}
            </Label>
            <Input
              type="text"
              id="webSecretKey"
              name="webSecretKey"
              placeholder=""
              value={credentials?.webhook_secret ?? ""}
              readOnly
              rightAdornment={renderCopyButton(
                "webhook_secret",
                credentials?.webhook_secret,
              )}
            />
          </div>
          <div className="col-span-12">
            <div className="mt-5">
              <Button
                type="button"
                variant="primary-filled"
                size="md"
                rounded="md"
                className="w-full"
                onClick={handleRegenerate}
                loading={isRegenerating}
              >
                {isRegenerating
                  ? t("dashboard.regenerating")
                  : t("dashboard.regenerate")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiManagement;
