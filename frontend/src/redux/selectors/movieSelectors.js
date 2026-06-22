import { createSelector } from "@reduxjs/toolkit";

const selectMoviesState = (state) => state.movies;

// Home
export const selectTrending = createSelector(
  selectMoviesState,
  (m) => m.trending
);
export const selectPopular = createSelector(
  selectMoviesState,
  (m) => m.popular
);
export const selectTopRated = createSelector(
  selectMoviesState,
  (m) => m.topRated
);
export const selectUpcoming = createSelector(
  selectMoviesState,
  (m) => m.upcoming
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
export const selectDiscover = createSelector(
  selectMoviesState,
  (m) => m.discover
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
export const selectTVShows = createSelector(
  selectMoviesState,
  (m) => m.tvShows
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
export const selectGenres = createSelector(
  selectMoviesState,
  (m) => m.genres
);
export const selectGenreMovies = createSelector(
  selectMoviesState,
  (m) => m.genreMovies
);
export const selectGenreLoading = createSelector(
  selectMoviesState,
  (m) => m.genreLoading
);

// Country
export const selectCountryMovies = createSelector(
  selectMoviesState,
  (m) => m.countryMovies
);
export const selectCountryLoading = createSelector(
  selectMoviesState,
  (m) => m.countryLoading
);

// Detail
export const selectMovieDetails = createSelector(
  selectMoviesState,
  (m) => m.movieDetails
);
export const selectSimilarMovies = createSelector(
  selectMoviesState,
  (m) => m.similarMovies
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
export const selectSearchResults = createSelector(
  selectMoviesState,
  (m) => m.searchResults
);
export const selectSearchLoading = createSelector(
  selectMoviesState,
  (m) => m.searchLoading
);
