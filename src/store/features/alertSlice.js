import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

const initialState = {
  isShow: false,
  message: "",
};

export const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    show: (state, action) => {
      state.isShow = true;
      state.message = action.payload;
    },
    hide: (state) => {
      state.isShow = false;
      state.message = "";
    },
  },
});

export const { show, hide } = alertSlice.actions;
export const useAlert = () => useSelector((state) => state.alert);
export default alertSlice.reducer;
