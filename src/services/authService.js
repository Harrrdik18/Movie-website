import axios from "axios";

const API_URL = "https://movie-website-zr27.onrender.com/api/v1/users";

// Configure axios to include credentials
axios.defaults.withCredentials = true;

// Register user
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    if (response.data.success) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Something went wrong" };
  }
};

// Login user
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data.success) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Something went wrong" };
  }
};

// Logout user
export const logout = async () => {
  try {
    const response = await axios.get(`${API_URL}/logout`);
    localStorage.removeItem("user");
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Something went wrong" };
  }
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/me`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Something went wrong" };
  }
};

// Update user profile
export const updateProfile = async (userData) => {
  try {
    const response = await axios.put(`${API_URL}/me/update`, userData);
    if (response.data.success) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Something went wrong" };
  }
};

// Update password
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

// Add to favorites
export const addToFavorites = async (movieData) => {
  try {
    const response = await axios.post(`${API_URL}/favorites`, movieData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Something went wrong" };
  }
};

// Remove from favorites
export const removeFromFavorites = async (movieId) => {
  try {
    const response = await axios.delete(`${API_URL}/favorites/${movieId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Something went wrong" };
  }
};

// Add to watchlist
export const addToWatchlist = async (movieData) => {
  try {
    const response = await axios.post(`${API_URL}/watchlist`, movieData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Something went wrong" };
  }
};

// Remove from watchlist
export const removeFromWatchlist = async (movieId) => {
  try {
    const response = await axios.delete(`${API_URL}/watchlist/${movieId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Something went wrong" };
  }
};
