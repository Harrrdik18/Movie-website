import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  discoverMovies,
  discoverTVShows,
  getGenres,
  getMoviesByGenre,
  getMoviesByCountry,
  getMovieDetails,
  getSimilarMovies,
  searchMovies,
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
} from "../../services/omdbService";

export const fetchHomeData = createAsyncThunk(
  "movies/fetchHomeData",
  async (_, { rejectWithValue }) => {
    try {
      const [trending, popular, topRated, upcoming] = await Promise.all([
        getTrendingMovies(),
        getPopularMovies(),
        getTopRatedMovies(),
        getUpcomingMovies(),
      ]);
      const trendingList = trending.Search || [];
      return {
        trending: trendingList,
        popular: popular.Search || [],
        topRated: topRated.Search || [],
        upcoming: upcoming.Search || [],
        background: trendingList.length > 0 ? trendingList[0].Poster : "",
      };
    } catch (error) {
      return rejectWithValue("Failed to fetch home page data");
    }
  }
);

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

export const fetchTVShows = createAsyncThunk(
  "movies/fetchTVShows",
  async (params, { rejectWithValue }) => {
    try {
      const response = await discoverTVShows(params);
      return {
        shows: response.Search || [],
        totalResults: parseInt(response.totalResults) || 0,
      };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch TV shows");
    }
  }
);

export const fetchGenres = createAsyncThunk(
  "movies/fetchGenres",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getGenres();
      return response.genres || [];
    } catch (error) {
      return rejectWithValue("Failed to fetch genres");
    }
  }
);

export const fetchMoviesByGenre = createAsyncThunk(
  "movies/fetchMoviesByGenre",
  async (genre, { rejectWithValue }) => {
    try {
      const response = await getMoviesByGenre(genre);
      return response.Search || [];
    } catch (error) {
      return rejectWithValue("Failed to fetch movies by genre");
    }
  }
);

export const fetchMoviesByCountry = createAsyncThunk(
  "movies/fetchMoviesByCountry",
  async (countryCode, { rejectWithValue }) => {
    try {
      const response = await getMoviesByCountry(countryCode);
      return response.Search || [];
    } catch (error) {
      return rejectWithValue("Failed to fetch movies by country");
    }
  }
);

export const fetchMovieDetail = createAsyncThunk(
  "movies/fetchMovieDetail",
  async (id, { rejectWithValue }) => {
    try {
      const [detailsRes, similarRes] = await Promise.all([
        getMovieDetails(id),
        getSimilarMovies(id),
      ]);
      return {
        details: detailsRes,
        similar: similarRes.Search || [],
      };
    } catch (error) {
      return rejectWithValue("Failed to fetch movie details");
    }
  }
);

export const searchMoviesThunk = createAsyncThunk(
  "movies/searchMovies",
  async (query, { rejectWithValue }) => {
    try {
      const response = await searchMovies(query);
      return response.Search || [];
    } catch (error) {
      return rejectWithValue("Failed to search movies");
    }
  }
);

const initialState = {
  trending: [],
  popular: [],
  topRated: [],
  upcoming: [],
  homeLoading: true,
  homeError: null,

  discover: [],
  discoverLoading: false,
  discoverTotalResults: 0,
  discoverError: null,

  tvShows: [],
  tvLoading: false,
  tvTotalResults: 0,
  tvError: null,

  genres: [],
  genreMovies: [],
  genreLoading: false,
  genreError: null,

  countryMovies: [],
  countryLoading: false,
  countryError: null,

  movieDetails: null,
  similarMovies: [],
  detailLoading: false,
  detailError: null,

  searchResults: [],
  searchLoading: false,
  searchError: null,

  backgroundImageUrl: "",
};

const isMoviesPending = (action) =>
  action.type.startsWith("movies/") && action.type.endsWith("/pending");

const isMoviesRejected = (action) =>
  action.type.startsWith("movies/") && action.type.endsWith("/rejected");

const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    clearSearch(state) {
      state.searchResults = [];
      state.searchError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Home data
      .addCase(fetchHomeData.pending, (state) => {
        state.homeLoading = true;
        state.homeError = null;
      })
      .addCase(fetchHomeData.fulfilled, (state, action) => {
        state.homeLoading = false;
        state.trending = action.payload.trending;
        state.popular = action.payload.popular;
        state.topRated = action.payload.topRated;
        state.upcoming = action.payload.upcoming;
        state.backgroundImageUrl = action.payload.background;
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.homeLoading = false;
        state.homeError = action.payload;
      })
      // Discover (Movies page)
      .addCase(discoverMoviesThunk.pending, (state) => {
        state.discoverLoading = true;
        state.discoverError = null;
      })
      .addCase(discoverMoviesThunk.fulfilled, (state, action) => {
        state.discoverLoading = false;
        state.discover = action.payload.movies;
        state.discoverTotalResults = action.payload.totalResults;
      })
      .addCase(discoverMoviesThunk.rejected, (state, action) => {
        state.discoverLoading = false;
        state.discoverError = action.payload;
      })
      // TV Shows
      .addCase(fetchTVShows.pending, (state) => {
        state.tvLoading = true;
        state.tvError = null;
      })
      .addCase(fetchTVShows.fulfilled, (state, action) => {
        state.tvLoading = false;
        state.tvShows = action.payload.shows;
        state.tvTotalResults = action.payload.totalResults;
      })
      .addCase(fetchTVShows.rejected, (state, action) => {
        state.tvLoading = false;
        state.tvError = action.payload;
      })
      // Genres list
      .addCase(fetchGenres.pending, (state) => {
        state.genreLoading = true;
        state.genreError = null;
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.genreLoading = false;
        state.genres = action.payload;
      })
      .addCase(fetchGenres.rejected, (state, action) => {
        state.genreLoading = false;
        state.genreError = action.payload;
      })
      // Movies by genre
      .addCase(fetchMoviesByGenre.pending, (state) => {
        state.genreLoading = true;
        state.genreError = null;
      })
      .addCase(fetchMoviesByGenre.fulfilled, (state, action) => {
        state.genreLoading = false;
        state.genreMovies = action.payload;
      })
      .addCase(fetchMoviesByGenre.rejected, (state, action) => {
        state.genreLoading = false;
        state.genreError = action.payload;
      })
      // Movies by country
      .addCase(fetchMoviesByCountry.pending, (state) => {
        state.countryLoading = true;
        state.countryError = null;
      })
      .addCase(fetchMoviesByCountry.fulfilled, (state, action) => {
        state.countryLoading = false;
        state.countryMovies = action.payload;
      })
      .addCase(fetchMoviesByCountry.rejected, (state, action) => {
        state.countryLoading = false;
        state.countryError = action.payload;
      })
      // Movie detail
      .addCase(fetchMovieDetail.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchMovieDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.movieDetails = action.payload.details;
        state.similarMovies = action.payload.similar;
      })
      .addCase(fetchMovieDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload;
      })
      // Search
      .addCase(searchMoviesThunk.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchMoviesThunk.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchMoviesThunk.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload;
      });
  },
});

export const { clearSearch } = movieSlice.actions;
export default movieSlice.reducer;
