import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import type { MovieEntity } from "../../types";
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

const moviesAdapter = createEntityAdapter<MovieEntity>({
  selectId: (movie) => movie.imdbID,
});

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
  async (params: Record<string, unknown>, { rejectWithValue }) => {
    try {
      const response = await discoverMovies(params as { genre?: string; year?: string; page?: number });
      return {
        movies: response.Search || [],
        totalResults: parseInt(response.totalResults) || 0,
      };
    } catch (error) {
      return rejectWithValue((error as Error).message || "Failed to fetch movies");
    }
  }
);

export const fetchTVShows = createAsyncThunk(
  "movies/fetchTVShows",
  async (params: Record<string, unknown>, { rejectWithValue }) => {
    try {
      const response = await discoverTVShows(params as { genre?: string; year?: string; page?: number; country?: string });
      return {
        shows: response.Search || [],
        totalResults: parseInt(response.totalResults) || 0,
      };
    } catch (error) {
      return rejectWithValue((error as Error).message || "Failed to fetch TV shows");
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
  async (genre: string, { rejectWithValue }) => {
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
  async (countryCode: string, { rejectWithValue }) => {
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
  async (id: string, { rejectWithValue }) => {
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
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await searchMovies(query);
      return response.Search || [];
    } catch (error) {
      return rejectWithValue("Failed to search movies");
    }
  }
);

interface MoviesState {
  entities: Record<string, MovieEntity>;
  ids: string[];
  trending: string[];
  popular: string[];
  topRated: string[];
  upcoming: string[];
  homeLoading: boolean;
  homeError: string | null;
  discover: string[];
  discoverLoading: boolean;
  discoverTotalResults: number;
  discoverError: string | null;
  tvShows: string[];
  tvLoading: boolean;
  tvTotalResults: number;
  tvError: string | null;
  genres: Array<{ id: number; name: string }>;
  genreMovies: string[];
  genreLoading: boolean;
  genreError: string | null;
  countryMovies: string[];
  countryLoading: boolean;
  countryError: string | null;
  movieDetails: string | null;
  similarMovies: string[];
  detailLoading: boolean;
  detailError: string | null;
  searchResults: string[];
  searchLoading: boolean;
  searchError: string | null;
  backgroundImageUrl: string;
}

const initialState: MoviesState = moviesAdapter.getInitialState({
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
});

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
      .addCase(fetchHomeData.pending, (state) => {
        state.homeLoading = true;
        state.homeError = null;
      })
      .addCase(fetchHomeData.fulfilled, (state, action) => {
        state.homeLoading = false;
        const { trending, popular, topRated, upcoming, background } = action.payload;
        moviesAdapter.upsertMany(state, trending);
        state.trending = trending.map((m) => m.imdbID);
        moviesAdapter.upsertMany(state, popular);
        state.popular = popular.map((m) => m.imdbID);
        moviesAdapter.upsertMany(state, topRated);
        state.topRated = topRated.map((m) => m.imdbID);
        moviesAdapter.upsertMany(state, upcoming);
        state.upcoming = upcoming.map((m) => m.imdbID);
        state.backgroundImageUrl = background;
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.homeLoading = false;
        state.homeError = action.payload as string;
      })
      .addCase(discoverMoviesThunk.pending, (state) => {
        state.discoverLoading = true;
        state.discoverError = null;
      })
      .addCase(discoverMoviesThunk.fulfilled, (state, action) => {
        state.discoverLoading = false;
        moviesAdapter.upsertMany(state, action.payload.movies);
        state.discover = action.payload.movies.map((m) => m.imdbID);
        state.discoverTotalResults = action.payload.totalResults;
      })
      .addCase(discoverMoviesThunk.rejected, (state, action) => {
        state.discoverLoading = false;
        state.discoverError = action.payload as string;
      })
      .addCase(fetchTVShows.pending, (state) => {
        state.tvLoading = true;
        state.tvError = null;
      })
      .addCase(fetchTVShows.fulfilled, (state, action) => {
        state.tvLoading = false;
        moviesAdapter.upsertMany(state, action.payload.shows);
        state.tvShows = action.payload.shows.map((m) => m.imdbID);
        state.tvTotalResults = action.payload.totalResults;
      })
      .addCase(fetchTVShows.rejected, (state, action) => {
        state.tvLoading = false;
        state.tvError = action.payload as string;
      })
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
        state.genreError = action.payload as string;
      })
      .addCase(fetchMoviesByGenre.pending, (state) => {
        state.genreLoading = true;
        state.genreError = null;
      })
      .addCase(fetchMoviesByGenre.fulfilled, (state, action) => {
        state.genreLoading = false;
        moviesAdapter.upsertMany(state, action.payload);
        state.genreMovies = action.payload.map((m) => m.imdbID);
      })
      .addCase(fetchMoviesByGenre.rejected, (state, action) => {
        state.genreLoading = false;
        state.genreError = action.payload as string;
      })
      .addCase(fetchMoviesByCountry.pending, (state) => {
        state.countryLoading = true;
        state.countryError = null;
      })
      .addCase(fetchMoviesByCountry.fulfilled, (state, action) => {
        state.countryLoading = false;
        moviesAdapter.upsertMany(state, action.payload);
        state.countryMovies = action.payload.map((m) => m.imdbID);
      })
      .addCase(fetchMoviesByCountry.rejected, (state, action) => {
        state.countryLoading = false;
        state.countryError = action.payload as string;
      })
      .addCase(fetchMovieDetail.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
        state.movieDetails = null;
        state.similarMovies = [];
      })
      .addCase(fetchMovieDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        moviesAdapter.upsertMany(state, [action.payload.details]);
        state.movieDetails = action.payload.details.imdbID;
        moviesAdapter.upsertMany(state, action.payload.similar);
        state.similarMovies = action.payload.similar.map((m) => m.imdbID);
      })
      .addCase(fetchMovieDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload as string;
      })
      .addCase(searchMoviesThunk.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchMoviesThunk.fulfilled, (state, action) => {
        state.searchLoading = false;
        moviesAdapter.upsertMany(state, action.payload);
        state.searchResults = action.payload.map((m) => m.imdbID);
      })
      .addCase(searchMoviesThunk.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload as string;
      });
  },
});

export const { clearSearch } = movieSlice.actions;
export default movieSlice.reducer;
