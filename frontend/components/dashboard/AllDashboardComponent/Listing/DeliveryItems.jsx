"use client";

import LoadingSpinner from "@/components/common/LoadingSpinner";
import NoDataFound from "@/components/common/NoDataFound";
import Button from "@/components/ui/button/Button";
import Label from "@/components/ui/forms/input/Label";
import TextArea from "@/components/ui/forms/input/TextArea";
import { useT } from "@/context/TranslationContext";
import {
  useGetDeliveryProductQuery,
  useUpdateDeliveryProductMutation,
} from "@/lib/features/addProduct/addProductApi";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const DeliveryItems = () => {
  const params = useParams();
  const id = params?.id;
  const t = useT();

  const [deliveryValues, setDeliveryValues] = useState([]);

  const { data, currentData, isLoading, isFetching, isError } =
    useGetDeliveryProductQuery(id, {
      skip: !id,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    });

  const [updateDeliveryProduct, { isLoading: isUpdating }] =
    useUpdateDeliveryProductMutation();

  const deliveryData = currentData ?? data;
  const listing = deliveryData?.data?.listing;
  const deliveryItems = useMemo(
    () => deliveryData?.data?.delivery_items || [],
    [deliveryData],
  );

  useEffect(() => {
    setDeliveryValues(deliveryItems.map((item) => item?.data ?? ""));
  }, [deliveryItems]);

  const handleValueChange = (index, value) => {
    setDeliveryValues((prev) => {
      const nextValues = [...prev];
      nextValues[index] = value;
      return nextValues;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!id) return;

    const payload = {
      delivery_items: deliveryItems
        .map((item, index) => ({ item, value: deliveryValues[index] ?? "" }))
        .filter(({ item }) => !item?.is_used)
        .map(({ item, value }) => ({
          id: item?.id,
          data: value,
        })),
    };

    try {
      await updateDeliveryProduct({
        id,
        data: payload,
      }).unwrap();
    } catch {}
  };

  if (!id) {
    return (
      <div className="dashboard-top-gap">
        <NoDataFound message={t("dashboard.invalidProductId")} />
      </div>
    );
  }

  if (isLoading || (isFetching && !currentData)) {
    return (
      <div className="dashboard-top-gap">
        <LoadingSpinner message={t("dashboard.loadingDeliveryItems")} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="dashboard-top-gap">
        <NoDataFound message={t("dashboard.unableToLoadDeliveryItems")} />
      </div>
    );
  }

  if (!deliveryItems.length) {
    return (
      <div className="dashboard-top-gap">
        <NoDataFound message={t("dashboard.noDeliveryItemsFound")} />
      </div>
    );
  }

  const hasEditableItems = deliveryItems.some((item) => !item?.is_used);

  return (
    <div className="dashboard-top-gap">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-12">
          {deliveryItems.map((item, index) => {
            const isReadOnly = Boolean(item?.is_used);

            return (
              <div key={item?.id || index} className="col-span-2 md:col-span-6">
                <Label
                  htmlFor={`delivery-item-${index}`}
                  required={!isReadOnly}
                >
                  Delivery Item {index + 1}
                </Label>
                <TextArea
                  id={`delivery-item-${index}`}
                  name={`delivery-item-${index}`}
                  rows={4}
                  value={deliveryValues[index] ?? ""}
                  onChange={(event) =>
                    handleValueChange(index, event.target.value)
                  }
                  readOnly={isReadOnly}
                  required={!isReadOnly}
                  hint={
                    isReadOnly ? t("dashboard.deliveryItemAlreadyUsed") : ""
                  }
                />
              </div>
            );
          })}

          <div className="col-span-2 md:col-span-12">
            <Button
              type="submit"
              variant="primary-filled"
              size="lg"
              rounded="lg"
              disabled={!hasEditableItems}
              loading={isUpdating}
            >
              {t("dashboard.updateDeliveryItems")}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DeliveryItems;
