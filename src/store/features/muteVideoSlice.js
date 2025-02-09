import { createSlice } from '@reduxjs/toolkit'

const initializeMute = () => {
    const savedMute= localStorage.getItem('mute');
    if (savedMute === null) {
      localStorage.setItem('mute', 'true');
      return true; 
    }
    return savedMute === 'true';
  };

const initialState = {
  isMute: initializeMute(),
}

export const muteVideoSlice = createSlice({
  name: 'mute',
  initialState,
  reducers: {
    setMute: (state, action) => {
        state.isMute = action.payload
        localStorage.setItem('mute', action.payload.toString())
    },
  },
})

// Action creators are generated for each case reducer function
export const { setMute } = muteVideoSlice.actions
export const selectMute = (state) => state.mute.isMute
export default muteVideoSlice.reducer