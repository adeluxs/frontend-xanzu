"use client";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Button from "@/components/ui/button/Button";
import FileUpload from "@/components/ui/forms/input/FileUpload";
import Input from "@/components/ui/forms/input/InputField";
import Label from "@/components/ui/forms/input/Label";
import ReactSelectInput from "@/components/ui/forms/input/ReactSelect";
import TextArea from "@/components/ui/forms/input/TextArea";
import { useT } from "@/context/TranslationContext";
import { InfoIcon } from "@/icons";
import {
  useCreateStoreMutation,
  useGetStoreQuery,
} from "@/lib/features/storeManagement/storeManagementApi";
import { useEffect, useState } from "react";

const StoreManagement = () => {
  const { data, isLoading } = useGetStoreQuery();
  const [createStore, { isLoading: isSubmitting }] = useCreateStoreMutation();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    status: "",
    website_url: "",
    platform: "",
    platform_host: "",
    api_secret: "",
    api_key: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);

  const provider = data?.data?.provider || null;
  const platforms = data?.data?.platforms || [];
  const hasProvider = !!provider;

  const t = useT();

  const platformOptions = platforms.map((item) => ({
    label: item,
    value: item,
  }));

  const statusOptions = [
    { value: "1", label: "Active" },
    { value: "0", label: "De-active" },
  ];

  useEffect(() => {
    if (!provider) return;

    setShowForm(true);
    setFormData({
      name: provider?.name ?? "",
      status: provider?.status ? "1" : "0",
      website_url: provider?.website_url ?? "",
      platform: provider?.platform ?? "",
      platform_host: provider?.platform_host ?? "",
      api_secret: provider?.api_secret ?? "",
      api_key: provider?.api_key ?? "",
      description: provider?.description ?? "",
    });
    setImageFile(null);
    setCoverImageFile(null);
  }, [provider]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    const payload = new FormData();

    payload.append("name", formData.name);
    payload.append("platform", formData.platform);
    payload.append("platform_host", formData.platform_host);
    payload.append("api_key", formData.api_key);
    payload.append("api_secret", formData.api_secret);
    payload.append("status", formData.status);
    payload.append("description", formData.description);

    if (formData.website_url) {
      payload.append("website_url", formData.website_url);
    }

    if (imageFile) {
      payload.append("image", imageFile);
    }

    if (coverImageFile) {
      payload.append("cover_image", coverImageFile);
    }

    try {
      await createStore(payload).unwrap();
      setShowForm(true);
    } catch {}
  };

  if (isLoading) {
    return (
      <div className="dashboard-top-gap">
        <div className="max-w-[796px] rounded-[16px] border border-[rgba(7,33,38,0.16)] bg-white p-6 sm:p-8">
          <div className="flex min-h-[320px] items-center justify-center">
            <LoadingSpinner message={t("dashboard.loadingStoreData")} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-top-gap">
      {!hasProvider && !showForm ? (
        <div className="max-w-[796px] flex justify-center items-center min-h-[250px] sm:min-h-[352px] rounded-[16px] border border-[rgba(7,33,38,0.16)] bg-white p-3 sm:p-5">
          <div className="flex flex-col justify-center items-center w-full">
            <div className="flex items-center justify-center gap-2 w-full">
              <InfoIcon className="h-5 w-5 text-[#596A6E]" />
              <p className="text-[#596A6E] font-normal text-base">
                {t("dashboard.noStoreCreatedYet")}
              </p>
            </div>
            <div className="w-full mt-6 sm:mt-10">
              <Button
                type="button"
                variant="primary-filled"
                size="md"
                rounded="md"
                className="w-full"
                onClick={() => setShowForm(true)}
              >
                {t("dashboard.addStore")}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-[796px] rounded-[16px] border border-[rgba(7,33,38,0.16)] bg-white p-3 sm:p-5">
          <div className="grid grid-cols-2 sm:grid-cols-12 gap-5">
            <div className="col-span-2 sm:col-span-6">
              <Label htmlFor="name" required>
                {t("dashboard.name")}
              </Label>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder={t("dashboard.enterName")}
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            <div className="col-span-2 sm:col-span-6">
              <Label htmlFor="status" required>
                {t("dashboard.status")}
              </Label>
              <ReactSelectInput
                id="status"
                options={statusOptions}
                value={formData.status}
                onChange={(value) => handleChange("status", value)}
                placeholder={t("dashboard.selectStatus")}
              />
            </div>
            <div className="col-span-2 sm:col-span-6">
              <Label htmlFor="website_url">{t("dashboard.websiteUrl")}</Label>
              <Input
                type="text"
                id="website_url"
                name="website_url"
                placeholder={t("dashboard.enterLink")}
                value={formData.website_url}
                onChange={(e) => handleChange("website_url", e.target.value)}
              />
            </div>
            <div className="col-span-2 sm:col-span-6">
              <Label htmlFor="platform" required>
                {t("dashboard.providerPlatform")}
              </Label>
              <ReactSelectInput
                id="platform"
                options={platformOptions}
                value={formData.platform}
                onChange={(value) => handleChange("platform", value)}
                placeholder={t("dashboard.selectProvider")}
              />
            </div>
            <div className="col-span-2 sm:col-span-6">
              <Label htmlFor="platform_host" required>
                {t("dashboard.platformHost")}
              </Label>
              <Input
                type="text"
                id="platform_host"
                name="platform_host"
                placeholder={t("dashboard.enterPlatformHost")}
                value={formData.platform_host}
                onChange={(e) => handleChange("platform_host", e.target.value)}
              />
            </div>
            <div className="col-span-2 sm:col-span-6">
              <Label htmlFor="apiSecret" required>
                {t("dashboard.providerSecretKey")}
              </Label>
              <Input
                type="text"
                id="apiSecret"
                name="apiSecret"
                placeholder={t("dashboard.enterSecretKey")}
                value={formData.api_secret}
                onChange={(e) => handleChange("api_secret", e.target.value)}
              />
            </div>
            <div className="col-span-2 sm:col-span-6">
              <Label htmlFor="apiKey" required>
                {t("dashboard.providerApiKey")}
              </Label>
              <Input
                type="text"
                id="apiKey"
                name="apiKey"
                placeholder={t("dashboard.enterKeyApi")}
                value={formData.api_key}
                onChange={(e) => handleChange("api_key", e.target.value)}
              />
            </div>
            <div className="col-span-2 sm:col-span-12">
              <Label htmlFor="image">{t("dashboard.image")}</Label>
              <FileUpload
                accept=".png,.jpg,.jpeg,.gif"
                maxSizeMB={2}
                multiple={false}
                defaultValue={provider?.image_url ? [provider.image_url] : []}
                onChange={(files) => setImageFile(files?.[0] || null)}
              />
            </div>
            <div className="col-span-2 sm:col-span-12">
              <Label htmlFor="cover_image">{t("dashboard.coverImage")}</Label>
              <FileUpload
                accept=".png,.jpg,.jpeg,.gif"
                maxSizeMB={2}
                multiple={false}
                defaultValue={
                  provider?.cover_image_url ? [provider.cover_image_url] : []
                }
                onChange={(files) => setCoverImageFile(files?.[0] || null)}
              />
            </div>
            <div className="col-span-2 sm:col-span-12">
              <Label htmlFor="description" required>
                {t("dashboard.description")}
              </Label>
              <TextArea
                id="description"
                name="description"
                placeholder={t("dashboard.type")}
                rows={4}
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>
            <div className="col-span-2 sm:col-span-12">
              <div className="mt-5">
                <Button
                  type="button"
                  variant="primary-filled"
                  size="md"
                  rounded="md"
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  {isSubmitting
                    ? hasProvider
                      ? t("dashboard.updatingStore")
                      : t("dashboard.creatingStore")
                    : hasProvider
                      ? t("dashboard.updateStore")
                      : t("dashboard.createStore")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreManagement;
