"use client";

import NoDataFound from "@/components/common/NoDataFound";
import { useDocumentDirection } from "@/hooks/useDocumentDirection";
import { SpikeIcon } from "@/icons";

const DashboardTopPerformingProduct = ({ topPerformingProducts = [], t }) => {
  const dir = useDocumentDirection();
  const isRTL = dir === "rtl";

  return (
    <div className="border border-[rgba(7,33,38,0.16)] p-3 sm:p-5 rounded-[12px]">
      <h4 className="text-xl font-semibold text-grayish mb-5">
        {t("dashboard.topPerformingProducts")}
      </h4>
      {topPerformingProducts.length === 0 ? (
        <NoDataFound message={t("dashboard.noTopPerformingProductsFound")} />
      ) : (
        <div className="full-responsive-table w-full overflow-x-auto">
          <div className="w-full min-w-[600px]">
            <div className="table-wrapper">
              <table className="main-table">
                <thead>
                  <tr>
                    {[
                      t("dashboard.productName"),
                      t("dashboard.order"),
                      t("dashboard.amount"),
                      t("dashboard.status"),
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
                  {topPerformingProducts.map((product, index) => (
                    <tr key={index} className="tr-design">
                      <td className="td-design max-w-[200px]">
                        <span className="td-text">{product?.product_name}</span>
                      </td>
                      <td className="td-design">
                        <span className="td-text">{product?.orders}</span>
                      </td>
                      <td className="td-design">
                        <span className="td-text">{product?.amount}</span>
                      </td>
                      <td className="td-design">
                        <div className="flex items-center gap-2">
                          <SpikeIcon className="h-4.6 w-4.5 text-yellow-500" />
                          <span
                            className={`td-text ${
                              product?.status === "Trending" ||
                              product?.status === "Normal"
                                ? "!text-grayish"
                                : product.status === "Pending"
                                  ? "!text-yellow-500"
                                  : "!text-error"
                            }`}
                          >
                            {product?.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardTopPerformingProduct;
