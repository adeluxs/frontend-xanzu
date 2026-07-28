import {
  ApiManagementIcon,
  BnplOrderIcon,
  DashboardIcon,
  HistoryIcon,
  importIcon,
  importProductListingIcon,
  ListingIcon,
  NotificationIcon,
  OrderManagementIcon,
  PlusIcon,
  SettingsIcon,
  StoreManagementIcon,
  TransferIcon,
  WithdrawIcon,
} from "@/icons";

export const getNavSections = (t, totalPendingOrders = 0) => [
  {
    title: null,
    items: [
      {
        name: t("dashboard.dashboard"),
        href: "/dashboard",
        icon: DashboardIcon,
      },
    ],
  },
  {
    title: t("dashboard.salesOrders"),
    items: [
      {
        name: t("dashboard.listing"),
        href: "/dashboard/listing",
        icon: ListingIcon,
      },
      {
        name: t("dashboard.addProduct"),
        href: "/dashboard/add-product",
        icon: PlusIcon,
      },
      {
        name: t("dashboard.orderManagement"),
        href: "/dashboard/order-management",
        icon: OrderManagementIcon,
        badge: totalPendingOrders,
      },
      {
        name: t("dashboard.importProductListing"),
        href: "/dashboard/import-product-listings",
        icon: importProductListingIcon,
      },
      {
        name: t("dashboard.importProduct"),
        href: "/dashboard/import-product",
        icon: importIcon,
      },
      {
        name: t("dashboard.bnplOrder"),
        href: "/dashboard/bnpl-order",
        icon: BnplOrderIcon,
      },
    ],
  },
  {
    title: t("dashboard.finance"),
    items: [
      {
        name: t("dashboard.withdraw"),
        href: "/dashboard/withdraw",
        icon: WithdrawIcon,
      },
      {
        name: t("dashboard.sendMoney"),
        href: "/dashboard/transfer",
        icon: TransferIcon,
      },
      {
        name: t("dashboard.transactionHistory"),
        href: "/dashboard/history",
        icon: HistoryIcon,
      },
    ],
  },
  {
    title: t("dashboard.management"),
    items: [
      {
        name: t("dashboard.storeManagement"),
        href: "/dashboard/store-management",
        icon: StoreManagementIcon,
      },
      {
        name: t("dashboard.apiManagement"),
        href: "/dashboard/api-management",
        icon: ApiManagementIcon,
      },
    ],
  },
  {
    title: t("dashboard.others"),
    items: [
      {
        name: t("dashboard.notifications"),
        href: "/dashboard/notifications",
        icon: NotificationIcon,
      },
      {
        name: t("dashboard.settings"),
        href: "/dashboard/settings",
        icon: SettingsIcon,
      },
    ],
  },
];
