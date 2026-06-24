import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authService from "../../services/authService";
import type { User, FavoriteItem, WatchlistItem } from "../../types";

export const loginUser = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>("user/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    const data = await authService.login(email, password);
    return data.user;
  } catch (error) {
    return rejectWithValue(
      (error as { error?: string }).error || "Invalid email or password"
    );
  }
});

export const registerUser = createAsyncThunk<
  User,
  Record<string, unknown>,
  { rejectValue: string }
>("user/registerUser", async (userData, { rejectWithValue }) => {
  try {
    const data = await authService.register(userData);
    return data.user;
  } catch (error) {
    return rejectWithValue(
      (error as { error?: string }).error || "Registration failed"
    );
  }
});

export const fetchUserProfile = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("user/fetchUserProfile", async (_, { rejectWithValue }) => {
  try {
    const data = await authService.getUserProfile();
    return data.user;
  } catch (error) {
    return rejectWithValue(
      (error as { error?: string }).error || "Failed to load profile"
    );
  }
});

export const updateUserProfile = createAsyncThunk<
  User,
  Record<string, unknown>,
  { rejectValue: string }
>("user/updateUserProfile", async (userData, { rejectWithValue }) => {
  try {
    const data = await authService.updateProfile(userData);
    return data.user;
  } catch (error) {
    return rejectWithValue(
      (error as { error?: string }).error || "Failed to update profile"
    );
  }
});

export const updateUserPassword = createAsyncThunk<
  void,
  Record<string, unknown>,
  { rejectValue: string }
>("user/updateUserPassword", async (passwordData, { rejectWithValue }) => {
  try {
    await authService.updatePassword(passwordData);
  } catch (error) {
    return rejectWithValue(
      (error as { error?: string }).error || "Failed to update password"
    );
  }
});

export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("user/logoutUser", async (_, { rejectWithValue }) => {
  try {
    await authService.logout();
  } catch (error) {
    return rejectWithValue(
      (error as { error?: string }).error || "Failed to logout"
    );
  }
});

export const addToFavorites = createAsyncThunk<
  FavoriteItem[],
  { movieId: string; title: string; poster: string; type: string },
  { rejectValue: string }
>("user/addToFavorites", async (movieData, { rejectWithValue }) => {
  try {
    const data = await authService.addToFavorites(movieData);
    return data.favorites;
  } catch (error) {
    return rejectWithValue(
      (error as { error?: string }).error || "Failed to add to favorites"
    );
  }
});

export const removeFromFavorites = createAsyncThunk<
  FavoriteItem[],
  string,
  { rejectValue: string }
>("user/removeFromFavorites", async (movieId, { rejectWithValue }) => {
  try {
    const data = await authService.removeFromFavorites(movieId);
    return data.favorites;
  } catch (error) {
    return rejectWithValue(
      (error as { error?: string }).error || "Failed to remove from favorites"
    );
  }
});

export const addToWatchlist = createAsyncThunk<
  WatchlistItem[],
  { movieId: string; title: string; poster: string; type: string },
  { rejectValue: string }
>("user/addToWatchlist", async (movieData, { rejectWithValue }) => {
  try {
    const data = await authService.addToWatchlist(movieData);
    return data.watchlist;
  } catch (error) {
    return rejectWithValue(
      (error as { error?: string }).error || "Failed to add to watchlist"
    );
  }
});

export const removeFromWatchlist = createAsyncThunk<
  WatchlistItem[],
  string,
  { rejectValue: string }
>("user/removeFromWatchlist", async (movieId, { rejectWithValue }) => {
  try {
    const data = await authService.removeFromWatchlist(movieId);
    return data.watchlist;
  } catch (error) {
    return rejectWithValue(
      (error as { error?: string }).error || "Failed to remove from watchlist"
    );
  }
});

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: UserState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  isAuthenticated: !!localStorage.getItem("user"),
  loading: false,
  error: null,
  success: null,
};

const isUserPending = (action: { type: string }) =>
  action.type.startsWith("user/") && action.type.endsWith("/pending");

const isUserRejected = (action: { type: string }) =>
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
        state.error = action.payload as string;
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
      })
      .addMatcher(addToFavorites.fulfilled.match, (state, action) => {
        state.loading = false;
        if (state.user) {
          state.user.favorites = action.payload;
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      })
      .addMatcher(removeFromFavorites.fulfilled.match, (state, action) => {
        state.loading = false;
        if (state.user) {
          state.user.favorites = action.payload;
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      })
      .addMatcher(addToWatchlist.fulfilled.match, (state, action) => {
        state.loading = false;
        if (state.user) {
          state.user.watchlist = action.payload;
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      })
      .addMatcher(removeFromWatchlist.fulfilled.match, (state, action) => {
        state.loading = false;
        if (state.user) {
          state.user.watchlist = action.payload;
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      });
  },
});

export const { clearError, clearSuccess, clearAuth } = userSlice.actions;
export default userSlice.reducer;
