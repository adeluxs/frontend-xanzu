import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const token = Cookies.get("token");
      // If token exists, add it to headers
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
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
    "APICredential",
    "ProductList",
    "MyProductList",
    "UpdateProduct",
    "UpdateDeliveryProduct",
  ],
  endpoints: (builder) => ({}),
});
