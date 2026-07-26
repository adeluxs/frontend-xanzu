"use client";

import Input from "@/components/ui/forms/input/InputField";
import Label from "@/components/ui/forms/input/Label";
import RadioToggleGroup from "@/components/ui/forms/input/RadioToggleGroup";
import ReactSelectInput from "@/components/ui/forms/input/ReactSelect";
import { useT } from "@/context/TranslationContext";
import { useGetAddProductConfigQuery } from "@/lib/features/addProduct/addProductApi";
import { useMemo } from "react";
import { useSelector } from "react-redux";

const discountTypeOptions = [
  { value: "amount", label: "$" },
  { value: "percentage", label: "%" },
];

const GeneralTabContent = ({ formData, updateField, updateFields }) => {
  const { data: configData } = useGetAddProductConfigQuery();
  const t = useT();

  const siteCurrencySymbol = useSelector(
    (state) => state?.settings?.settings?.currency_symbol,
  );

  const categories = configData?.data?.categories || [];
  const brands = configData?.data?.brands || [];

  const categoryOptions = useMemo(() => {
    return categories.map((category) => ({
      value: String(category.id),
      label: category.name,
    }));
  }, [categories]);

  const brandOptions = useMemo(() => {
    return brands.map((brand) => ({
      value: String(brand.id),
      label: brand.name,
    }));
  }, [brands]);

  const selectedCategory = useMemo(() => {
    return categories.find(
      (category) => String(category.id) === String(formData.category_id),
    );
  }, [categories, formData.category_id]);

  const subcategoryOptions = useMemo(() => {
    return (selectedCategory?.children || []).map((subcategory) => ({
      value: String(subcategory.id),
      label: subcategory.name,
    }));
  }, [selectedCategory]);

  const handleCategoryChange = (value) => {
    updateFields({
      category_id: value || "",
      subcategory_id: "",
    });
  };

  const handleSubcategoryChange = (value) => {
    updateField("subcategory_id", value || "");
  };

  const handleBrandChange = (value) => {
    updateField("brand_id", value || "");
  };

  const normalizeHasAttributes = (value) => {
    if (value === "yes") return 1;
    if (value === "no") return 0;
    return Number(value) === 1 ? 1 : 0;
  };

  const hasAttributes = normalizeHasAttributes(formData.has_attributes) === 1;

  const handleTypeChange = (value) => {
    updateFields({
      type: value,
      has_attributes: value === "digital" ? 0 : hasAttributes ? 1 : 0,
      quantity: value === "digital" ? "" : formData.quantity,
    });
  };

  const handleHasAttributesChange = (value) => {
    updateField("has_attributes", normalizeHasAttributes(value));
  };

  return (
    <div className="mt-6 rounded-[12px] border border-[rgba(7,33,38,0.08)] bg-white p-4 sm:p-6">
      <div className="grid grid-cols-2 gap-5 md:grid-cols-12">
        <div className="col-span-2 md:col-span-6">
          <Label htmlFor="category" required>
            {t("dashboard.categories")}
          </Label>

          <ReactSelectInput
            id="category"
            options={categoryOptions}
            value={formData.category_id}
            onChange={handleCategoryChange}
            placeholder={t("dashboard.selectCategory")}
            size="lg"
          />
        </div>

        <div className="col-span-2 md:col-span-6">
          <Label htmlFor="subcategory">{t("dashboard.subcategory")}</Label>

          <ReactSelectInput
            id="subcategory"
            options={subcategoryOptions}
            value={formData.subcategory_id}
            onChange={handleSubcategoryChange}
            placeholder={t("dashboard.selectSubcategory")}
            size="lg"
            isDisabled={!formData.category_id}
          />
        </div>

        <div className="col-span-2 md:col-span-6">
          <Label htmlFor="brand">{t("dashboard.brand")}</Label>

          <ReactSelectInput
            id="brand"
            options={brandOptions}
            value={formData.brand_id}
            onChange={handleBrandChange}
            placeholder={t("dashboard.selectBrand")}
            size="lg"
          />
        </div>

        <div className="col-span-2 md:col-span-12">
          <Label required>{t("dashboard.productType")}</Label>

          <RadioToggleGroup
            name="type"
            options={[
              { value: "physical", label: t("dashboard.physical") },
              { value: "digital", label: t("dashboard.digital") },
            ]}
            value={formData.type}
            onChange={handleTypeChange}
          />
        </div>

        {formData.type !== "digital" && (
          <div className="col-span-2 md:col-span-12">
            <Label required>{t("dashboard.hasAttributes")}</Label>

            <RadioToggleGroup
              name="has-attributes"
              options={[
                { value: "yes", label: t("dashboard.yes") },
                { value: "no", label: t("dashboard.no") },
              ]}
              value={hasAttributes ? "yes" : "no"}
              onChange={handleHasAttributesChange}
            />
          </div>
        )}
        <div className="col-span-2 md:col-span-6">
          <Label htmlFor="product-name" required>
            {t("dashboard.productName")}
          </Label>

          <Input
            id="product-name"
            name="product_name"
            value={formData.product_name}
            onChange={(e) => updateField("product_name", e.target.value)}
            placeholder={t("dashboard.enterProductName")}
          />
        </div>

        {!hasAttributes && (
          <div className="col-span-2 md:col-span-6">
            <Label htmlFor="quantity" required>
              {t("dashboard.quantity")}
            </Label>

            <Input
              id="quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => updateField("quantity", e.target.value)}
              placeholder={t("dashboard.enterQuantity")}
            />
          </div>
        )}

        <div className="col-span-2 md:col-span-6">
          <Label htmlFor="price" required>
            {t("dashboard.basePrice")}
          </Label>

          <Input
            id="price"
            name="price"
            type="number"
            value={formData.price}
            onChange={(e) => updateField("price", e.target.value)}
            placeholder={t("dashboard.enterBasePrice")}
            rightAdornment={
              <span className="rounded-[10px] border border-[rgba(7,33,38,0.10)] bg-white px-3 py-2 text-sm font-semibold text-grayish">
                {siteCurrencySymbol}
              </span>
            }
          />
        </div>

        <div className="col-span-2 md:col-span-6">
          <Label htmlFor="discount">{t("dashboard.discount")}</Label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_96px]">
            <Input
              id="discount_value"
              name="discount_value"
              type="number"
              value={formData.discount_value}
              onChange={(e) => updateField("discount_value", e.target.value)}
              placeholder={t("dashboard.enterDiscount")}
            />

            <ReactSelectInput
              id="discount-type"
              options={discountTypeOptions}
              value={formData.discount_type}
              onChange={(value) => updateField("discount_type", value)}
              placeholder="Type"
              size="lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralTabContent;
