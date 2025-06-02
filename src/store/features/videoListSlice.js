import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  videos: [],
  currentIndex: 0,
  hasMore: true,
  searchAfter: null,
};

const videoListSlice = createSlice({
  name: "videoList",
  initialState,
  reducers: {
    setVideos: (state, action) => {
      state.videos = action.payload;
      state.currentIndex = 0;
      state.searchAfter = null;
    },
    appendVideos: (state, action) => {
      state.videos = [...state.videos, ...action.payload];
    },
    setCurrentIndex: (state, action) => {
      state.currentIndex = action.payload;
    },
    setHasMore: (state, action) => {
      state.hasMore = action.payload;
    },
    setSearchAfter: (state, action) => {
      state.searchAfter = action.payload;
    },
    updateVideo: (state, action) => {
      const updatedVideo = action.payload;
      const index = state.videos.findIndex(
        (video) => video.id === updatedVideo.id
      );
      if (index !== -1) {
        state.videos[index] = updatedVideo;
      }
    },
  },
});

export const {
  setVideos,
  appendVideos,
  setCurrentIndex,
  setHasMore,
  setSearchAfter,
  updateVideo,
} = videoListSlice.actions;

export const selectVideos = (state) => state.videoList.videos;
export const selectCurrentIndex = (state) => state.videoList.currentIndex;
export const selectHasMore = (state) => state.videoList.hasMore;
export const selectSearchAfter = (state) => state.videoList.searchAfter;

export default videoListSlice.reducer;
