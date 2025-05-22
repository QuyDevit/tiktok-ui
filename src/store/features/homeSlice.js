import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  refreshCount: 0,
  tabSearchIndex: 0,
  keywordSearch: "",
  searchResults: {
    live: null,
    user: null,
    video: null,
  },
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
    setSearchResults: (state, action) => {
      const { type, results } = action.payload;
      state.searchResults[type] = results;
    },
  },
});

export const {
  refreshHome,
  setTabSearchIndex,
  setKeyWordSearch,
  setSearchResults,
} = homeSlice.actions;
export const selectrefreshCount = (state) => state.home.refreshCount;
export const selecttabSearchIndex = (state) => state.home.tabSearchIndex;
export const selectkeywordSearch = (state) => state.home.keywordSearch;
export const selectSearchResults = (state) => state.home.searchResults;
export default homeSlice.reducer;
