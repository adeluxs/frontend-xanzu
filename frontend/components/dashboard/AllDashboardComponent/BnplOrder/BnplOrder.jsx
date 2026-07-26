"use client";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import NoDataFound from "@/components/common/NoDataFound";
import Pagination from "@/components/common/Pagination";
import Input from "@/components/ui/forms/input/InputField";
import { useT } from "@/context/TranslationContext";
import { useDocumentDirection } from "@/hooks/useDocumentDirection";
import { SearchIcon } from "@/icons";
import { useGetBnplAllProductQuery } from "@/lib/features/addProduct/addProductApi";
import { useState } from "react";

const PER_PAGE = 8;

const BnplOrder = () => {
  const dir = useDocumentDirection();
  const isRTL = dir === "rtl";
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const t = useT();

  const { data, currentData, isLoading, isFetching } =
    useGetBnplAllProductQuery(
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
  const orders = orderData?.data?.orders || [];
  const meta = orderData?.meta || data?.meta || {};
  const lastPage = Math.max(
    1,
    Math.ceil(
      (Number(meta?.total) || 0) / (Number(meta?.per_page) || PER_PAGE),
    ),
  );

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  return (
    <div className="dashboard-top-gap">
      <div className="flex justify-between items-center gap-3 flex-wrap mb-6">
        <div className="flex flex-wrap items-center gap-4">
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
            <div className="absolute top-1/2 -translate-y-1/2 left-3.5">
              <SearchIcon className="h-4 w-4 text-[#8D999B]" />
            </div>
          </div>
        </div>
      </div>

      <div className="border border-[rgba(7,33,38,0.16)] p-3 sm:p-5 rounded-[12px]">
        <div className="full-responsive-table w-full overflow-x-auto">
          <div className="w-full min-w-[1400px]">
            <div className="table-wrapper">
              <table className="main-table">
                <thead>
                  <tr>
                    {[
                      t("dashboard.idNumber"),
                      t("dashboard.productName"),
                      t("dashboard.customers"),
                      t("dashboard.quantity"),
                      t("dashboard.typeText"),
                      t("dashboard.amount"),
                      t("dashboard.category"),
                    ].map((heading, index, arr) => (
                      <th
                        key={index}
                        className={`th-design bg-[#F3FDF3] border-t border-b border-[#CEF5CE]
                          ${
                            index === 0
                              ? isRTL
                                ? "border-r rounded-tr-[10px] rounded-br-[10px]"
                                : "border-l rounded-tl-[10px] rounded-bl-[10px]"
                              : ""
                          }
                          ${
                            index === arr.length - 1
                              ? isRTL
                                ? "border-l rounded-tl-[10px] rounded-bl-[10px]"
                                : "border-r rounded-tr-[10px] rounded-br-[10px]"
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
                      <td colSpan={7} className="td-design text-center">
                        <div className="mt-6 w-full">
                          <LoadingSpinner
                            message={t("dashboard.loadingBnplOrders")}
                          />
                        </div>
                      </td>
                    </tr>
                  ) : orders?.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="td-design text-center">
                        <div className="mt-6 flex justify-center">
                          <NoDataFound
                            message={t("dashboard.noBnplOrdersFound")}
                          />
                        </div>
                      </td>
                    </tr>
                  ) : (
                    orders?.map((order, index) => (
                      <tr key={index} className="tr-design">
                        <td className="td-design">
                          <span className="td-text">{order?.order_id}</span>
                        </td>

                        <td className="td-design max-w-[220px]">
                          <div className="flex items-center gap-1.5">
                            {order?.product_image ? (
                              <img
                                src={order?.product_image}
                                alt={order?.order?.product_name}
                                className="h-7 w-7 shrink-0 rounded-sm object-cover"
                              />
                            ) : (
                              <div className="h-7 w-7 shrink-0 rounded-sm bg-grayish/10" />
                            )}
                            <span className="td-text">
                              {order?.product_name}
                            </span>
                          </div>
                        </td>

                        <td className="td-design">
                          <div className="flex items-center gap-2.5">
                            {order?.customer_image ? (
                              <img
                                src={order?.customer_image}
                                alt={order?.customer_name}
                                className="h-7 w-7 shrink-0 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-7 w-7 shrink-0 rounded-full bg-grayish/10" />
                            )}
                            <span className="td-text">
                              {order?.customer_name}
                            </span>
                          </div>
                        </td>

                        <td className="td-design">
                          <span className="td-text">{order?.quantity}</span>
                        </td>

                        <td className="td-design">
                          <span className="td-text">
                            {order?.type || "N/A"}
                          </span>
                        </td>

                        <td className="td-design">
                          <span className="td-text">
                            $ {order?.total_price}
                          </span>
                        </td>

                        <td className="td-design">
                          <span className="td-text">
                            {order?.category || "N/A"}
                          </span>
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

export default BnplOrder;
