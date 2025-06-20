import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./features/themeSlice";
import languageReducer from "./features/languageSlice";
import muteVideoReducer from "./features/muteVideoSlice";
import homeReducer from "./features/homeSlice";
import formAuthReducer from "./features/formAuthSlice";
import loadingReducer from "./features/loadingSlice";
import authReducer from "./features/authSlice";
import alertReducer from "./features/alertSlice";
import videoDetailReducer from "./features/videoDetailSlice";
import followReducer from "./features/followSlice";
import videoListReducer from "./features/videoListSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    language: languageReducer,
    mute: muteVideoReducer,
    home: homeReducer,
    formauth: formAuthReducer,
    loading: loadingReducer,
    auth: authReducer,
    alert: alertReducer,
    videoDetail: videoDetailReducer,
    follow: followReducer,
    videoList: videoListReducer,
  },
});
