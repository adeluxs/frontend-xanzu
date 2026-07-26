import Button from "@/components/ui/button/Button";
import { DownloadIcon, HistoryIcon, SpikeIcon, WalletIcon } from "@/icons";
import Image from "next/image";

const DashboardStats = ({ summary, t }) => {
  const statCards = [
    {
      key: "sales",
      title: t("dashboard.totalSales"),
      value: summary?.total_sales_bnpl?.amount || "0.00 USD",
      change: summary?.total_sales_bnpl?.change_vs_last_week ?? 0,
      image: "/assets/dashboard-page/dashboard-landing-page/total-sales.svg",
    },
    {
      key: "orders",
      title: t("dashboard.totalOrders"),
      value: `${summary?.total_orders?.count ?? 0} Orders`,
      change: summary?.total_orders?.change_vs_last_week ?? 0,
      image: "/assets/dashboard-page/dashboard-landing-page/total-order.svg",
    },
    {
      key: "withdraw",
      title: t("dashboard.totalWithdraw"),
      value: summary?.total_withdraw?.amount || "0.00 USD",
      change: summary?.total_withdraw?.change_vs_last_week ?? 0,
      image: "/assets/dashboard-page/dashboard-landing-page/total-withdraw.svg",
    },
    {
      key: "product",
      title: t("dashboard.totalProduct"),
      value: `${summary?.total_product?.count ?? 0}`,
      image: "/assets/dashboard-page/dashboard-landing-page/total-product.svg",
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-12 gap-5 items-center">
      <div className="col-span-2 xl:col-span-5 h-full">
        <div className="p-5 border-l border-r border-b border-t-5 border-[#88E788] rounded-[12px] bg-[#E7FAE7] h-full">
          <div className="w-10 h-10 bg-[#88E788] rounded-[15px] flex justify-center items-center">
            <WalletIcon className="w-5 h-5" />
          </div>
          <div className="mt-5">
            <p className="text-grayish/60 font-semibold text-base mb-2.5">
              {t("dashboard.totalBalance")}
            </p>
            <h3 className="text-grayish font-semibold text-3xl mb-1">
              {summary?.total_balance || "0.00 USD"}
            </h3>
            {/* <p className="text-grayish/60 font-normal text-sm">
              {t("dashboard.availableBalance")}:{" "}
              {summary?.available_balance || "0.00 USD"}
            </p> */}
          </div>
          <div className="mt-10 flex items-center gap-3 sm:gap-4">
            <Button
              type="button"
              variant="secondary-filled"
              size="compact"
              className="min-w-0 flex-1"
              rounded="md"
              href="/dashboard/history"
              startIcon={<HistoryIcon className="h-5 w-5" />}
            >
              {t("dashboard.history")}
            </Button>
            <Button
              type="button"
              variant="primary-filled"
              size="compact"
              className="min-w-0 flex-1"
              rounded="md"
              href="/dashboard/withdraw"
              startIcon={<DownloadIcon className="h-5 w-5" />}
            >
              {t("dashboard.withdraw")}
            </Button>
          </div>
        </div>
      </div>
      <div className="col-span-2 xl:col-span-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {statCards.map((card) => {
            const numericChange = Number(card.change);
            const isNegativeChange =
              typeof card.change !== "undefined" && numericChange < 0;

            return (
              <div key={card.key} className="h-full">
                <div className="border border-[rgba(7,33,38,0.16)] rounded-[12px] p-4 h-full">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#E6FAE6] rounded-[15px] flex justify-center items-center">
                      <Image
                        src={card.image}
                        alt={card.title}
                        width={50}
                        height={40}
                        className="w-[22px] h-[22px] object-contain"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-grayish/60 mb-1">
                        {card.title}
                      </p>
                      <h5 className="text-lg font-semibold text-grayish">
                        {card.value}
                      </h5>
                    </div>
                  </div>
                  {typeof card.change !== "undefined" && (
                    <div className="flex items-center gap-2.5 mt-3.5">
                      <SpikeIcon
                        className={`h-6 w-6 ${
                          isNegativeChange
                            ? "rotate-180 text-error"
                            : "text-[#00B69B]"
                        }`}
                      />
                      <p
                        className={`text-sm font-normal ${
                          isNegativeChange ? "text-error" : "text-grayish/80"
                        }`}
                      >
                        {card.change}% {t("dashboard.vsLastWeek")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
