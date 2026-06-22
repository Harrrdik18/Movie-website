import axios from "axios";

const API_URL = "https://movie-website-zr27.onrender.com/api/v1/users";

axios.defaults.withCredentials = true;

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Something went wrong" };
  }
};

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Something went wrong" };
  }
};

export const logout = async () => {
  try {
    const response = await axios.get(`${API_URL}/logout`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Something went wrong" };
  }
};

export const getUserProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/me`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Something went wrong" };
  }
};

export const updateProfile = async (userData) => {
  try {
    const response = await axios.put(`${API_URL}/me/update`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Something went wrong" };
  }
};

export const updatePassword = async (passwordData) => {
  try {
    const response = await axios.put(
      `${API_URL}/password/update`,
      passwordData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Something went wrong" };
  }
};

export const addToFavorites = async (movieData) => {
  try {
    const response = await axios.post(`${API_URL}/favorites`, movieData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Something went wrong" };
  }
};

export const removeFromFavorites = async (movieId) => {
  try {
    const response = await axios.delete(`${API_URL}/favorites/${movieId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Something went wrong" };
  }
};

export const addToWatchlist = async (movieData) => {
  try {
    const response = await axios.post(`${API_URL}/watchlist`, movieData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Something went wrong" };
  }
};

export const removeFromWatchlist = async (movieId) => {
  try {
    const response = await axios.delete(`${API_URL}/watchlist/${movieId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Something went wrong" };
  }
};
