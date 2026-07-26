import { apiSlice } from "../api/apiSlice";

export const dashboardApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // get all notification
    getDashboardData: builder.query({
      query: ({ page = 1 } = {}) => ({
        url: `/merchant/dashboard`,
        method: "GET",
      }),
      providesTags: ["History", "Auth"],
    }),
  }),
});

export const { useGetDashboardDataQuery } = dashboardApi;
