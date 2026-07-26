"use client";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import NoDataFound from "@/components/common/NoDataFound";
import Button from "@/components/ui/button/Button";
import FileUpload from "@/components/ui/forms/input/FileUpload";
import Input from "@/components/ui/forms/input/InputField";
import Label from "@/components/ui/forms/input/Label";
import TextArea from "@/components/ui/forms/input/TextArea";
import { useT } from "@/context/TranslationContext";
import { LeftArrowIcon } from "@/icons";
import {
  useEditWithdrawAccountMutation,
  useGetWithdrawAccountQuery,
} from "@/lib/features/withdraw/withdrawApi";
import { formatText } from "@/utils/utils";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const EditWithdrawAccount = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data: withdrawAccountData, isLoading: isInitialLoading } =
    useGetWithdrawAccountQuery(id);
  const [editWithdrawAccount, { isLoading: isSubmitting }] =
    useEditWithdrawAccountMutation();
  const [methodName, setMethodName] = useState("");
  const [customFields, setCustomFields] = useState({});
  const selectedAccount = withdrawAccountData?.data || null;
  const t = useT();

  // initial load data set
  useEffect(() => {
    if (!selectedAccount) return;

    setMethodName(selectedAccount.method_name || "");

    const initialFields = {};
    selectedAccount.credentials?.forEach((field) => {
      initialFields[field.name] = field.value || "";
    });
    setCustomFields(initialFields);
  }, [selectedAccount]);

  const handleFieldChange = (fieldName, value) => {
    setCustomFields((prev) => ({ ...prev, [fieldName]: value }));
  };

  // handle submit
  const handleSubmit = async () => {
    if (!selectedAccount) return;

    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("method_name", methodName);
    formData.append("withdraw_method_id", selectedAccount.method?.id);

    selectedAccount.credentials?.forEach((field) => {
      const value = customFields[field.name];
      if (field.type === "file" && !(value instanceof File)) return;

      if (value instanceof File) {
        formData.append(`customFields[${field.id}]`, value);
      } else {
        formData.append(`customFields[${field.id}]`, value ?? "");
      }
    });

    const result = await editWithdrawAccount({ id, formData });

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
        {isInitialLoading ? (
          <div className="py-10 text-center">
            <LoadingSpinner message={t("dashboard.loadingWithdrawAccount")} />
          </div>
        ) : !selectedAccount ? (
          <div className="py-10 text-center">
            <NoDataFound message={t("dashboard.noWithdrawAccountFound")} />
          </div>
        ) : (
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

            {selectedAccount.credentials?.map((field) => (
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
                    defaultValue={
                      field.value
                        ? [{ url: field.value, name: formatText(field.name) }]
                        : []
                    }
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
                  disabled={isSubmitting || !methodName}
                  loading={isSubmitting}
                >
                  {isSubmitting
                    ? t("dashboard.updating")
                    : t("dashboard.updateAccount")}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditWithdrawAccount;
