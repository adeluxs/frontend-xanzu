"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const DashboardSalesChart = ({ charts, t }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const [activeRange, setActiveRange] = useState("monthly");
  const formatCurrencyValue = (value) => {
    const numericValue = Number(value) || 0;

    return `${new Intl.NumberFormat("en-US", {
      minimumFractionDigits: numericValue % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(numericValue)} USD`;
  };

  const chartSeries = useMemo(() => {
    const monthlyData = charts?.monthly || [];
    const weeklyData = charts?.weekly || [];

    if (activeRange === "weekly") {
      return {
        categories: weeklyData.map((item) => item.month),
        data: weeklyData.map((item) => item.amount),
      };
    }

    return {
      categories: monthlyData.map((item) => item.month),
      data: monthlyData.map((item) => item.amount),
    };
  }, [activeRange, charts]);

  const maxAmount = Math.max(...chartSeries.data, 0);
  const yAxisMax = maxAmount > 0 ? Math.ceil(maxAmount * 1.2) : 10;
  const yAxisTickAmount = Math.min(5, yAxisMax || 1);

  useEffect(() => {
    let isCancelled = false;

    const setupChart = async () => {
      const { default: ApexCharts } = await import("apexcharts");

      if (isCancelled || !chartRef.current) {
        return;
      }

      const options = {
        series: [
          {
            name: "Sales",
            data: chartSeries.data,
          },
        ],
        chart: {
          type: "area",
          height: 190,
          toolbar: { show: false },
          zoom: { enabled: false },
        },
        colors: ["#25CD25"],
        dataLabels: { enabled: false },
        stroke: {
          curve: "smooth",
          width: 2,
          dashArray: 4,
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 0.35,
            opacityFrom: 0.55,
            opacityTo: 0.1,
            stops: [0, 80, 100],
          },
        },
        grid: {
          borderColor: "rgba(7,33,38,0.1)",
          strokeDashArray: 4,
          padding: {
            left: 8,
            right: 8,
            top: 10,
            bottom: 0,
          },
        },
        xaxis: {
          categories: chartSeries.categories,
          axisBorder: { show: false },
          axisTicks: { show: false },
          labels: {
            style: {
              colors: "rgba(31,42,55,0.75)",
              fontSize: "12px",
              fontWeight: 500,
            },
          },
        },
        yaxis: {
          min: 0,
          max: yAxisMax,
          tickAmount: yAxisTickAmount,
          labels: {
            formatter: (value) => value.toFixed(0),
            style: {
              colors: "rgba(31,42,55,0.7)",
              fontSize: "12px",
              fontWeight: 500,
            },
          },
        },
        tooltip: {
          theme: "light",
          x: { show: false },
          y: {
            formatter: (value) => formatCurrencyValue(value),
          },
        },
        legend: { show: false },
      };

      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }

      chartRef.current.innerHTML = "";
      chartInstanceRef.current = new ApexCharts(chartRef.current, options);
      chartInstanceRef.current.render();
    };

    setupChart();

    return () => {
      isCancelled = true;

      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }

      if (chartRef.current) {
        chartRef.current.innerHTML = "";
      }
    };
  }, [chartSeries, yAxisMax, yAxisTickAmount]);

  return (
    <div className="h-full rounded-[16px] border border-[rgba(7,33,38,0.16)] bg-white p-3 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-grayish">
          {t("dashboard.sales")}
        </h3>
        <div className="flex items-center gap-3 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveRange("weekly")}
            className={`transition-colors ${
              activeRange === "weekly" ? "text-grayish" : "text-grayish/50"
            }`}
          >
            {t("dashboard.weekly")}
          </button>
          <button
            type="button"
            onClick={() => setActiveRange("monthly")}
            className={`transition-colors ${
              activeRange === "monthly" ? "text-grayish" : "text-grayish/50"
            }`}
          >
            {t("dashboard.monthly")}
          </button>
        </div>
      </div>
      <div className="mt-0" ref={chartRef} />
    </div>
  );
};

export default DashboardSalesChart;
