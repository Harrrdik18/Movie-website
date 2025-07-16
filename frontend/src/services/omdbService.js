import axios from "axios";

const API_BASE_URL = "https://movie-website-zr27.onrender.comapi/v1/omdb";

// Configure axios to include credentials
axios.defaults.withCredentials = true;

// Helper function to make API requests
const apiRequest = async (endpoint, params = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}${endpoint}`, { params });
    return response.data;
  } catch (error) {
    console.error(`OMDB API Error: ${error.message}`);
    throw error;
  }
};

// Search movies/series by title
export const searchMovies = async (query, type = "", year = "", page = 1) => {
  const params = { s: query, page };
  if (type) params.type = type;
  if (year) params.y = year;
  return await apiRequest("/search", params);
};

// Get movie/series details by ID or title
export const getMovieDetails = async (
  imdbId = "",
  title = "",
  type = "",
  year = ""
) => {
  const params = { plot: "full" };
  if (imdbId) params.i = imdbId;
  if (title) params.t = title;
  if (type) params.type = type;
  if (year) params.y = year;
  return await apiRequest("/details", params);
};

// Get popular movies
export const getPopularMovies = async () => {
  return await apiRequest("/popular/movies");
};

// Get popular TV series
export const getPopularSeries = async () => {
  return await apiRequest("/popular/series");
};

// Get movies by year
export const getMoviesByYear = async (year, page = 1) => {
  return await apiRequest(`/movies/year/${year}`, { page });
};

// Get movies by genre (limited functionality in OMDB)
export const getMoviesByGenre = async (genre, page = 1) => {
  return await apiRequest(`/movies/genre/${genre}`, { page });
};

// Get recent movies
export const getRecentMovies = async (page = 1) => {
  return await apiRequest("/movies/recent", { page });
};

// Search for trending movies (using popular movies as fallback)
export const getTrendingMovies = async () => {
  return await getPopularMovies();
};

// Search for top rated movies (using popular movies as fallback)
export const getTopRatedMovies = async () => {
  return await getPopularMovies();
};

// Search for upcoming movies (using recent movies as fallback)
export const getUpcomingMovies = async () => {
  return await getRecentMovies();
};

// Discover movies (using search with common terms)
export const discoverMovies = async (params = {}) => {
  const { genre, year, page = 1 } = params;

  if (genre) {
    return await getMoviesByGenre(genre, page);
  }

  if (year) {
    return await getMoviesByYear(year, page);
  }

  // Default to popular movies
  return await getPopularMovies();
};

// Discover TV shows
export const discoverTVShows = async (params = {}) => {
  const { year, page = 1 } = params;

  if (year) {
    // Search for series from specific year
    return await searchMovies("series", "series", year, page);
  }

  // Default to popular series
  return await getPopularSeries();
};

// Get movies by country (limited functionality - using search)
export const getMoviesByCountry = async (countryCode, page = 1) => {
  // OMDB doesn't have direct country filtering, so we'll search by country name
  const countryNames = {
    US: "American",
    GB: "British",
    FR: "French",
    DE: "German",
    IT: "Italian",
    ES: "Spanish",
    JP: "Japanese",
    KR: "Korean",
    IN: "Indian",
    CN: "Chinese",
  };

  const countryName = countryNames[countryCode] || countryCode;
  return await searchMovies(countryName, "movie", "", page);
};

// Get TV shows by year
export const getTVShowsByYear = async (year, page = 1) => {
  return await searchMovies("series", "series", year, page);
};

// Get movie credits (not available in OMDB - return empty structure)
export const getMovieCredits = async (id) => {
  return {
    cast: [],
    crew: [],
  };
};

// Get similar movies (not available in OMDB - return empty structure)
export const getSimilarMovies = async (id) => {
  return {
    Search: [],
    totalResults: "0",
    Response: "True",
  };
};

// Get genres (OMDB doesn't have genre list - return common genres)
export const getGenres = async () => {
  return {
    genres: [
      { id: 1, name: "Action" },
      { id: 2, name: "Adventure" },
      { id: 3, name: "Animation" },
      { id: 4, name: "Comedy" },
      { id: 5, name: "Crime" },
      { id: 6, name: "Documentary" },
      { id: 7, name: "Drama" },
      { id: 8, name: "Family" },
      { id: 9, name: "Fantasy" },
      { id: 10, name: "History" },
      { id: 11, name: "Horror" },
      { id: 12, name: "Music" },
      { id: 13, name: "Mystery" },
      { id: 14, name: "Romance" },
      { id: 15, name: "Science Fiction" },
      { id: 16, name: "Thriller" },
      { id: 17, name: "War" },
      { id: 18, name: "Western" },
    ],
  };
};
