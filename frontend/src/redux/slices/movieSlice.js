import { createSlice } from "@reduxjs/toolkit";

const movieSlice = createSlice({
  name: "movies",
  initialState: {
    movies: [],
    status: "idle",
    error: null,
  },
  reducers: {
    fetchMoviesStart(state) {
      state.status = "loading";
    },
    fetchMoviesSuccess(state, action) {
      state.status = "succeeded";
      state.movies = action.payload;
    },
    fetchMoviesFailure(state, action) {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});

export const { fetchMoviesStart, fetchMoviesSuccess, fetchMoviesFailure } =
  movieSlice.actions;
export default movieSlice.reducer;
