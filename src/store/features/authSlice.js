import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state,actions) => {
      state.userInfo = actions.payload;
    },
    logout: (state) => {
      state.userInfo = null; 
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser,logout } = authSlice.actions;
export const selectUser = (state) => state.auth.userInfo;
export default authSlice.reducer;
