import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null,
  isAuthChecking: true,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, actions) => {
      state.userInfo = actions.payload;
    },
    logout: (state) => {
      state.userInfo = null;
    },
    setAuthChecking: (state, actions) => {
      state.isAuthChecking = actions.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser, logout, setAuthChecking } = authSlice.actions;
export const selectUser = (state) => state.auth.userInfo;
export const selectIsAuthChecking = (state) => state.auth.isAuthChecking;
export default authSlice.reducer;
