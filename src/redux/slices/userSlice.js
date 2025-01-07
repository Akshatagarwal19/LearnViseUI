import { createSlice } from '@reduxjs/toolkit';

// Initial state for the user slice
const initialState = {
  name: '', // This will hold the username
  isAuthenticated: false, // This flag will indicate if the user is logged in or not
};

// Create the user slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.name = action.payload.name;
      state.isAuthenticated = action.payload.isAuthenticated;
    },
    logout: (state) => {
      state.name = '';
      state.isAuthenticated = false;
    },
  },
});

// Export actions to update the state
export const { setUser, logout } = userSlice.actions;

// Export the reducer to be included in the store
export default userSlice.reducer;
