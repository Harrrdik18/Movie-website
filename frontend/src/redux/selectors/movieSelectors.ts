import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { MovieEntity } from "../../types";

const selectMoviesState = (state: RootState) => state.movies;

const populateMovies = (state: { entities: Record<string, MovieEntity | undefined> }, ids: string[]): MovieEntity[] =>
  ids.map((id) => state.entities[id]).filter((m): m is MovieEntity => Boolean(m));

// Home
export const selectTrending = createSelector(selectMoviesState, (m) =>
  populateMovies(m, m.trending)
);
export const selectPopular = createSelector(selectMoviesState, (m) =>
  populateMovies(m, m.popular)
);
export const selectTopRated = createSelector(selectMoviesState, (m) =>
  populateMovies(m, m.topRated)
);
export const selectUpcoming = createSelector(selectMoviesState, (m) =>
  populateMovies(m, m.upcoming)
);
export const selectHomeLoading = createSelector(
  selectMoviesState,
  (m) => m.homeLoading
);
export const selectBackgroundImageUrl = createSelector(
  selectMoviesState,
  (m) => m.backgroundImageUrl
);

// Discover
export const selectDiscover = createSelector(selectMoviesState, (m) =>
  populateMovies(m, m.discover)
);
export const selectDiscoverLoading = createSelector(
  selectMoviesState,
  (m) => m.discoverLoading
);
export const selectDiscoverError = createSelector(
  selectMoviesState,
  (m) => m.discoverError
);
export const selectDiscoverTotalResults = createSelector(
  selectMoviesState,
  (m) => m.discoverTotalResults
);
export const selectDiscoverTotalPages = createSelector(
  selectDiscoverTotalResults,
  (total) => Math.ceil(total / 10) || 1
);

// TV
export const selectTVShows = createSelector(selectMoviesState, (m) =>
  populateMovies(m, m.tvShows)
);
export const selectTVLoading = createSelector(
  selectMoviesState,
  (m) => m.tvLoading
);
export const selectTVError = createSelector(
  selectMoviesState,
  (m) => m.tvError
);
export const selectTVTotalResults = createSelector(
  selectMoviesState,
  (m) => m.tvTotalResults
);
export const selectTVTotalPages = createSelector(
  selectTVTotalResults,
  (total) => Math.ceil(total / 10) || 1
);

// Genre
export const selectGenres = createSelector(selectMoviesState, (m) => m.genres);
export const selectGenreMovies = createSelector(selectMoviesState, (m) =>
  populateMovies(m, m.genreMovies)
);
export const selectGenreLoading = createSelector(
  selectMoviesState,
  (m) => m.genreLoading
);

// Country
export const selectCountryMovies = createSelector(selectMoviesState, (m) =>
  populateMovies(m, m.countryMovies)
);
export const selectCountryLoading = createSelector(
  selectMoviesState,
  (m) => m.countryLoading
);

// Detail
export const selectMovieDetails = createSelector(
  selectMoviesState,
  (m) => (m.movieDetails ? m.entities[m.movieDetails] ?? null : null) as MovieEntity | null
);
export const selectSimilarMovies = createSelector(selectMoviesState, (m) =>
  populateMovies(m, m.similarMovies)
);
export const selectDetailLoading = createSelector(
  selectMoviesState,
  (m) => m.detailLoading
);
export const selectDetailError = createSelector(
  selectMoviesState,
  (m) => m.detailError
);

// Search
export const selectSearchResults = createSelector(selectMoviesState, (m) =>
  populateMovies(m, m.searchResults)
);
export const selectSearchLoading = createSelector(
  selectMoviesState,
  (m) => m.searchLoading
);
