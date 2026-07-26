import { toast } from "react-toastify";
import { apiSlice } from "../api/apiSlice";

export const addProductApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // get config
    getAddProductConfig: builder.query({
      query: () => ({
        url: `/merchant/provider-products/config`,
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),

    // get search product
    getSearchProduct: builder.query({
      query: ({ search = "", page = 1, per_page = 20 } = {}) => ({
        url: `/merchant/provider-products/search`,
        method: "GET",
        params: {
          ...(search && { search }),
          page,
          per_page,
        },
      }),
      providesTags: ["Auth", "ProductList"],
    }),

    // get all product
    getAllProduct: builder.query({
      query: ({
        search = "",
        page = 1,
        per_page = 8,
        category_id = "",
      } = {}) => ({
        url: `/merchant/provider-products/products`,
        method: "GET",
        params: {
          ...(search && { search }),
          page,
          per_page,
          ...(category_id && { category_id }),
        },
      }),
      providesTags: ["Auth", "ProductList"],
    }),

    // get all product
    getAllMyProduct: builder.query({
      query: ({ search = "", page = 1, per_page = 8 } = {}) => ({
        url: `/merchant/listings`,
        method: "GET",
        params: {
          ...(search && { search }),
          page,
          per_page,
        },
      }),
      providesTags: ["Auth", "MyProductList", "UpdateProduct"],
    }),

    // get single product
    getMySingleProduct: builder.query({
      query: (id) => ({
        url: `/merchant/listings/${id}`,
        method: "GET",
      }),
      providesTags: ["UpdateProduct", "MyProductList"],
    }),

    // get bnpl product
    getBnplAllProduct: builder.query({
      query: ({ search = "", page = 1, per_page = 8 } = {}) => ({
        url: `/merchant/provider-products/orders`,
        method: "GET",
        params: {
          ...(search && { search }),
          page,
          per_page,
        },
      }),
      providesTags: ["Auth"],
    }),

    // get all my order product
    getMyOrderProduct: builder.query({
      query: ({ search = "", page = 1, per_page = 8 } = {}) => ({
        url: `/merchant/orders/items`,
        method: "GET",
        params: {
          ...(search && { search }),
          page,
          per_page,
        },
      }),
      providesTags: ["Auth"],
    }),

    // get my order single product
    getMyOrderSingleProduct: builder.query({
      query: (id) => ({
        url: `/merchant/orders/items/${id}`,
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),

    // update order status
    updateOrderStatus: builder.mutation({
      query: ({ id, data }) => ({
        url: `/merchant/orders/items/${id}/status`,
        method: "POST",
        body: data,
      }),
      // invalidatesTags: [""],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message || "Update status successful!");
        } catch (err) {
          const message =
            err?.data?.message ||
            err?.error?.data?.message ||
            err?.error?.message ||
            "Failed to update status. Try again later.";
          toast.error(message);
        }
      },
    }),

    //update delivery items
    updateDeliveryItems: builder.mutation({
      query: ({ id, data }) => ({
        url: `/merchant/orders/items/${id}/delivery-items/update`,
        method: "POST",
        body: data,
      }),
      // invalidatesTags: [""],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message || "Update delivery successful!");
        } catch (err) {
          const message =
            err?.data?.message ||
            err?.error?.data?.message ||
            err?.error?.message ||
            "Failed to update delivery. Try again later.";
          toast.error(message);
        }
      },
    }),

    // delete product
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/merchant/provider-products/product/delete/${id}`,
        method: "DELETE",
        params: {
          _method: "delete",
        },
      }),
      invalidatesTags: ["ProductList"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message || "Delete product successful!");
        } catch (err) {
          const message =
            err?.error?.data?.message ||
            err?.data?.message ||
            err?.error?.message ||
            "Failed to delete product. Try again later.";
          toast.error(message);
        }
      },
    }),

    //delete my product
    deleteMyProduct: builder.mutation({
      query: (id) => ({
        url: `/merchant/listings/${id}`,
        method: "DELETE",
        params: {
          _method: "delete",
        },
      }),
      invalidatesTags: ["MyProductList"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message || "Delete product successful!");
        } catch (err) {
          const message =
            err?.error?.data?.message ||
            err?.data?.message ||
            err?.error?.message ||
            "Failed to delete product. Try again later.";
          toast.error(message);
        }
      },
    }),

    // import product
    createProduct: builder.mutation({
      query: (data) => ({
        url: "/merchant/provider-products/import",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ProductList"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message || "Add product successful!");
        } catch (err) {
          const message =
            err?.data?.message ||
            err?.error?.data?.message ||
            err?.error?.message ||
            "Failed to add product. Try again later.";
          toast.error(message);
        }
      },
    }),

    // add product
    addProduct: builder.mutation({
      query: (data) => ({
        url: "/merchant/listings",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["MyProductList"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message || "Add product successful!");
        } catch (err) {
          const message =
            err?.data?.message ||
            err?.error?.data?.message ||
            err?.error?.message ||
            "Failed to add product. Try again later.";
          toast.error(message);
        }
      },
    }),

    // update product
    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/merchant/listings/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["UpdateProduct", "UpdateDeliveryProduct"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message || "Update product successful!");
        } catch (err) {
          const message =
            err?.data?.message ||
            err?.error?.data?.message ||
            err?.error?.message ||
            "Failed to update product. Try again later.";
          toast.error(message);
        }
      },
    }),

    // get delivery product
    getDeliveryProduct: builder.query({
      query: (id) => ({
        url: `/merchant/listings/${id}/delivery-items`,
        method: "GET",
      }),
      providesTags: ["UpdateDeliveryProduct"],
    }),

    // update delivery product
    updateDeliveryProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/merchant/listings/${id}/delivery-items`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["UpdateDeliveryProduct"],
      async onQueryStarted(args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          toast.success(data?.message || "Update Delivery product successful!");
        } catch (err) {
          const message =
            err?.data?.message ||
            err?.error?.data?.message ||
            err?.error?.message ||
            "Failed to delivery update product. Try again later.";
          toast.error(message);
        }
      },
    }),
  }),
});

export const {
  useGetAddProductConfigQuery,
  useGetAllProductQuery,
  useGetMySingleProductQuery,
  useGetAllMyProductQuery,
  useGetSearchProductQuery,
  useCreateProductMutation,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useDeleteMyProductMutation,
  useGetBnplAllProductQuery,
  useGetMyOrderProductQuery,
  useGetMyOrderSingleProductQuery,
  useGetDeliveryProductQuery,
  useUpdateDeliveryProductMutation,
  useUpdateOrderStatusMutation,
  useUpdateDeliveryItemsMutation,
} = addProductApi;
