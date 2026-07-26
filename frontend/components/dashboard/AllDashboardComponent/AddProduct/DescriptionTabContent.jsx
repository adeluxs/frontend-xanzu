"use client";

import CommonTextEditor from "@/components/ui/forms/input/commonTextEditor";
import Label from "@/components/ui/forms/input/Label";
import { useT } from "@/context/TranslationContext";

const DescriptionTabContent = ({ formData, updateField }) => {
  const t = useT();
  return (
    <div className="mt-6 rounded-[12px] border border-[rgba(7,33,38,0.08)] bg-white p-4 sm:p-6">
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12">
          <Label htmlFor="description" required>
            {t("dashboard.description")}
          </Label>

          <CommonTextEditor
            id="description"
            value={formData.description || ""}
            onChange={(value) => updateField("description", value)}
            placeholder={t("dashboard.writeProductDescription")}
            height={320}
          />
        </div>
      </div>
    </div>
  );
};

export default DescriptionTabContent;
