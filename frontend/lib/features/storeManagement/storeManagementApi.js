import { toast } from "react-toastify";
import { apiSlice } from "../api/apiSlice";

export const storeManagementApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // get store
    getStore: builder.query({
      query: () => ({
        url: "/merchant/store-management/provider",
        method: "GET",
      }),
      providesTags: ["Auth", "Store"],
    }),

    // create & update store
    createStore: builder.mutation({
      query: (data) => ({
        url: "/merchant/store-management/provider",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Store"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message || "Create Store successful!");
        } catch (err) {
          const message =
            err?.data?.message ||
            err?.error?.data?.message ||
            err?.error?.message ||
            "Failed To Create Store. Try again later.";
          toast.error(message);
        }
      },
    }),
  }),
});

export const { useGetStoreQuery, useCreateStoreMutation } = storeManagementApi;
