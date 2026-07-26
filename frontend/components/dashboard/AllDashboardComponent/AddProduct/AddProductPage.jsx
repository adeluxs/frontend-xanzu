"use client";

import Button from "@/components/ui/button/Button";
import { useT } from "@/context/TranslationContext";
import { useAddProductMutation } from "@/lib/features/addProduct/addProductApi";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import AttributesTabContent from "./AttributesTabContent";
import DeliveryTabContent from "./DeliveryTabContent";
import DescriptionTabContent from "./DescriptionTabContent";
import GeneralTabContent from "./GeneralTabContent";
import ImagesTabContent from "./ImagesTabContent";

export const initialProductFormData = {
  category_id: "",
  subcategory_id: "",
  brand_id: "",
  type: "digital",
  has_attributes: 0,
  product_name: "",
  price: "",
  quantity: "",
  discount_value: "",
  discount_type: "amount",

  description: "",

  thumbnail: null,
  existingThumbnail: "",
  gallery: [],
  existingGallery: [],
  deleted_images: [],

  attribute_groups: [],

  delivery_method: "manual",
  delivery_speed: "",
  delivery_speed_unit: "second",
  is_flash: 0,
  status: "active",
};

const AddProductPage = ({
  initialValues = initialProductFormData,
  onSubmit,
  submitLabel,
  isSubmitting = false,
}) => {
  const [activeTab, setActiveTab] = useState("general");
  const [productFormData, setProductFormData] = useState(initialValues);
  const initialValuesLoadedRef = useRef(false);
  const [addProduct, { isLoading: isCreating }] = useAddProductMutation();
  const router = useRouter();
  const t = useT();

  const tabsWithLabels = useMemo(
    () => [
      {
        id: "general",
        label: t("General"),
        component: GeneralTabContent,
      },
      {
        id: "description",
        label: t("Description"),
        component: DescriptionTabContent,
      },
      {
        id: "images",
        label: t("Images"),
        component: ImagesTabContent,
      },
      {
        id: "attributes",
        label: t("Attributes"),
        component: AttributesTabContent,
      },
      {
        id: "delivery",
        label: t("Delivery"),
        component: DeliveryTabContent,
      },
    ],
    [t],
  );

  useEffect(() => {
    if (!initialValuesLoadedRef.current) {
      setProductFormData(initialValues);
      initialValuesLoadedRef.current = true;
    }
  }, [initialValues]);

  const shouldShowAttributesTab =
    productFormData.type === "physical" &&
    Number(productFormData.has_attributes) === 1;

  const tabs = useMemo(() => {
    return tabsWithLabels.filter((tab) => {
      if (tab.id === "attributes") {
        return shouldShowAttributesTab;
      }

      return true;
    });
  }, [tabsWithLabels, shouldShowAttributesTab]);

  useEffect(() => {
    if (!shouldShowAttributesTab && activeTab === "attributes") {
      setActiveTab("delivery");
    }
  }, [shouldShowAttributesTab, activeTab]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const updateField = (field, value) => {
    setProductFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateFields = (fields) => {
    setProductFormData((prev) => ({
      ...prev,
      ...fields,
    }));
  };

  const activeTabIndex = tabs.findIndex((tab) => tab.id === activeTab);
  const safeActiveTabIndex = activeTabIndex === -1 ? 0 : activeTabIndex;

  const ActiveTabComponent =
    tabs[safeActiveTabIndex]?.component || tabs[0].component;

  const isFirstTab = safeActiveTabIndex === 0;
  const isLastTab = safeActiveTabIndex === tabs.length - 1;

  const handleNext = () => {
    if (isLastTab) return;
    setActiveTab(tabs[safeActiveTabIndex + 1].id);
  };

  const handlePrevious = () => {
    if (isFirstTab) return;
    setActiveTab(tabs[safeActiveTabIndex - 1].id);
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append("category_id", productFormData.category_id);
    formData.append("subcategory_id", productFormData.subcategory_id);
    if (productFormData.brand_id) {
      formData.append("brand_id", productFormData.brand_id);
    }
    formData.append("type", productFormData.type);
    formData.append("has_attributes", String(productFormData.has_attributes));
    formData.append("product_name", productFormData.product_name);
    formData.append("price", productFormData.price);
    formData.append("quantity", productFormData.quantity);
    formData.append("discount_value", productFormData.discount_value);
    formData.append("discount_type", productFormData.discount_type);
    formData.append("description", productFormData.description);

    if (productFormData.thumbnail) {
      formData.append("thumbnail", productFormData.thumbnail);
    }

    productFormData.gallery.forEach((file, index) => {
      if (file) {
        formData.append(`gallery[${index}]`, file);
      }
    });

    (productFormData.deleted_images || []).forEach((image, index) => {
      if (image) {
        formData.append(`deleted_images[${index}]`, image);
      }
    });

    if (shouldShowAttributesTab) {
      const cleanedAttributeGroups = productFormData.attribute_groups.map(
        ({ id, attributes, ...group }) => ({
          ...group,
          attributes: attributes.map(({ id, ...attribute }) => attribute),
        }),
      );

      formData.append(
        "attribute_groups",
        JSON.stringify(cleanedAttributeGroups),
      );
    }

    formData.append(
      "delivery_method",
      productFormData.type === "digital"
        ? productFormData.delivery_method
        : "manual",
    );

    formData.append("delivery_speed", productFormData.delivery_speed);
    formData.append("delivery_speed_unit", productFormData.delivery_speed_unit);
    formData.append("is_flash", String(productFormData.is_flash));
    formData.append("status", String(productFormData.status));

    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        await addProduct(formData).unwrap();
      }
      router.push("/dashboard/listing");
    } catch (error) {
      console.error("Product submit failed:", error);
    }
  };

  return (
    <div className="dashboard-top-gap">
      <div className="mt-6 rounded-[12px] border border-[rgba(7,33,38,0.16)] bg-white p-4 sm:p-6">
        <div className="flex flex-wrap gap-3 border-b border-[rgba(7,33,38,0.12)] pb-4">
          {tabs.map((tab) => {
            const isActive = activeTab === tab?.id;

            return (
              <button
                key={tab?.id}
                type="button"
                onClick={() => setActiveTab(tab?.id)}
                className={`rounded-[10px] border px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-primary bg-primary text-grayish"
                    : "border-[rgba(7,33,38,0.14)] bg-white text-grayish hover:border-primary hover:text-primary"
                }`}
              >
                {tab?.label}
              </button>
            );
          })}
        </div>

        <ActiveTabComponent
          formData={productFormData}
          updateField={updateField}
          updateFields={updateFields}
        />

        <div className="mt-7.5 flex flex-wrap items-center justify-end gap-3">
          {!isFirstTab && (
            <Button
              type="button"
              variant="primary-outline"
              size="compact"
              rounded="md"
              onClick={handlePrevious}
            >
              {t("dashboard.previous")}
            </Button>
          )}

          {!isLastTab ? (
            <Button
              type="button"
              variant="primary-filled"
              size="compact"
              rounded="md"
              onClick={handleNext}
            >
              {t("dashboard.next")}
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary-filled"
              size="compact"
              rounded="md"
              onClick={handleSubmit}
              disabled={isCreating || isSubmitting}
              loading={isCreating || isSubmitting}
            >
              {isCreating || isSubmitting
                ? submitLabel || t("dashboard.submitting")
                : submitLabel || t("dashboard.addProduct")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
