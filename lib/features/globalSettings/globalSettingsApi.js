import { apiSlice } from "../api/apiSlice";

export const globalSettingsApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllCountry: builder.query({
      query: () => ({
        url: "/get-countries",
        method: "GET",
      }),
    }),
    getRegisterSettings: builder.query({
      query: () => ({
        url: "/get-register-fields/merchant",
        method: "GET",
      }),
    }),
    getSettings: builder.query({
      query: () => "/get-settings",
      providesTags: ["Settings"],

      transformResponse: (response) => {
        const settingsObj = {};

        if (Array.isArray(response?.data)) {
          response.data.forEach((item) => {
            settingsObj[item.name] = item.value;
          });
        }

        return {
          settings: settingsObj,
          pageLinks: response?.meta?.page_links || [],
        };
      },
      // auto refetch when admin changes settings
      // refetchOnFocus: true,
      // refetchOnReconnect: true,
      // refetchOnMountOrArgChange: true,
    }),
  }),
});

export const {
  useGetAllCountryQuery,
  useGetRegisterSettingsQuery,
  useGetSettingsQuery,
} = globalSettingsApi;
