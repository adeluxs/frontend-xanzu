"use client";
import Button from "@/components/ui/button/Button";
import { useT } from "@/context/TranslationContext";
import { PlusIcon } from "@/icons";
import { useGetDashboardDataQuery } from "@/lib/features/dashboard/dashboardApi";
import DashboardLoadingSkeleton from "./DashboardLoadingSkeleton";
import DashboardRecentOrders from "./DashboardRecentOrders";
import DashboardSalesChart from "./DashboardSalesChart";
import DashboardStats from "./DashboardStats";
import DashboardTopPerformingProduct from "./DashboardTopPerformingProduct";

const DashboardLanding = () => {
  const { data: dashboardData, isLoading } = useGetDashboardDataQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
      pollingInterval: 5000,
    },
  );
  const header = dashboardData?.data?.header;
  const summary = dashboardData?.data?.summary;
  const charts = dashboardData?.data?.charts;
  const recentOrders = dashboardData?.data?.recent_orders;
  const topPerformingProducts = dashboardData?.data?.top_performing_products;
  const canAddNewListing = header?.actions?.add_new_listing;
  const t = useT();

  // loading skeleton
  if (isLoading) {
    return <DashboardLoadingSkeleton />;
  }

  return (
    <div className="dashboard-top-gap">
      <div className="flex justify-between items-center gap-3 flex-wrap border-b-2 border-dashed border-[rgba(7,33,38,0.16)] mb-7.5 pb-7.5">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-normal text-grayish/80">
          <span className="font-semibold text-grayish">{header?.welcome}</span>
        </h2>
        {canAddNewListing && (
          <div>
            <Button
              type="button"
              variant="primary-filled"
              size="compact"
              className=""
              rounded="md"
              href="/dashboard/add-product"
              startIcon={<PlusIcon className="h-5 w-5" />}
            >
              {t("dashboard.addProduct")}
            </Button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 3xl:grid-cols-12 gap-5 items-center">
        <div className="col-span-2 3xl:col-span-7">
          <DashboardStats summary={summary} t={t} />
        </div>
        <div className="col-span-2 3xl:col-span-5">
          <DashboardSalesChart charts={charts} t={t} />
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mt-5">
        <div>
          <DashboardRecentOrders recentOrders={recentOrders} t={t} />
        </div>
        <div>
          <DashboardTopPerformingProduct
            topPerformingProducts={topPerformingProducts}
            t={t}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardLanding;
