import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    formType: 'login',
};

export const formAuthSlice = createSlice({
  name: "formauth",
  initialState,
  reducers: {
    setFormType: (state, action) => {
      state.formType = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setFormType } = formAuthSlice.actions;
export const selectformType = (state) => state.formauth.formType;
export default formAuthSlice.reducer;
