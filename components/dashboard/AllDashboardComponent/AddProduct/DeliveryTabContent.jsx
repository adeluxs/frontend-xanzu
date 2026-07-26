"use client";

import Input from "@/components/ui/forms/input/InputField";
import Label from "@/components/ui/forms/input/Label";
import RadioToggleGroup from "@/components/ui/forms/input/RadioToggleGroup";
import ReactSelectInput from "@/components/ui/forms/input/ReactSelect";
import { useT } from "@/context/TranslationContext";
import { useEffect } from "react";

const DeliveryTabContent = ({ formData, updateField }) => {
  const isDigitalProduct = formData.type === "digital";
  const t = useT();

  const speedUnitOptions = [
    { value: "second", label: t("dashboard.second") },
    { value: "minute", label: t("dashboard.minute") },
    { value: "hour", label: t("dashboard.hour") },
    { value: "day", label: t("dashboard.day") },
  ];

  const statusOptions = [
    { value: "active", label: t("dashboard.active") },
    { value: "inactive", label: t("dashboard.inactive") },
    { value: "draft", label: t("dashboard.draft") },
  ];

  useEffect(() => {
    if (!isDigitalProduct && formData.delivery_method !== "manual") {
      updateField("delivery_method", "manual");
    }
  }, [isDigitalProduct, formData.delivery_method, updateField]);

  return (
    <div className="mt-6 rounded-[12px] border border-[rgba(7,33,38,0.08)] bg-white p-4 sm:p-6">
      <div className="grid grid-cols-2 gap-5 md:grid-cols-12">
        <div className="col-span-2 md:col-span-12">
          <Label required>{t("dashboard.deliveryMethod")}</Label>

          <div
            className={
              isDigitalProduct
                ? ""
                : "pointer-events-none opacity-50 blur-[0.4px]"
            }
          >
            <RadioToggleGroup
              name="delivery-method"
              options={[
                { value: "manual", label: "Manual" },
                { value: "auto", label: "Automatic" },
              ]}
              value={
                isDigitalProduct
                  ? formData.delivery_method || "manual"
                  : "manual"
              }
              onChange={(value) => {
                if (!isDigitalProduct) return;
                updateField("delivery_method", value);
              }}
            />
          </div>

          {!isDigitalProduct && (
            <p className="mt-2 text-xs text-grayish/60">
              {t("dashboard.deliveryMethodFixedManual")}
            </p>
          )}
        </div>

        <div className="col-span-2 md:col-span-12">
          <Label htmlFor="delivery-speed" required>
            {t("dashboard.deliverySpeed")}
          </Label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_130px]">
            <Input
              id="delivery-speed"
              name="delivery_speed"
              type="number"
              min="0"
              value={formData.delivery_speed || ""}
              onChange={(e) => updateField("delivery_speed", e.target.value)}
              placeholder={t("dashboard.enterDeliverySpeed")}
            />

            <ReactSelectInput
              id="delivery-speed-unit"
              options={speedUnitOptions}
              value={formData.delivery_speed_unit || "second"}
              onChange={(value) => updateField("delivery_speed_unit", value)}
              placeholder="Unit"
              size="lg"
            />
          </div>
        </div>

        <div className="col-span-2 md:col-span-12">
          <Label htmlFor="status" required>
            {t("dashboard.status")}
          </Label>

          <ReactSelectInput
            id="status"
            options={statusOptions}
            value={formData.status || "active"}
            onChange={(value) => updateField("status", value)}
            placeholder={t("dashboard.selectStatus")}
            size="lg"
          />
        </div>

        <div className="col-span-2 md:col-span-12">
          <Label>{t("dashboard.flashSale")}</Label>

          <RadioToggleGroup
            name="flash-sale"
            options={[
              { value: 0, label: "Disable" },
              { value: 1, label: "Enable" },
            ]}
            value={Number(formData.is_flash ?? 0)}
            onChange={(value) => updateField("is_flash", Number(value))}
          />
        </div>
      </div>
    </div>
  );
};

export default DeliveryTabContent;
