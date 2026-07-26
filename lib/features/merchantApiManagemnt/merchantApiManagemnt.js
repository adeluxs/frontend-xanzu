import { apiSlice } from "../api/apiSlice";
import { toast } from "react-toastify";

export const merchantApiManagementApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // get credential
    getApiCredentials: builder.query({
      query: () => ({
        url: "/merchant/api-management",
        method: "GET",
      }),
      providesTags: ["Auth", "APICredential"],
    }),

    // generate credential
    generateCredential: builder.mutation({
      query: () => ({
        url: "/merchant/api-management/generate",
        method: "POST",
      }),
      invalidatesTags: ["APICredential"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message || "Generate Credential successful!");
        } catch (err) {
          const message =
            err?.data?.message ||
            err?.error?.data?.message ||
            err?.error?.message ||
            "Failed Generate Credential. Try again later.";
          toast.error(message);
        }
      },
    }),
  }),
});

export const { useGetApiCredentialsQuery, useGenerateCredentialMutation } =
  merchantApiManagementApi;
