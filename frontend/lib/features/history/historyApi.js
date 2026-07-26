import { apiSlice } from "../api/apiSlice";

export const historyApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // get methods
    getHistory: builder.query({
      query: ({ search = "", page = 1 } = {}) => ({
        url: "/merchant/transactions",
        method: "GET",
        params: {
          ...(search && { search }),
          page,
          per_page: 8,
        },
      }),
      providesTags: ["History", "Auth"],
    }),
  }),
});

export const { useGetHistoryQuery } = historyApi;
