// store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Async thunk to load auth state from storage
export const loadAuthFromStorage = createAsyncThunk(
  'auth/loadAuthFromStorage',
  async () => {
    const value = await AsyncStorage.getItem('isAuthenticated');
    return value === 'true'; // convert string back to boolean
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    loaded: false,
  },
  reducers: {
    loginSuccess: (state) => {
      state.isAuthenticated = true;
      AsyncStorage.setItem('isAuthenticated', 'true');
    },
    logout: (state) => {
      state.isAuthenticated = false;
      AsyncStorage.removeItem('isAuthenticated');
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadAuthFromStorage.fulfilled, (state, action) => {
      state.isAuthenticated = action.payload;
      state.loaded = true;
    });
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
