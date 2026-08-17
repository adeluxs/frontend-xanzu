import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { isFeatureEnabled } from "@/lib/utils/featureFlags";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  timeout: 20000,
  prepareHeaders: (headers) => {
    const token = Cookies.get("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Accept", "application/json");
    return headers;
  },
});

const baseQueryWithServiceStatus = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  const errorPayload = result?.error?.data;
  const isSuspended =
    result?.error?.status === 503 &&
    (errorPayload?.code === "SERVICE_SUSPENDED" ||
      isFeatureEnabled(errorPayload?.data?.service_suspended));

  if (
    isSuspended &&
    typeof window !== "undefined" &&
    window.location.pathname !== "/service-suspended"
  ) {
    const message =
      errorPayload?.message || errorPayload?.data?.service_suspension_message;

    if (message) {
      try {
        window.sessionStorage.setItem("service_suspension_message", message);
      } catch {}
    }

    window.location.replace("/service-suspended");
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithServiceStatus,
  tagTypes: [
    "Auth",
    "History",
    "APICredential",
    "Settings",
    "user",
    "kycDetails",
    "allNotification",
    "Tickets",
    "SingleTicket",
    "WithdrawAccountDelete",
    "WithdrawAccountsCreate",
    "WithdrawAccountEdit",
    "Store",
    "ProductList",
    "MyProductList",
    "UpdateProduct",
    "UpdateDeliveryProduct",
  ],
  endpoints: (builder) => ({}),
});
