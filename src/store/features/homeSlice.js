import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  refreshCount: 0,
};

export const homeSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    refreshHome: (state, action) => {
      state.refreshCount += 1;
    },
  },
});

// Action creators are generated for each case reducer function
export const { refreshHome } = homeSlice.actions;
export const selectrefreshCount = (state) => state.home.refreshCount;
export default homeSlice.reducer;
