import axios from "axios";
import type {
  OMDBMovieDetail,
  OMDBSearchResponse,
  Genre,
} from "../types";

const API_BASE_URL = "https://movie-website-zr27.onrender.com/api/v1/omdb";

axios.defaults.withCredentials = true;

const apiRequest = async <T>(
  endpoint: string,
  params: Record<string, string | number> = {}
): Promise<T> => {
  try {
    const response = await axios.get<T>(`${API_BASE_URL}${endpoint}`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error(`OMDB API Error: ${(error as Error).message}`);
    throw error;
  }
};

export const searchMovies = async (
  query: string,
  type: string = "",
  year: string = "",
  page: number = 1
): Promise<OMDBSearchResponse> => {
  const params: Record<string, string | number> = { s: query, page };
  if (type) params.type = type;
  if (year) params.y = year;
  return await apiRequest<OMDBSearchResponse>("/search", params);
};

export const getMovieDetails = async (
  imdbId: string = "",
  title: string = "",
  type: string = "",
  year: string = ""
): Promise<OMDBMovieDetail> => {
  const params: Record<string, string | number> = { plot: "full" };
  if (imdbId) params.i = imdbId;
  if (title) params.t = title;
  if (type) params.type = type;
  if (year) params.y = year;
  return await apiRequest<OMDBMovieDetail>("/details", params);
};

export const getPopularMovies = async (): Promise<OMDBSearchResponse> => {
  return await apiRequest<OMDBSearchResponse>("/popular/movies");
};

export const getPopularSeries = async (): Promise<OMDBSearchResponse> => {
  return await apiRequest<OMDBSearchResponse>("/popular/series");
};

export const getMoviesByYear = async (
  year: string | number,
  page: number = 1
): Promise<OMDBSearchResponse> => {
  return await apiRequest<OMDBSearchResponse>(`/movies/year/${year}`, {
    page,
  });
};

export const getMoviesByGenre = async (
  genre: string,
  page: number = 1
): Promise<OMDBSearchResponse> => {
  return await apiRequest<OMDBSearchResponse>(`/movies/genre/${genre}`, {
    page,
  });
};

export const getRecentMovies = async (
  page: number = 1
): Promise<OMDBSearchResponse> => {
  return await apiRequest<OMDBSearchResponse>("/movies/recent", { page });
};

export const getTrendingMovies =
  async (): Promise<OMDBSearchResponse> => {
    return await getPopularMovies();
  };

export const getTopRatedMovies =
  async (): Promise<OMDBSearchResponse> => {
    return await getPopularMovies();
  };

export const getUpcomingMovies =
  async (): Promise<OMDBSearchResponse> => {
    return await getRecentMovies();
  };

export const discoverMovies = async (
  params: { genre?: string; year?: string; page?: number } = {}
): Promise<OMDBSearchResponse> => {
  const { genre, year, page = 1 } = params;

  if (genre) {
    return await getMoviesByGenre(genre, page);
  }

  if (year) {
    return await getMoviesByYear(year, page);
  }

  return await getPopularMovies();
};

export const discoverTVShows = async (
  params: { year?: string; page?: number } = {}
): Promise<OMDBSearchResponse> => {
  const { year, page = 1 } = params;

  if (year) {
    return await searchMovies("series", "series", year, page);
  }

  return await getPopularSeries();
};

const countryNames: Record<string, string> = {
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

export const getMoviesByCountry = async (
  countryCode: string,
  page: number = 1
): Promise<OMDBSearchResponse> => {
  const countryName = countryNames[countryCode] || countryCode;
  return await searchMovies(countryName, "movie", "", page);
};

export const getTVShowsByYear = async (
  year: string | number,
  page: number = 1
): Promise<OMDBSearchResponse> => {
  return await searchMovies("series", "series", String(year), page);
};

export const getMovieCredits = async (
  _id: string
): Promise<{ cast: unknown[]; crew: unknown[] }> => {
  return { cast: [], crew: [] };
};

export const getSimilarMovies = async (
  _id: string
): Promise<OMDBSearchResponse> => {
  return { Search: [], totalResults: "0", Response: "True" };
};

export const getGenres = async (): Promise<{
  genres: Genre[];
}> => {
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
