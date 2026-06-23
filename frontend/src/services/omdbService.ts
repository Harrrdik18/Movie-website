import axios from "axios";
import type {
  OMDBMovieDetail,
  OMDBSearchResponse,
  Genre,
  MovieEntity,
} from "../types";

const API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:5000/api/v1/movies"
  : "https://movie-website-zr27.onrender.com/api/v1/movies";
const OMDB_FALLBACK = import.meta.env.DEV
  ? "http://localhost:5000/api/v1/omdb"
  : "https://movie-website-zr27.onrender.com/api/v1/omdb";

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
    console.error(`API Error: ${(error as Error).message}`);
    throw error;
  }
};

export const getTrendingMovies = async (): Promise<OMDBSearchResponse> => {
  return await apiRequest<OMDBSearchResponse>("/trending");
};

export const getPopularMovies = async (): Promise<OMDBSearchResponse> => {
  return await apiRequest<OMDBSearchResponse>("/popular");
};

export const getTopRatedMovies = async (): Promise<OMDBSearchResponse> => {
  return await apiRequest<OMDBSearchResponse>("/top-rated");
};

export const getUpcomingMovies = async (): Promise<OMDBSearchResponse> => {
  return await apiRequest<OMDBSearchResponse>("/upcoming");
};

export const searchMovies = async (
  query: string,
  _type: string = "",
  _year: string = "",
  _page: number = 1
): Promise<OMDBSearchResponse> => {
  return await apiRequest<OMDBSearchResponse>("/search", { q: query, page: _page });
};

export const getMovieDetails = async (
  imdbId: string = "",
  _title: string = "",
  _type: string = "",
  _year: string = ""
): Promise<OMDBMovieDetail | MovieEntity> => {
  return await apiRequest<OMDBMovieDetail | MovieEntity>(`/detail/${imdbId}`);
};

export const getSimilarMovies = async (
  _id: string
): Promise<OMDBSearchResponse> => {
  return await apiRequest<OMDBSearchResponse>(`/similar/${_id}`);
};

export const getMoviesByYear = async (
  year: string | number,
  page: number = 1
): Promise<OMDBSearchResponse> => {
  return await apiRequest<OMDBSearchResponse>("/discover", { year, page });
};

export const getMoviesByGenre = async (
  genre: string,
  page: number = 1
): Promise<OMDBSearchResponse> => {
  return await apiRequest<OMDBSearchResponse>("/discover", { genre, page });
};

export const getRecentMovies = async (
  page: number = 1
): Promise<OMDBSearchResponse> => {
  return await apiRequest<OMDBSearchResponse>("/discover", { page });
};

export const discoverMovies = async (
  params: { genre?: string; year?: string; page?: number } = {}
): Promise<OMDBSearchResponse> => {
  return await apiRequest<OMDBSearchResponse>("/discover", params as Record<string, string | number>);
};

export const discoverTVShows = async (
  params: { year?: string; page?: number } = {}
): Promise<OMDBSearchResponse> => {
  return await apiRequest<OMDBSearchResponse>("/tv", params as Record<string, string | number>);
};

export const getMoviesByCountry = async (
  countryCode: string,
  _page: number = 1
): Promise<OMDBSearchResponse> => {
  return await apiRequest<OMDBSearchResponse>(`/country/${countryCode}`);
};

export const getGenres = async (): Promise<{
  genres: Genre[];
}> => {
  return await apiRequest<{ genres: Genre[] }>("/genres");
};

export const getPopularSeries = async (): Promise<OMDBSearchResponse> => {
  return await apiRequest<OMDBSearchResponse>("/tv");
};

export const getTVShowsByYear = async (
  year: string | number,
  page: number = 1
): Promise<OMDBSearchResponse> => {
  return await apiRequest<OMDBSearchResponse>("/tv", { year, page });
};

export const getMovieCredits = async (
  _id: string
): Promise<{ cast: unknown[]; crew: unknown[] }> => {
  return { cast: [], crew: [] };
};
