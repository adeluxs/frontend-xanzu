import { toast } from "react-toastify";
import { apiSlice } from "../api/apiSlice";

export const supportTicketApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // ALL TICKETS
    getSupportTicket: builder.query({
      query: ({ status = "", search = "", page = 1 } = {}) => ({
        url: "/merchant/ticket",
        method: "GET",
        params: {
          ...(status && { status }),
          ...(search && { search }),
          page,
          per_page: 8,
        },
      }),
      providesTags: ["Tickets", "Auth"],
    }),

    // SINGLE TICKET
    getSingleSupportTicket: builder.query({
      query: ({ uuid }) => ({
        url: `/merchant/ticket/${uuid}`,
        method: "GET",
      }),
      providesTags: ["SingleTicket"],
    }),

    // CREATE TICKET
    createSupportTicket: builder.mutation({
      query: (data) => ({
        url: "/merchant/ticket",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Tickets"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message || "Ticket created successfully!");
        } catch (err) {
          toast.error(err?.error?.data?.message || "Failed to create ticket");
        }
      },
    }),

    // REPLY TICKET
    replySupportTicket: builder.mutation({
      query: ({ uuid, formData }) => ({
        url: `/merchant/ticket/reply/${uuid}`,
        method: "POST",
        body: formData,
      }),

      invalidatesTags: ["SingleTicket"],

      async onQueryStarted({ onSuccess }, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message || "Reply sent successfully!");

          if (onSuccess) onSuccess();
        } catch (err) {
          toast.error(err?.error?.data?.message || "Failed to send message");
        }
      },
    }),

    // CLOSE TICKET
    closeTicket: builder.mutation({
      query: ({ uuid }) => ({
        url: `/merchant/ticket/close/${uuid}`,
        method: "POST",
      }),
      invalidatesTags: ["SingleTicket", "Tickets"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message || "Ticket closed");
        } catch (err) {
          toast.error(err?.error?.data?.message || "Failed to close ticket");
        }
      },
    }),
  }),
});

export const {
  useGetSupportTicketQuery,
  useGetSingleSupportTicketQuery,
  useCreateSupportTicketMutation,
  useReplySupportTicketMutation,
  useCloseTicketMutation,
} = supportTicketApi;
