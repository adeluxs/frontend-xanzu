"use client";
import Badge from "@/components/common/Badge";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import NoDataFound from "@/components/common/NoDataFound";
import Pagination from "@/components/common/Pagination";
import Input from "@/components/ui/forms/input/InputField";
import { useT } from "@/context/TranslationContext";
import { useDocumentDirection } from "@/hooks/useDocumentDirection";
import { SearchIcon } from "@/icons";
import { useGetHistoryQuery } from "@/lib/features/history/historyApi";
import { formatType } from "@/utils/utils";
import { useState } from "react";

const TransactionHistory = () => {
  const dir = useDocumentDirection();
  const isRTL = dir === "rtl";
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { data, currentData, isLoading, isFetching } = useGetHistoryQuery(
    {
      search,
      page: currentPage,
    },
    {
      refetchOnFocus: true,
      refetchOnReconnect: true,
      pollingInterval: 10000,
    },
  );

  const showTransactionsLoading = isLoading || (isFetching && !currentData);
  const historyData = showTransactionsLoading
    ? currentData
    : (currentData ?? data);
  const transactions = historyData?.data?.transactions || [];
  const lastPage = historyData?.meta?.last_page || data?.meta?.last_page || 1;
  const t = useT();

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
              placeholder={t("dashboard.searchTransactions")}
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
          <div className="w-full min-w-[900px]">
            <div className="table-wrapper">
              <table className="main-table">
                <thead>
                  <tr>
                    {[
                      t("dashboard.transactionId"),
                      t("dashboard.description"),
                      t("dashboard.date"),
                      t("dashboard.typeText"),
                      t("dashboard.amount"),
                      t("dashboard.status"),
                      t("dashboard.method"),
                    ].map((heading, index, arr) => (
                      <th
                        key={heading}
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
                  {showTransactionsLoading ? (
                    <tr>
                      <td colSpan={7} className="td-design text-center">
                        <div className="mt-6 w-full">
                          <LoadingSpinner
                            message={t("dashboard.loadingTransactions")}
                          />
                        </div>
                      </td>
                    </tr>
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="td-design text-center">
                        <div className="mt-6 flex justify-center">
                          <NoDataFound
                            message={t("dashboard.noTransactionFound")}
                          />
                        </div>
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx) => (
                      <tr key={tx?.id} className="tr-design">
                        <td className="td-design">
                          <span className="td-text">{tx?.tnx}</span>
                        </td>

                        <td className="td-design max-w-[220px]">
                          <div className="space-y-1">
                            <p className="td-text">{tx?.description}</p>
                            {tx?.order_id ? (
                              <p className="text-sm text-grayish/80">
                                Order #{tx?.order_id}
                              </p>
                            ) : null}
                          </div>
                        </td>

                        <td className="td-design">
                          <div className="space-y-1">
                            <p className="td-text">{tx?.created_at}</p>
                          </div>
                        </td>

                        <td className="td-design">
                          <span className="td-text">
                            {formatType(tx?.type)}
                          </span>
                        </td>

                        <td className="td-design">
                          <div className="space-y-1">
                            <p className="td-text">
                              {tx?.final_amount} {tx?.pay_currency}
                            </p>
                          </div>
                        </td>

                        <td className="td-design">
                          <Badge status={tx?.status} />
                        </td>

                        <td className="td-design">
                          <span className="td-text">{tx?.method}</span>
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

export default TransactionHistory;
