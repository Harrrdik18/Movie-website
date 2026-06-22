import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { discoverMovies } from "../../services/omdbService";

export const discoverMoviesThunk = createAsyncThunk(
  "movies/discoverMovies",
  async (params, { rejectWithValue }) => {
    try {
      const response = await discoverMovies(params);
      return {
        movies: response.Search || [],
        totalResults: parseInt(response.totalResults) || 0,
      };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch movies");
    }
  }
);

const initialState = {
  movies: [],
  status: "idle",
  error: null,
  totalResults: 0,
};

const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(discoverMoviesThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(discoverMoviesThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.movies = action.payload.movies;
        state.totalResults = action.payload.totalResults;
      })
      .addCase(discoverMoviesThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default movieSlice.reducer;
