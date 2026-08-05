import { toast } from "react-toastify";
import { apiSlice } from "../api/apiSlice";

export const transferApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getTransferConfig: builder.query({
      query: () => ({
        url: "/merchant/transfer/config",
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),

    lookupTransferRecipient: builder.query({
      query: (phone) => ({
        url: `/merchant/transfer/lookup?phone=${encodeURIComponent(phone)}`,
        method: "GET",
      }),
    }),

    validateTransfer: builder.mutation({
      query: (data) => ({
        url: "/merchant/transfer/validate",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          return data;
        } catch (err) {
          const message =
            err?.data?.message ||
            err?.error?.data?.message ||
            "Validation failed. Try again.";
          toast.error(message);
        }
      },
    }),

    sendTransfer: builder.mutation({
      query: (data) => ({
        url: "/merchant/transfer",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["History"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message || "Transfer successful!");
          return data;
        } catch (err) {
          const message =
            err?.data?.message ||
            err?.error?.data?.message ||
            "Transfer failed. Try again later.";
          toast.error(message);
        }
      },
    }),
  }),
});

export const {
  useGetTransferConfigQuery,
  useLookupTransferRecipientQuery,
  useValidateTransferMutation,
  useSendTransferMutation,
} = transferApi;
