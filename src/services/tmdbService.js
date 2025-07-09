import axios from "axios";

const API_BASE_URL = "https://localhost:5000/api/v1/tmdb";

// Configure axios to include credentials
axios.defaults.withCredentials = true;

// Helper function to make API requests
const apiRequest = async (endpoint, params = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}${endpoint}`, { params });
    return response.data;
  } catch (error) {
    console.error(`TMDB API Error: ${error.message}`);
    throw error;
  }
};

// Get trending movies
export const getTrendingMovies = async (
  timeWindow = "day",
  language = "en-US"
) => {
  return await apiRequest(`/trending/movie/${timeWindow}`, { language });
};

// Get popular movies
export const getPopularMovies = async (language = "en-US", page = 1) => {
  return await apiRequest("/movie/popular", { language, page });
};

// Get top rated movies
export const getTopRatedMovies = async (language = "en-US", page = 1) => {
  return await apiRequest("/movie/top_rated", { language, page });
};

// Get upcoming movies
export const getUpcomingMovies = async (language = "en-US", page = 1) => {
  return await apiRequest("/movie/upcoming", { language, page });
};

// Get movie details
export const getMovieDetails = async (id, language = "en-US") => {
  return await apiRequest(`/movie/${id}`, { language });
};

// Get movie credits
export const getMovieCredits = async (id, language = "en-US") => {
  return await apiRequest(`/movie/${id}/credits`, { language });
};

// Get similar movies
export const getSimilarMovies = async (id, language = "en-US", page = 1) => {
  return await apiRequest(`/movie/${id}/similar`, { language, page });
};

// Search movies
export const searchMovies = async (query, language = "en-US", page = 1) => {
  return await apiRequest("/search/movie", { query, language, page });
};

// Discover movies
export const discoverMovies = async (params = {}) => {
  const defaultParams = {
    language: "en-US",
    sort_by: "popularity.desc",
    page: 1,
  };
  return await apiRequest("/discover/movie", { ...defaultParams, ...params });
};

// Discover TV shows
export const discoverTVShows = async (params = {}) => {
  const defaultParams = {
    language: "en-US",
    sort_by: "popularity.desc",
    page: 1,
  };
  return await apiRequest("/discover/tv", { ...defaultParams, ...params });
};

// Get movies by genre
export const getMoviesByGenre = async (
  genreId,
  language = "en-US",
  page = 1
) => {
  return await discoverMovies({
    with_genres: genreId,
    language,
    page,
    sort_by: "popularity.desc",
  });
};

// Get movies by country
export const getMoviesByCountry = async (
  countryCode,
  language = "en-US",
  page = 1
) => {
  return await discoverMovies({
    with_origin_country: countryCode,
    language,
    page,
    sort_by: "popularity.desc",
  });
};

// Get movies by year
export const getMoviesByYear = async (
  year,
  language = "en-US",
  page = 1,
  sortBy = "popularity.desc"
) => {
  return await discoverMovies({
    primary_release_year: year,
    language,
    page,
    sort_by: sortBy,
  });
};

// Get TV shows by year
export const getTVShowsByYear = async (
  year,
  language = "en-US",
  page = 1,
  sortBy = "popularity.desc"
) => {
  return await discoverTVShows({
    first_air_date_year: year,
    language,
    page,
    sort_by: sortBy,
  });
};

// Get movie genres
export const getGenres = async (language = "en") => {
  return await apiRequest("/genre/movie/list", { language });
};
