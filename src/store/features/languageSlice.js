import { createSlice } from "@reduxjs/toolkit";

const initializeLanguage = () => {
  const savedLanguage = localStorage.getItem("language");
  if (!savedLanguage) {
    localStorage.setItem("language", "vi");
    return "vi";
  }
  return savedLanguage;
};

const initialState = {
  language: initializeLanguage(),
};

export const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
      localStorage.setItem("language", action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const { setLanguage } = languageSlice.actions;
export const selectLanguage = (state) => state.language.language;
export default languageSlice.reducer;
