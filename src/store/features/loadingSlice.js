import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
};

export const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    showLoading: (state) => {
      state.isLoading = true;
    },
    hideLoading: (state) => {
      state.isLoading = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { showLoading,hideLoading } = loadingSlice.actions;
export const selectIsLoading = (state) => state.loading.isLoading;
export default loadingSlice.reducer;
