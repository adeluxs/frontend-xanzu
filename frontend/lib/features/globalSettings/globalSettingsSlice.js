import { createSlice } from "@reduxjs/toolkit";
import { globalSettingsApi } from "../globalSettings/globalSettingsApi";

const initialState = {
  settings: {},
  pageLinks: {},
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      globalSettingsApi.endpoints.getSettings.matchFulfilled,
      (state, action) => {
        state.settings = action.payload.settings;
        state.pageLinks = action.payload.pageLinks;
      }
    );
  },
});

export default settingsSlice.reducer;
