import { toast } from "react-toastify";
import { apiSlice } from "../api/apiSlice";

const flattenErrors = (errors) => {
  if (!errors || typeof errors !== "object") return [];

  return Object.values(errors).flatMap((value) => {
    if (Array.isArray(value)) return value.filter(Boolean).map(String);
    if (value && typeof value === "object") return flattenErrors(value);
    return value ? [String(value)] : [];
  });
};

const apiErrorMessage = (err, fallback) => {
  const payload = err?.error?.data || err?.data || err?.error || {};
  const validationMessages = flattenErrors(payload?.errors);

  return (
    validationMessages.slice(0, 4).join("\n") ||
    payload?.message ||
    err?.error?.message ||
    fallback
  );
};

export const userApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => ({
        url: "/user",
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: "/merchant/settings/profile",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message || "Profile updated successfully!");
        } catch (err) {
          toast.error(apiErrorMessage(err, "Failed to update profile"));
        }
      },
      invalidatesTags: ["user"],
    }),
  }),
});

export const { useGetUserQuery, useUpdateUserMutation } = userApi;
