import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    formType: 'login',
    open: false,
};

export const formAuthSlice = createSlice({
  name: "formauth",
  initialState,
  reducers: {
    setFormType: (state, action) => {
      state.formType = action.payload;
    },
    setOpenForm: (state, action) => {
      state.open = action.payload;
    }
  },
});

// Action creators are generated for each case reducer function
export const { setFormType,setOpenForm } = formAuthSlice.actions;
export const selectformType = (state) => state.formauth.formType;
export const selectOpenform = (state) => state.formauth.open;
export default formAuthSlice.reducer;
