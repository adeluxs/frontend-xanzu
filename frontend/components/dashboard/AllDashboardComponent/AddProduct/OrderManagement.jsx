"use client";

import Badge from "@/components/common/Badge";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import NoDataFound from "@/components/common/NoDataFound";
import Pagination from "@/components/common/Pagination";
import Input from "@/components/ui/forms/input/InputField";
import { useT } from "@/context/TranslationContext";
import { useDocumentDirection } from "@/hooks/useDocumentDirection";
import { EyeIcon, SearchIcon } from "@/icons";
import { useGetMyOrderProductQuery } from "@/lib/features/addProduct/addProductApi";
import Link from "next/link";
import { useState } from "react";

const PER_PAGE = 8;

const formatText = (value) => {
  if (!value) return "N/A";

  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const OrderManagement = () => {
  const dir = useDocumentDirection();
  const isRTL = dir === "rtl";
  const t = useT();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, currentData, isLoading, isFetching } =
    useGetMyOrderProductQuery(
      {
        search,
        page: currentPage,
        per_page: PER_PAGE,
      },
      {
        refetchOnFocus: true,
        refetchOnReconnect: true,
      },
    );

  const showOrdersLoading = isLoading || (isFetching && !currentData);
  const orderData = showOrdersLoading ? currentData : (currentData ?? data);
  const orders = orderData?.data?.items || [];
  const meta = orderData?.meta || data?.meta || {};
  const lastPage = Math.max(
    1,
    Number(meta?.last_page) ||
      Math.ceil(
        (Number(meta?.total) || 0) / (Number(meta?.per_page) || PER_PAGE),
      ),
  );

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  return (
    <div className="dashboard-top-gap">
      <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
        <div className="relative">
          <Input
            type="text"
            id="search"
            name="search"
            placeholder={t("dashboard.searchProducts")}
            className="h-10 rounded-[10px] rtl:pr-9 ltr:pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
          <div
            className={`absolute top-1/2 -translate-y-1/2 ${
              isRTL ? "right-3.5" : "left-3.5"
            }`}
          >
            <SearchIcon className="h-4 w-4 text-[#8D999B]" />
          </div>
        </div>
      </div>

      <div className="rounded-[12px] border border-[rgba(7,33,38,0.16)] p-3 sm:p-5">
        <div className="full-responsive-table w-full overflow-x-auto">
          <div className="w-full min-w-[1100px]">
            <div className="table-wrapper">
              <table className="main-table">
                <thead>
                  <tr>
                    {[
                      t("dashboard.orderNumber"),
                      t("dashboard.productName"),
                      t("dashboard.listingType"),
                      t("dashboard.deliveryMethod"),
                      t("dashboard.orderStatus"),
                      t("dashboard.action"),
                    ].map((heading, index, arr) => (
                      <th
                        key={heading}
                        className={`th-design border-b border-t border-[#CEF5CE] bg-[#F3FDF3]
                          ${
                            index === 0
                              ? isRTL
                                ? "rounded-br-[10px] rounded-tr-[10px] border-r"
                                : "rounded-bl-[10px] rounded-tl-[10px] border-l"
                              : ""
                          }
                          ${
                            index === arr.length - 1
                              ? isRTL
                                ? "rounded-bl-[10px] rounded-tl-[10px] border-l"
                                : "rounded-br-[10px] rounded-tr-[10px] border-r"
                              : ""
                          }
                        `}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="table-body">
                  {showOrdersLoading ? (
                    <tr>
                      <td colSpan={6} className="td-design text-center">
                        <div className="mt-6 w-full">
                          <LoadingSpinner
                            message={t("dashboard.loadingOrders")}
                          />
                        </div>
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="td-design text-center">
                        <div className="mt-6 flex justify-center">
                          <NoDataFound message={t("dashboard.noOrdersFound")} />
                        </div>
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order?.id} className="tr-design">
                        <td className="td-design">
                          <span className="td-text font-medium">
                            #{order?.order_number || order?.order_id || "N/A"}
                          </span>
                        </td>

                        <td className="td-design max-w-[280px]">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="min-w-0">
                              <p className="td-text truncate font-medium">
                                {order?.product_name || "N/A"}
                              </p>
                              <p className="mt-0.5 text-xs text-grayish/60">
                                {t("dashboard.itemId")}: {order?.id || "N/A"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="td-design">
                          <span className="td-text">
                            {formatText(order?.listing_type)}
                          </span>
                        </td>

                        <td className="td-design">
                          <span className="td-text">
                            {formatText(order?.delivery_method)}
                          </span>
                        </td>

                        <td className="td-design">
                          <Badge
                            status={order?.order_status || order?.item_status}
                          />
                        </td>

                        <td className="td-design">
                          <Link
                            href={`/dashboard/order-management/${order?.id}`}
                            className="inline-flex h-8 items-center justify-center gap-1.5 rounded-[6px] bg-primary/15 px-3 text-sm font-medium text-grayish transition-colors hover:bg-primary/25"
                          >
                            <EyeIcon className="h-4 w-4" />
                            {t("dashboard.viewDetails")}
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <Pagination
          lastPage={lastPage}
          handlePageClick={handlePageClick}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
};

export default OrderManagement;
