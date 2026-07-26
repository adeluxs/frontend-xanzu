import { toast } from "react-toastify";
import { apiSlice } from "../api/apiSlice";

export const withdrawApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // get methods
    getMethods: builder.query({
      query: () => ({
        url: "/get-withdraw-methods",
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),

    // get withdraw accounts
    getWithdrawAccounts: builder.query({
      query: ({ page = 1 } = {}) => ({
        url: `/merchant/withdraw-account?page=${page}`,
        method: "GET",
      }),
      providesTags: [
        "WithdrawAccountDelete",
        "WithdrawAccountsCreate",
        "WithdrawAccountEdit",
        "Auth",
      ],
    }),

    // get single withdraw account
    getWithdrawAccount: builder.query({
      query: (id) => ({
        url: `/merchant/withdraw-account/${id}`,
        method: "GET",
      }),
      providesTags: ["WithdrawAccountEdit"],
    }),

    // delete withdraw account
    deleteWithdrawAccount: builder.mutation({
      query: ({ id, _method }) => ({
        url: `/merchant/withdraw-account/${id}`,
        method: "POST",
        body: { _method },
      }),
      invalidatesTags: ["WithdrawAccountDelete"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message || "Account deleted successfully!");
        } catch (err) {
          const message =
            err?.error?.data?.message || "Failed to delete account. Try again.";
          toast.error(message);
        }
      },
    }),

    // edit withdraw account
    editWithdrawAccount: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/merchant/withdraw-account/${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["WithdrawAccountEdit"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message || "Account updated successfully!");
        } catch (err) {
          const message =
            err?.error?.data?.message || "Failed to update account. Try again.";
          toast.error(message);
        }
      },
    }),

    // create withdraw account
    createWithdrawAccount: builder.mutation({
      query: (data) => ({
        url: "/merchant/withdraw-account",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["WithdrawAccountsCreate"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message || "Withdraw account create successful!");
        } catch (err) {
          const message =
            err?.data?.message ||
            err?.error?.data?.message ||
            err?.error?.message ||
            "Failed to create withdraw account. Try again later.";
          toast.error(message);
        }
      },
    }),

    // withdraw money
    withdrawNow: builder.mutation({
      query: (data) => ({
        url: "/merchant/withdraw",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["History"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message || "Withdraw money successful!");
        } catch (err) {
          const message =
            err?.data?.message ||
            err?.error?.data?.message ||
            err?.error?.message ||
            "Failed withdraw money. Try again later.";
          toast.error(message);
        }
      },
    }),
  }),
});

export const {
  useGetMethodsQuery,
  useCreateWithdrawAccountMutation,
  useGetWithdrawAccountsQuery,
  useDeleteWithdrawAccountMutation,
  useEditWithdrawAccountMutation,
  useGetWithdrawAccountQuery,
  useWithdrawNowMutation,
} = withdrawApi;
