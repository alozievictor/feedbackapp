import { createSlice } from '@reduxjs/toolkit';
import { api } from '../../services/api';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        api.endpoints.login.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        api.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          state.isLoading = false;
          state.token = payload.token;
          state.user = payload.user;
          state.isAuthenticated = true;
          localStorage.setItem('token', payload.token);
          localStorage.setItem('user', JSON.stringify(payload.user));
        }
      )
      .addMatcher(
        api.endpoints.login.matchRejected,
        (state, { payload }) => {
          state.isLoading = false;
          state.error = payload?.data?.message || 'Login failed';
        }
      )
      .addMatcher(
        api.endpoints.register.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        api.endpoints.register.matchFulfilled,
        (state, { payload }) => {
          state.isLoading = false;
          state.token = payload.token;
          state.user = payload.user;
          state.isAuthenticated = true;
          localStorage.setItem('token', payload.token);
          localStorage.setItem('user', JSON.stringify(payload.user));
        }
      )
      .addMatcher(
        api.endpoints.register.matchRejected,
        (state, { payload }) => {
          state.isLoading = false;
          state.error = payload?.data?.message || 'Registration failed';
        }
      )
      .addMatcher(
        api.endpoints.getMe.matchFulfilled,
        (state, { payload }) => {
          state.user = payload.user;
          state.isAuthenticated = true;
        }
      );
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
