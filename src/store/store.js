import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./features/themeSlice";
import languageReducer from "./features/languageSlice";
import muteVideoReducer from "./features/muteVideoSlice";
import homeReducer from "./features/homeSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    language: languageReducer,
    mute: muteVideoReducer,
    home: homeReducer,
  },
});
