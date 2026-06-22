import { createSelector } from "@reduxjs/toolkit";

const selectMoviesState = (state) => state.movies;

export const selectMovies = createSelector(
  selectMoviesState,
  (movies) => movies.movies
);
export const selectMoviesStatus = createSelector(
  selectMoviesState,
  (movies) => movies.status
);
export const selectMoviesError = createSelector(
  selectMoviesState,
  (movies) => movies.error
);
export const selectTotalResults = createSelector(
  selectMoviesState,
  (movies) => movies.totalResults
);
export const selectTotalPages = createSelector(
  selectTotalResults,
  (totalResults) => Math.ceil(totalResults / 10) || 1
);
