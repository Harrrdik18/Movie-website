import axios from "axios";
import type { User, FavoriteItem, WatchlistItem } from "../types";

const API_URL = import.meta.env.DEV
  ? "http://localhost:5000/api/v1/users"
  : "https://movie-website-zr27.onrender.com/api/v1/users";

axios.defaults.withCredentials = true;

interface AuthResponse {
  user: User;
}

interface ErrorResponse {
  error: string;
}

const handleError = (error: unknown): never => {
  throw (
    (error as { response?: { data?: ErrorResponse } }).response?.data || {
      error: "Something went wrong",
    }
  );
};

export const register = async (
  userData: Record<string, unknown>
): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(
      `${API_URL}/register`,
      userData
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const logout = async (): Promise<void> => {
  try {
    await axios.get(`${API_URL}/logout`);
  } catch (error) {
    handleError(error);
  }
};

export const getUserProfile = async (): Promise<AuthResponse> => {
  try {
    const response = await axios.get<AuthResponse>(`${API_URL}/me`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateProfile = async (
  userData: Record<string, unknown>
): Promise<AuthResponse> => {
  try {
    const response = await axios.put<AuthResponse>(
      `${API_URL}/me/update`,
      userData
    );
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const updatePassword = async (
  passwordData: Record<string, unknown>
): Promise<void> => {
  try {
    await axios.put(`${API_URL}/password/update`, passwordData);
  } catch (error) {
    handleError(error);
  }
};

export const addToFavorites = async (movieData: {
  movieId: string;
  title: string;
  poster: string;
  type: string;
}): Promise<{ favorites: FavoriteItem[] }> => {
  try {
    const response = await axios.post<{
      favorites: FavoriteItem[];
    }>(`${API_URL}/favorites`, movieData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const removeFromFavorites = async (
  movieId: string
): Promise<{ favorites: FavoriteItem[] }> => {
  try {
    const response = await axios.delete<{
      favorites: FavoriteItem[];
    }>(`${API_URL}/favorites/${movieId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const addToWatchlist = async (movieData: {
  movieId: string;
  title: string;
  poster: string;
  type: string;
}): Promise<{ watchlist: WatchlistItem[] }> => {
  try {
    const response = await axios.post<{
      watchlist: WatchlistItem[];
    }>(`${API_URL}/watchlist`, movieData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const removeFromWatchlist = async (
  movieId: string
): Promise<{ watchlist: WatchlistItem[] }> => {
  try {
    const response = await axios.delete<{
      watchlist: WatchlistItem[];
    }>(`${API_URL}/watchlist/${movieId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
