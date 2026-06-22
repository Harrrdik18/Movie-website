import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authService from "../../services/authService";

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await authService.login(email, password);
      return data.user;
    } catch (error) {
      return rejectWithValue(error.error || "Invalid email or password");
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authService.register(userData);
      return data.user;
    } catch (error) {
      return rejectWithValue(error.error || "Registration failed");
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const data = await authService.getUserProfile();
      return data.user;
    } catch (error) {
      return rejectWithValue(error.error || "Failed to load profile");
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const data = await authService.updateProfile(userData);
      return data.user;
    } catch (error) {
      return rejectWithValue(error.error || "Failed to update profile");
    }
  }
);

export const updateUserPassword = createAsyncThunk(
  "user/updateUserPassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      await authService.updatePassword(passwordData);
    } catch (error) {
      return rejectWithValue(error.error || "Failed to update password");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (error) {
      return rejectWithValue(error.error || "Failed to logout");
    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  isAuthenticated: !!localStorage.getItem("user"),
  loading: false,
  error: null,
  success: null,
};

const isUserPending = (action) =>
  action.type.startsWith("user/") && action.type.endsWith("/pending");

const isUserRejected = (action) =>
  action.type.startsWith("user/") && action.type.endsWith("/rejected");

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearSuccess(state) {
      state.success = null;
    },
    clearAuth(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isUserPending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addMatcher(isUserRejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addMatcher(
        (action) =>
          loginUser.fulfilled.match(action) ||
          registerUser.fulfilled.match(action),
        (state, action) => {
          state.loading = false;
          state.user = action.payload;
          state.isAuthenticated = true;
          localStorage.setItem("user", JSON.stringify(action.payload));
        }
      )
      .addMatcher(fetchUserProfile.fulfilled.match, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addMatcher(updateUserProfile.fulfilled.match, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.success = "Profile updated successfully";
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addMatcher(updateUserPassword.fulfilled.match, (state) => {
        state.loading = false;
        state.success = "Password updated successfully";
      })
      .addMatcher(logoutUser.fulfilled.match, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        state.success = null;
        localStorage.removeItem("user");
      });
  },
});

export const { clearError, clearSuccess, clearAuth } = userSlice.actions;
export default userSlice.reducer;
