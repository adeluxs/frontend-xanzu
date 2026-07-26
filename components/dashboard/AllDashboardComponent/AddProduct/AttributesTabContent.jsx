"use client";

import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/forms/input/InputField";
import Label from "@/components/ui/forms/input/Label";
import ReactSelectInput from "@/components/ui/forms/input/ReactSelect";
import { useT } from "@/context/TranslationContext";
import { PlusIcon, TrashIcon } from "@/icons";
import { useSelector } from "react-redux";

const discountTypeOptions = [
  { value: "amount", label: "$" },
  { value: "percentage", label: "%" },
];

const createLocalId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const createAttributeItem = () => ({
  id: createLocalId(),
  label: "",
  price: "",
  discount_type: "amount",
  discount_amount: "",
  qty: "",
});

const createAttributeGroup = () => ({
  id: createLocalId(),
  group_name: "",
  attributes: [createAttributeItem()],
});

const circleButtonClass =
  "inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors";

const AttributesTabContent = ({ formData, updateField }) => {
  const attributeGroups = formData.attribute_groups || [];
  const siteCurrencySymbol = useSelector(
    (state) => state?.settings?.settings?.currency_symbol,
  );
  const t = useT();

  const updateAttributeGroups = (groups) => {
    updateField("attribute_groups", groups);
  };

  const addGroup = () => {
    updateAttributeGroups([...attributeGroups, createAttributeGroup()]);
  };

  const removeGroup = (groupId) => {
    updateAttributeGroups(
      attributeGroups.filter((group) => group.id !== groupId),
    );
  };

  const updateGroupName = (groupId, value) => {
    updateAttributeGroups(
      attributeGroups.map((group) =>
        group.id === groupId ? { ...group, group_name: value } : group,
      ),
    );
  };

  const addItemToGroup = (groupId) => {
    updateAttributeGroups(
      attributeGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              attributes: [...group.attributes, createAttributeItem()],
            }
          : group,
      ),
    );
  };

  const removeItemFromGroup = (groupId, itemId) => {
    const updatedGroups = attributeGroups
      .map((group) =>
        group.id === groupId
          ? {
              ...group,
              attributes: group.attributes.filter((item) => item.id !== itemId),
            }
          : group,
      )
      .filter((group) => group.attributes.length > 0);

    updateAttributeGroups(updatedGroups);
  };

  const updateItemField = (groupId, itemId, field, value) => {
    updateAttributeGroups(
      attributeGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              attributes: group.attributes.map((item) =>
                item.id === itemId ? { ...item, [field]: value } : item,
              ),
            }
          : group,
      ),
    );
  };

  return (
    <div className="mt-6 rounded-[12px] border border-[rgba(7,33,38,0.08)] bg-white p-4 sm:p-6">
      <p className="mb-4 text-sm font-medium text-grayish/70">
        {t("dashboard.defineProductVariations")}
      </p>

      <div className="mb-5">
        <Button
          type="button"
          variant="primary-filled"
          size="compact"
          rounded="md"
          startIcon={<PlusIcon className="h-5 w-5" />}
          onClick={addGroup}
        >
          {t("dashboard.addAttributeGroup")}
        </Button>
      </div>

      {attributeGroups.length > 0 && (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-12">
          {attributeGroups.map((group) => (
            <div key={group.id} className="col-span-2 xl:col-span-6">
              <div className="rounded-[12px] border border-[rgba(7,33,38,0.12)] bg-white">
                <div className="flex items-center gap-3 border-b border-[rgba(7,33,38,0.08)] p-4">
                  <Input
                    name={`group-${group.id}`}
                    value={group.group_name}
                    onChange={(e) => updateGroupName(group.id, e.target.value)}
                    placeholder="e.g. Color, Size"
                    className="h-[48px]"
                  />

                  <button
                    type="button"
                    onClick={() => removeGroup(group.id)}
                    className={`${circleButtonClass} shrink-0 bg-error text-white hover:bg-red-600`}
                    aria-label="Remove attribute group"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-5 p-4">
                  {group.attributes.map((item, index) => (
                    <div
                      key={item.id}
                      className={`${
                        index > 0
                          ? "border-t border-[rgba(7,33,38,0.08)] pt-5"
                          : ""
                      }`}
                    >
                      <div className="grid grid-cols-2 gap-5 md:grid-cols-12">
                        <div className="col-span-2 md:col-span-12">
                          <Label htmlFor={`label-${item.id}`} required>
                            {t("dashboard.label")}
                          </Label>

                          <Input
                            id={`label-${item.id}`}
                            name={`label-${item.id}`}
                            value={item.label}
                            onChange={(e) =>
                              updateItemField(
                                group.id,
                                item.id,
                                "label",
                                e.target.value,
                              )
                            }
                            placeholder="e.g. Small, Medium, Large"
                          />
                        </div>

                        <div className="col-span-2 md:col-span-6">
                          <Label htmlFor={`price-${item.id}`} required>
                            {t("dashboard.price")}
                          </Label>

                          <Input
                            id={`price-${item.id}`}
                            name={`price-${item.id}`}
                            value={item.price}
                            type="number"
                            onChange={(e) =>
                              updateItemField(
                                group.id,
                                item.id,
                                "price",
                                e.target.value,
                              )
                            }
                            placeholder="Price"
                            rightAdornment={
                              <span className="rounded-[10px] border border-[rgba(7,33,38,0.10)] bg-white px-3 py-2 text-sm font-semibold text-grayish">
                                {siteCurrencySymbol}
                              </span>
                            }
                          />
                        </div>

                        <div className="col-span-2 md:col-span-6">
                          <Label htmlFor={`discount-${item.id}`}>
                            {t("dashboard.discount")}
                          </Label>

                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_96px]">
                            <Input
                              id={`discount-${item.id}`}
                              name={`discount-${item.id}`}
                              value={item.discount_amount}
                              type="number"
                              onChange={(e) =>
                                updateItemField(
                                  group.id,
                                  item.id,
                                  "discount_amount",
                                  e.target.value,
                                )
                              }
                              placeholder="Discount"
                            />

                            <ReactSelectInput
                              id={`discount-type-${item.id}`}
                              options={discountTypeOptions}
                              value={item.discount_type}
                              onChange={(value) =>
                                updateItemField(
                                  group.id,
                                  item.id,
                                  "discount_type",
                                  value,
                                )
                              }
                              placeholder="Type"
                              size="lg"
                            />
                          </div>
                        </div>

                        <div className="col-span-2 md:col-span-12">
                          <Label htmlFor={`qty-${item.id}`} required>
                            {t("dashboard.quantity")}
                          </Label>

                          <Input
                            id={`qty-${item.id}`}
                            name={`qty-${item.id}`}
                            value={item.qty}
                            type="number"
                            onChange={(e) =>
                              updateItemField(
                                group.id,
                                item.id,
                                "qty",
                                e.target.value,
                              )
                            }
                            placeholder="Quantity"
                          />
                        </div>

                        <div className="col-span-2 flex justify-end md:col-span-12">
                          <button
                            type="button"
                            onClick={() =>
                              removeItemFromGroup(group.id, item.id)
                            }
                            className={`${circleButtonClass} bg-error text-white hover:bg-red-600`}
                            aria-label="Remove attribute item"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="border-t border-[rgba(7,33,38,0.08)] pt-4">
                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => addItemToGroup(group.id)}
                        className={`${circleButtonClass} bg-dark text-white hover:bg-grayish`}
                        aria-label="Add attribute item"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {attributeGroups.length === 0 && (
        <div className="rounded-[12px] border border-dashed border-[rgba(7,33,38,0.16)] p-6 text-center">
          <p className="text-sm text-grayish/60">
            {t("dashboard.noAttributeGroupAddedYet")}
          </p>
        </div>
      )}
    </div>
  );
};

export default AttributesTabContent;
