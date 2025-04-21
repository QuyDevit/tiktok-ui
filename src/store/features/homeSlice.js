import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  refreshCount: 0,
  tabSearchIndex:0,
  keywordSearch:""
};

export const homeSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    refreshHome: (state, action) => {
      state.refreshCount += 1;
    },
    setTabSearchIndex: (state, action) => {
      state.tabSearchIndex = action.payload;
    },
    setKeyWordSearch: (state, action) => {
      state.keywordSearch = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { refreshHome,setTabSearchIndex ,setKeyWordSearch} = homeSlice.actions;
export const selectrefreshCount = (state) => state.home.refreshCount;
export const selecttabSearchIndex = (state) => state.home.tabSearchIndex;
export const selectkeywordSearch = (state) => state.home.keywordSearch;
export default homeSlice.reducer;
