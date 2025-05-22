import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  videoDetail: null,
  isOpenVideoDetail: false,
};

const videoDetailSlice = createSlice({
  name: "videoDetail",
  initialState,
  reducers: {
    setVideoDetail: (state, action) => {
      state.videoDetail = action.payload;
    },
    setIsOpenVideoDetail: (state, action) => {
      state.isOpenVideoDetail = action.payload;
      if (action.payload) {
        state.scrollPosition = window.scrollY;
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { setVideoDetail, setIsOpenVideoDetail } =
  videoDetailSlice.actions;
export const selectVideoDetail = (state) => state.videoDetail.videoDetail;
export const selectIsOpenVideoDetail = (state) =>
  state.videoDetail.isOpenVideoDetail;
export default videoDetailSlice.reducer;
