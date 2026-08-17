"use client";
import Button from "@/components/ui/button/Button";
import FileUpload from "@/components/ui/forms/input/FileUpload";
import Input from "@/components/ui/forms/input/InputField";
import Label from "@/components/ui/forms/input/Label";
import ReactSelectInput from "@/components/ui/forms/input/ReactSelect";
import TextArea from "@/components/ui/forms/input/TextArea";
import { useT } from "@/context/TranslationContext";
import { LeftArrowIcon } from "@/icons";
import {
  useCreateWithdrawAccountMutation,
  useGetMethodsQuery,
} from "@/lib/features/withdraw/withdrawApi";
import { formatText } from "@/utils/utils";
import { isRemoteMediaSource, normalizeMediaSource } from "@/utils/media";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const AddWithdrawAccount = () => {
  const router = useRouter();
  const { data: methodsData, isLoading: methodLoading } = useGetMethodsQuery();
  const [createWithdrawAccount, { isLoading: isSubmitting }] =
    useCreateWithdrawAccountMutation();
  const methods = methodsData?.data || [];
  const [selectedMethodId, setSelectedMethodId] = useState(null);
  const [methodName, setMethodName] = useState("");
  const [customFields, setCustomFields] = useState({});
  const t = useT();

  // Find selected method object
  const selectedMethod = methods.find((m) => m.id === selectedMethodId);

  // Build react-select options with icons
  const methodOptions = methods.map((m) => ({
    value: m.id,
    label: m.name,
    icon: m.icon,
  }));

  // Reset custom fields when method changes
  const handleMethodChange = (value) => {
    setSelectedMethodId(value);
    setCustomFields({});
  };

  // Handle dynamic field changes
  const handleFieldChange = (fieldName, value) => {
    setCustomFields((prev) => ({ ...prev, [fieldName]: value }));
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!selectedMethodId) return;

    const formData = new FormData();
    formData.append("method_name", methodName);
    formData.append("withdraw_method_id", selectedMethodId);

    selectedMethod?.fields?.forEach((field) => {
      const value = customFields[field.name];
      if (value instanceof File) {
        formData.append(`customFields[${field.id}]`, value);
      } else {
        formData.append(`customFields[${field.id}]`, value ?? "");
      }
    });
    const result = await createWithdrawAccount(formData);
    if (result?.data?.status) {
      router.push("/dashboard/withdraw/withdraw-account");
    }
  };

  return (
    <div>
      <Link
        href="/dashboard/withdraw/withdraw-account"
        className="h-10 inline-flex items-center justify-center gap-1.5 text-[15px] font-medium text-grayish bg-[rgba(7,33,38,0.04)] rounded-[10px] px-5 hover:bg-gray-200"
      >
        <LeftArrowIcon className="h-4.5 w-4.5 rtl:rotate-180" />
        {t("dashboard.back")}
      </Link>

      <div className="mt-7.5 max-w-[660px] rounded-[16px] border border-[rgba(7,33,38,0.16)] bg-white p-3 sm:p-5">
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12">
            <Label htmlFor="method-name" required>
              {t("dashboard.methodName")}
            </Label>
            <Input
              type="text"
              id="method-name"
              placeholder={t("dashboard.enterMethodName")}
              value={methodName}
              onChange={(e) => setMethodName(e.target.value)}
            />
          </div>

          <div className="col-span-12">
            <Label htmlFor="method" required>
              {t("dashboard.selectMethod")}
            </Label>
            <ReactSelectInput
              options={methodOptions}
              value={selectedMethodId}
              onChange={handleMethodChange}
              placeholder={
                methodLoading
                  ? t("dashboard.loadingMethod")
                  : t("dashboard.selectMethod")
              }
              loading={methodLoading}
              formatOptionLabel={(option) => (
                <div className="flex items-center gap-2">
                  {option.icon && (
                    <Image
                      src={normalizeMediaSource(option.icon)}
                      alt={option.label}
                      width={20}
                      height={20}
                      unoptimized={isRemoteMediaSource(
                        normalizeMediaSource(option.icon),
                      )}
                      className="w-5 h-5 object-contain rounded"
                    />
                  )}
                  <span>{option.label}</span>
                </div>
              )}
            />
          </div>

          {selectedMethod?.fields?.map((field) => (
            <div key={field.id} className="col-span-12">
              <Label required={field.validation === "required"}>
                {formatText(field.name)}
              </Label>

              {field.type === "textarea" ? (
                <TextArea
                  placeholder={`Enter ${formatText(field.name)}`}
                  rows={4}
                  value={customFields[field.name] || ""}
                  onChange={(e) =>
                    handleFieldChange(
                      field.name,
                      e?.target ? e.target.value : e,
                    )
                  }
                />
              ) : field.type === "file" ? (
                <FileUpload
                  accept=".png,.jpg,.jpeg,.gif,.pdf,.doc,.docx"
                  maxSizeMB={5}
                  multiple={false}
                  onChange={(files) =>
                    handleFieldChange(field.name, files?.[0] || null)
                  }
                />
              ) : (
                <Input
                  type={field.type}
                  placeholder={`Enter ${formatText(field.name)}`}
                  value={customFields[field.name] || ""}
                  onChange={(e) =>
                    handleFieldChange(field.name, e.target.value)
                  }
                />
              )}
            </div>
          ))}

          <div className="col-span-12">
            <div className="mt-2">
              <Button
                type="button"
                variant="primary-filled"
                size="md"
                rounded="md"
                className="w-full disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                {isSubmitting
                  ? t("dashboard.processing")
                  : t("dashboard.addAccount")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddWithdrawAccount;
