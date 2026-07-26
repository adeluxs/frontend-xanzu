import { apiSlice } from "../api/apiSlice";

export const orderCounterApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    orderCounter: builder.query({
      query: () => ({
        url: "/merchant/orders/pending-count",
        method: "GET",
      }),
    }),
  }),
});

export const { useOrderCounterQuery } = orderCounterApi;
