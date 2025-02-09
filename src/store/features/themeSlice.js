import { createSlice } from '@reduxjs/toolkit'

const initializeTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
      localStorage.setItem('theme', 'light');
      return false; 
    }
    return savedTheme === 'dark';
  };

const initialState = {
  isDarkMode: initializeTheme(),
}

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action) => {
        state.isDarkMode = action.payload === 'dark'
        localStorage.setItem('theme', action.payload)
    },
  },
})

// Action creators are generated for each case reducer function
export const { setTheme } = themeSlice.actions
export const selectTheme = (state) => state.theme.isDarkMode
export default themeSlice.reducer