import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  followedUsers: {}, // Map of userId -> isFollowed
};

export const followSlice = createSlice({
  name: "follow",
  initialState,
  reducers: {
    setFollowedUser: (state, action) => {
      const { userId, isFollowed } = action.payload;
      state.followedUsers[userId] = isFollowed;
    },
  },
});

export const { setFollowedUser } = followSlice.actions;
export const selectFollowedUsers = (state) => state.follow.followedUsers;
export default followSlice.reducer;
