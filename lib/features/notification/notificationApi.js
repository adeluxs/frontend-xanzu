import { toast } from "react-toastify";
import { apiSlice } from "../api/apiSlice";

export const notificationApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // get all notification
    getAllNotifications: builder.query({
      query: ({ page = 1 } = {}) => ({
        url: `/merchant/notifications?page=${page}`,
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),

    // mark all as read
    markAllAsRead: builder.mutation({
      query: (data) => ({
        url: "/merchant/notifications/read",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message || "Mark all as read successful!");
        } catch (err) {
          const message =
            err?.data?.message ||
            err?.error?.data?.message ||
            err?.error?.message ||
            "Failed to Mark all as read. Try again later.";
          toast.error(message);
        }
      },
    }),
  }),
});

export const { useGetAllNotificationsQuery, useMarkAllAsReadMutation } =
  notificationApi;
