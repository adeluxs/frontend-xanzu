"use client";

import Badge from "@/components/common/Badge";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import NoDataFound from "@/components/common/NoDataFound";
import Button from "@/components/ui/button/Button";
import Label from "@/components/ui/forms/input/Label";
import ReactSelectInput from "@/components/ui/forms/input/ReactSelect";
import TextArea from "@/components/ui/forms/input/TextArea";
import { useT } from "@/context/TranslationContext";
import { useDocumentDirection } from "@/hooks/useDocumentDirection";
import {
  useGetMyOrderSingleProductQuery,
  useUpdateDeliveryItemsMutation,
  useUpdateOrderStatusMutation,
} from "@/lib/features/addProduct/addProductApi";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { normalizeMediaSource } from "@/utils/media";

const formatText = (value) => {
  if (!value) return "N/A";

  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const DetailCard = ({ title, children, className = "" }) => (
  <div
    className={`rounded-[12px] border border-[rgba(7,33,38,0.12)] bg-white p-4 sm:p-5 ${className}`}
  >
    <p className="text-base font-semibold uppercase text-grayish">{title}</p>
    <div className="mt-3">{children}</div>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex items-start justify-between gap-3 border-b border-[rgba(7,33,38,0.08)] py-2.5 last:border-b-0 last:pb-0 first:pt-0">
    <span className="text-sm text-grayish/70">{label}</span>
    <span className="text-right text-sm font-medium text-grayish">
      {value || "N/A"}
    </span>
  </div>
);

const OrderManagementDetails = () => {
  const { id } = useParams();
  const dir = useDocumentDirection();
  const isRTL = dir === "rtl";
  const t = useT();
  const [selectedStatus, setSelectedStatus] = useState("");
  const [deliveryValues, setDeliveryValues] = useState([]);

  const siteCurrencySymbol = useSelector(
    (state) => state?.settings?.settings?.currency_symbol,
  );

  const { data, isLoading, isFetching, refetch } =
    useGetMyOrderSingleProductQuery(id, {
      skip: !id,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    });
  const [updateOrderStatus, { isLoading: isUpdatingStatus }] =
    useUpdateOrderStatusMutation();
  const [updateDeliveryItems, { isLoading: isUpdatingDelivery }] =
    useUpdateDeliveryItemsMutation();

  const item = data?.data?.item;
  const shipping = item?.shipping_address;
  const buyer = item?.buyer;
  const existingDeliveryItems = useMemo(
    () => item?.delivery_items || [],
    [item?.delivery_items],
  );
  const showLoading = isLoading || isFetching;
  const deliveryItemCount = Math.max(
    1,
    Number(item?.quantity) || 1,
    existingDeliveryItems.length,
  );
  const shouldShowActionCard = item?.can_mark_delivered === true;
  const shouldShowStatusUpdate =
    shouldShowActionCard && item?.listing_type === "physical";
  const shouldShowDeliveryItems =
    shouldShowActionCard && item?.listing_type !== "physical";

  useEffect(() => {
    setDeliveryValues(
      Array.from(
        { length: deliveryItemCount },
        (_, index) => existingDeliveryItems[index]?.data || "",
      ),
    );
  }, [deliveryItemCount, existingDeliveryItems]);

  const handleUpdateStatus = async (event) => {
    event.preventDefault();
    if (!id || !selectedStatus) return;

    try {
      await updateOrderStatus({
        id,
        data: {
          status: selectedStatus,
        },
      }).unwrap();

      setSelectedStatus("");
      refetch();
    } catch {}
  };

  const handleDeliveryValueChange = (index, value) => {
    setDeliveryValues((prev) => {
      const nextValues = [...prev];
      nextValues[index] = value;
      return nextValues;
    });
  };

  const handleUpdateDelivery = async (event) => {
    event.preventDefault();
    if (!id) return;

    const formData = new FormData();
    deliveryValues.forEach((value, index) => {
      if (existingDeliveryItems[index]?.id) {
        formData.append(
          `delivery_items[${index}][id]`,
          String(existingDeliveryItems[index].id),
        );
      }
      formData.append(`delivery_items[${index}][data]`, value ?? "");
    });

    try {
      await updateDeliveryItems({
        id,
        data: formData,
      }).unwrap();

      refetch();
    } catch {}
  };

  if (showLoading) {
    return (
      <div className="dashboard-top-gap">
        <div className="rounded-[12px] border border-[rgba(7,33,38,0.16)] p-6">
          <LoadingSpinner message={t("dashboard.loadingOrderDetails")} />
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="dashboard-top-gap">
        <div className="rounded-[12px] border border-[rgba(7,33,38,0.16)] p-6">
          <NoDataFound message={t("dashboard.noOrderDetailsFound")} />
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-top-gap">
      <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl font-semibold text-grayish">
            {t("dashboard.order")} #
            {item?.order_number || item?.order_id || "N/A"}
          </h2>
          <p className="mt-1 text-sm text-grayish/70">
            {item?.product_name || "N/A"}
          </p>
        </div>

        <Link
          href="/dashboard/order-management"
          className="inline-flex h-10 items-center justify-center rounded-[8px] border border-primary/20 bg-primary/10 px-4 text-sm font-medium text-grayish transition-colors hover:bg-primary/20"
        >
          {t("dashboard.back")}
        </Link>
      </div>

      <div className="rounded-[12px] border border-[rgba(7,33,38,0.16)] p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
          <DetailCard
            title={t("dashboard.orderStatus")}
            className="xl:col-span-2"
          >
            <InfoRow
              label={t("dashboard.orderNumber")}
              value={`#${item?.order_number || item?.order_id || "N/A"}`}
            />
            <div className="flex items-start justify-between gap-3 border-b border-[rgba(7,33,38,0.08)] py-2.5">
              <span className="text-sm text-grayish/70">
                {t("dashboard.orderStatus")}
              </span>
              <Badge status={item?.order_status} />
            </div>
            <InfoRow
              label={t("dashboard.orderDate")}
              value={item?.order_date}
            />
            <div className="flex items-start justify-between gap-3 pt-2.5">
              <span className="text-sm text-grayish/70">
                {t("dashboard.itemStatus")}
              </span>
              <Badge status={item?.item_status} />
            </div>
          </DetailCard>

          <DetailCard
            title={t("dashboard.productDetails")}
            className="xl:col-span-2"
          >
            <InfoRow label={t("dashboard.quantity")} value={item?.quantity} />
            <InfoRow
              label={t("dashboard.unitPrice")}
              value={
                item?.unit_price !== undefined && item?.unit_price !== null
                  ? `${siteCurrencySymbol || "$"}${item.unit_price}`
                  : "N/A"
              }
            />
            <InfoRow
              label={t("dashboard.amount")}
              value={
                item?.total_price !== undefined && item?.total_price !== null
                  ? `${siteCurrencySymbol || "$"}${item.total_price}`
                  : "N/A"
              }
            />
            <InfoRow
              label={t("dashboard.productName")}
              value={item?.product_name}
            />
            <div className="pt-2.5">
              <span className="mb-2 block text-sm text-grayish/70">
                {t("dashboard.productImage")}
              </span>
              {item?.product_image ? (
                <img
                  src={normalizeMediaSource(item.product_image)}
                  alt={item?.product_name || "Product"}
                  className="h-20 w-20 rounded-[12px] object-cover"
                />
              ) : (
                <div className="h-20 w-20 rounded-[12px] bg-grayish/10" />
              )}
            </div>
          </DetailCard>

          <DetailCard
            title={t("dashboard.buyerShipping")}
            className="xl:col-span-2"
          >
            <InfoRow label={t("dashboard.name")} value={buyer?.name} />
            <InfoRow label={t("dashboard.email")} value={buyer?.email} />
            <InfoRow label={t("dashboard.phone")} value={buyer?.phone} />
            <InfoRow label={t("dashboard.name")} value={shipping?.full_name} />
            <InfoRow
              label={t("dashboard.shippingPhone")}
              value={shipping?.phone}
            />
            <InfoRow label={t("dashboard.region")} value={shipping?.region} />
            <InfoRow label={t("dashboard.city")} value={shipping?.city} />
            <InfoRow label={t("dashboard.address")} value={shipping?.address} />
            <InfoRow
              label={t("dashboard.addressType")}
              value={formatText(shipping?.type)}
            />
          </DetailCard>

          {shouldShowStatusUpdate ? (
            <DetailCard title="Update Order Status" className="xl:col-span-2">
              <form onSubmit={handleUpdateStatus}>
                <div className="grid grid-cols-12 gap-5">
                  <div className="col-span-12">
                    <Label required>{t("dashboard.orderStatus")}</Label>
                    <ReactSelectInput
                      options={[{ label: "Delivered", value: "delivered" }]}
                      placeholder={t("dashboard.select")}
                      value={selectedStatus}
                      onChange={setSelectedStatus}
                      disabled={!item?.can_mark_delivered || isUpdatingStatus}
                    />
                  </div>
                  <div className="col-span-12">
                    <div>
                      <Button
                        type="submit"
                        variant="primary-filled"
                        size="lg"
                        className=""
                        rounded="lg"
                        disabled={isUpdatingStatus}
                        loading={isUpdatingStatus}
                      >
                        {t("dashboard.updateStatus")}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </DetailCard>
          ) : shouldShowDeliveryItems ? (
            <DetailCard title="Delivery items" className="xl:col-span-2">
              <form onSubmit={handleUpdateDelivery}>
                <div className="grid grid-cols-12 gap-5">
                  {Array.from({ length: deliveryItemCount }).map((_, index) => (
                    <div key={index} className="col-span-12">
                      <Label required>{`Delivery Item ${index + 1}`}</Label>
                      <TextArea
                        value={deliveryValues[index] ?? ""}
                        onChange={(event) =>
                          handleDeliveryValueChange(index, event.target.value)
                        }
                        required
                        disabled={isUpdatingDelivery}
                      />
                    </div>
                  ))}
                  <div className="col-span-12">
                    <div>
                      <Button
                        type="submit"
                        variant="primary-filled"
                        size="lg"
                        className=""
                        rounded="lg"
                        disabled={isUpdatingDelivery}
                        loading={isUpdatingDelivery}
                      >
                        {t("dashboard.updateDelivery")}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </DetailCard>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default OrderManagementDetails;
