"use client";

import NoDataFound from "@/components/common/NoDataFound";
import { useDocumentDirection } from "@/hooks/useDocumentDirection";

const DashboardRecentOrders = ({ recentOrders = [], t }) => {
  const dir = useDocumentDirection();
  const isRTL = dir === "rtl";
  return (
    <div className="border border-[rgba(7,33,38,0.16)] p-3 sm:p-5 rounded-[12px]">
      <h4 className="text-xl font-semibold text-grayish mb-5">
        {t("dashboard.recentOrders")}
      </h4>
      {recentOrders.length === 0 ? (
        <NoDataFound message={t("dashboard.noRecentOrderFound")} />
      ) : (
        <div className="full-responsive-table w-full overflow-x-auto">
          <div className="w-full min-w-[600px]">
            <div className="table-wrapper">
              <table className="main-table border-collapse">
                <thead>
                  <tr>
                    {[
                      t("dashboard.orderId"),
                      t("dashboard.customer"),
                      t("dashboard.plan"),
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
                  {recentOrders.map((order) => (
                    <tr key={order?.order_id} className="tr-design">
                      <td className="td-design">
                        <span className="td-text">{order?.order_id}</span>
                      </td>
                      <td className="td-design">
                        <span className="td-text">{order?.customer}</span>
                      </td>
                      <td className="td-design">
                        <span className="td-text">{order?.plan}</span>
                      </td>
                      <td className="td-design">
                        <span
                          className={`td-text ${
                            order.status === "Success"
                              ? "!text-success"
                              : order.status === "Pending"
                                ? "!text-yellow-500"
                                : "!text-error"
                          }`}
                        >
                          {order?.status}
                        </span>
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

export default DashboardRecentOrders;
